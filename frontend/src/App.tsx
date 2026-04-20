import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant
} from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './nodes/CustomNodes';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

function DesignerFlow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({
      ...connection,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onUpdateNode = (id: string, updatedData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: updatedData,
          };
        }
        return node;
      })
    );
  };

  const onDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId(null);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationLogs(['Sending workflow to simulation engine...']);

    try {
      const payload = {
        name: "Test Flow",
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edges: edges.map(e => ({ source: e.source, target: e.target }))
      };
      // It will use the EC2 IP from docker-compose, or fallback to localhost if you run it locally
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.logs) {
        setSimulationLogs(prev => [...prev, ...data.logs]);
      } else {
        setSimulationLogs(prev => [...prev, 'Simulation completed with unexpected response.']);
      }

    } catch (error: any) {
      setSimulationLogs(prev => [...prev, `Simulation failed: ${error.message}`]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: `Workflow ${new Date().toLocaleString()}`,
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edges: edges.map(e => ({ source: e.source, target: e.target }))
      };
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_BASE_URL}/api/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Workflow saved successfully!");
      } else {
        alert("Failed to save workflow.");
      }
    } catch (error: any) {
      alert(`Error saving workflow: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-50 font-sans">
      <SidebarLeft />

      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          connectOnClick={true}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 }
          }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="react-flow-custom"
        >
          <Controls className="bg-white shadow-md border border-slate-200 rounded-lg overflow-hidden" />
          <Background gap={16} size={1} color="#cbd5e1" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>

      <SidebarRight
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onDeleteNode={onDeleteNode}
        onSimulate={handleSimulate}
        simulationLogs={simulationLogs}
        isSimulating={isSimulating}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DesignerFlow />
    </ReactFlowProvider>
  );
}
