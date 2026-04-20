
import { PlayCircle, User, ClipboardCheck, Zap, StopCircle } from 'lucide-react';

export const SidebarLeft = () => {
  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col pt-4">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          HR
        </div>
        <span className="font-bold text-lg text-slate-800">Tredence Designer</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider px-2">Node Palette</p>
        <div className="space-y-3">
          
          <DraggableNode type="start" icon={PlayCircle} label="Start Event" color="text-gray-500" />
          <DraggableNode type="task" icon={User} label="Human Task" color="text-blue-500" />
          <DraggableNode type="approval" icon={ClipboardCheck} label="Approval Step" color="text-emerald-500" />
          <DraggableNode type="automated" icon={Zap} label="Automated Action" color="text-purple-500" />
          <DraggableNode type="end" icon={StopCircle} label="End Event" color="text-red-500" />
          
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        Drag and drop nodes onto the canvas to build your workflow.
      </div>
    </div>
  );
};

const DraggableNode = ({ type, icon: Icon, label, color }: any) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors shadow-sm"
      onDragStart={onDragStart}
      draggable
    >
      <Icon size={18} className={color} />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}
