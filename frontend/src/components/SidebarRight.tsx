import { useState } from 'react';
import { Settings, Play, ChevronRight, Trash2 } from 'lucide-react';

export const SidebarRight = ({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode,
  onSimulate, 
  simulationLogs, 
  isSimulating 
}: any) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'sandbox'>('properties');

  const NodePropertiesForm = () => {
    if (!selectedNode) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm">
          <Settings size={32} className="mb-3 opacity-50" />
          Select a node to edit properties
        </div>
      );
    }

    const { type, data, id } = selectedNode;

    const handleChange = (key: string, value: any) => {
      onUpdateNode(id, { ...data, [key]: value });
    };

    return (
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Node Title</label>
            <input 
              type="text" 
              value={data.title || ''} 
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>

          {type === 'task' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assignee</label>
                <input 
                  type="text" 
                  value={data.assignee || ''} 
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. hr_manager, employee"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={data.dueDate || ''} 
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  value={data.description || ''} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task description..."
                />
              </div>
            </>
          )}

          {type === 'approval' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Approver Role</label>
                <select 
                  value={data.approverRole || ''} 
                  onChange={(e) => handleChange('approverRole', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role...</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="HRBP">HR Business Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Auto-approve Threshold (Days)</label>
                <input 
                  type="number" 
                  value={data.autoApproveThreshold || ''} 
                  onChange={(e) => handleChange('autoApproveThreshold', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'automated' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Action</label>
                <select 
                  value={data.action || ''} 
                  onChange={(e) => handleChange('action', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Action...</option>
                  <option value="send_email">Send Email</option>
                  <option value="generate_doc">Generate Document</option>
                  <option value="notify_slack">Notify Slack</option>
                </select>
              </div>
              {data.action === 'send_email' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">To</label>
                    <input 
                      type="text" 
                      value={data.to || ''} 
                      onChange={(e) => handleChange('to', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Subject</label>
                    <input 
                      type="text" 
                      value={data.subject || ''} 
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              {data.action === 'generate_doc' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Template</label>
                  <input 
                    type="text" 
                    value={data.template || ''} 
                    onChange={(e) => handleChange('template', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {data.action === 'notify_slack' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Channel</label>
                  <input 
                    type="text" 
                    value={data.channel || ''} 
                    onChange={(e) => handleChange('channel', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <button 
          onClick={() => onDeleteNode(id)}
          className="w-full mt-4 flex justify-center items-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-colors shadow-sm"
        >
          <Trash2 size={16} /> Delete Node
        </button>
      </div>
    );
  };

  return (
    <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col pt-4">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-slate-800">Workflow Inspector</h2>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button 
          className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'sandbox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('sandbox')}
        >
          Sandbox
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' ? (
          NodePropertiesForm()
        ) : (
          <div className="space-y-4 flex flex-col h-full">
            <button 
              onClick={onSimulate}
              disabled={isSimulating}
              className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-white font-medium transition-all ${isSimulating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}
            >
              <Play size={16} />
              {isSimulating ? 'Simulating...' : 'Simulate Workflow'}
            </button>

            <div className="flex-1 bg-slate-900 rounded-lg p-3 overflow-y-auto font-mono text-xs text-green-400">
              {simulationLogs?.length === 0 ? (
                <div className="text-slate-500 italic h-full flex items-center justify-center opacity-50">Click simulate...</div>
              ) : (
                <div className="space-y-1">
                  {simulationLogs?.map((log: string, index: number) => (
                    <div key={index} className="flex gap-2">
                       <ChevronRight size={14} className="text-slate-500 shrink-0 mt-0.5" />
                       <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
