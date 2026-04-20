import { Handle, Position } from '@xyflow/react';
import { User, ClipboardCheck, PlayCircle, StopCircle, Zap, ChevronRight } from 'lucide-react';

const InHandle = ({ isConnectable, colorClass = "border-slate-300 text-slate-400" }: any) => (
  <Handle 
    type="target" 
    position={Position.Left} 
    isConnectable={isConnectable} 
    className="!w-6 !h-8 !bg-transparent !border-0 flex items-center justify-center -ml-3 hover:scale-125 transition-transform cursor-crosshair z-50 group"
  >
    <div className={`w-3.5 h-4 bg-white border-2 rounded-[3px] flex items-center justify-center shadow-sm group-hover:shadow-md ${colorClass}`}>
      <ChevronRight size={10} strokeWidth={4} className="ml-[1px]" />
    </div>
  </Handle>
);

const OutHandle = ({ isConnectable, colorClass = "border-blue-400 text-blue-500" }: any) => (
  <Handle 
    type="source" 
    position={Position.Right} 
    isConnectable={isConnectable} 
    className="!w-6 !h-8 !bg-transparent !border-0 flex items-center justify-center -mr-3 hover:scale-125 transition-transform cursor-crosshair z-50 group"
  >
    <div className={`w-3.5 h-4 bg-white border-2 rounded-[3px] flex items-center justify-center shadow-sm group-hover:shadow-md ${colorClass}`}>
      <ChevronRight size={10} strokeWidth={4} className="ml-[1px]" />
    </div>
  </Handle>
);

export const StartNode = ({ data, isConnectable, selected }: any) => {
  return (
    <div className={`bg-gray-50 rounded-full border-2 ${selected ? 'border-gray-800 shadow-md ring-2 ring-gray-200' : 'border-gray-500'} px-5 py-2 shadow-sm transition-all flex items-center gap-2`}>
      <PlayCircle size={16} className="text-gray-600" />
      <h4 className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">{data.label || 'Start'}</h4>
      <OutHandle isConnectable={isConnectable} colorClass="border-gray-600 text-gray-600" />
    </div>
  );
};

export const TaskNode = ({ data, isConnectable, selected }: any) => {
  return (
    <div className={`bg-white rounded-xl border-2 ${selected ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-blue-200'} shadow-sm min-w-[200px] transition-all relative`}>
      <InHandle isConnectable={isConnectable} colorClass="border-blue-300 text-blue-400" />
      <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-t-lg border-b border-blue-200 flex items-center gap-2 font-semibold text-xs uppercase tracking-wide">
        <User size={14} />
        {data.label || 'Task Node'}
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-600 font-medium">{data.title || 'Untitled Task'}</p>
        {data.assignee && <div className="mt-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded inline-block">@ {data.assignee}</div>}
      </div>
      <OutHandle isConnectable={isConnectable} colorClass="border-blue-500 text-blue-600" />
    </div>
  );
};

export const ApprovalNode = ({ data, isConnectable, selected }: any) => {
  return (
    <div className={`bg-white rounded-xl border-2 ${selected ? 'border-emerald-500 shadow-lg ring-2 ring-emerald-100' : 'border-emerald-200'} shadow-sm min-w-[200px] transition-all relative`}>
      <InHandle isConnectable={isConnectable} colorClass="border-emerald-300 text-emerald-400" />
      <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-t-lg border-b border-emerald-200 flex items-center gap-2 font-semibold text-xs uppercase tracking-wide">
        <ClipboardCheck size={14} />
        {data.label || 'Approval Node'}
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-600 font-medium">{data.title || 'Pending Approval'}</p>
        {data.approverRole && <div className="mt-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded inline-block whitespace-nowrap">Role: {data.approverRole}</div>}
      </div>
      <OutHandle isConnectable={isConnectable} colorClass="border-emerald-500 text-emerald-600" />
    </div>
  );
};

export const AutomatedNode = ({ data, isConnectable, selected }: any) => {
  return (
    <div className={`bg-white rounded-xl border-2 ${selected ? 'border-purple-500 shadow-lg ring-2 ring-purple-100' : 'border-purple-200'} shadow-sm min-w-[200px] transition-all relative`}>
      <InHandle isConnectable={isConnectable} colorClass="border-purple-300 text-purple-400" />
      <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded-t-lg border-b border-purple-200 flex items-center gap-2 font-semibold text-xs uppercase tracking-wide">
        <Zap size={14} />
        {data.label || 'Automated Step'}
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-600 font-medium">{data.title || 'System Action'}</p>
        {data.action && <div className="mt-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block font-mono">{data.action}</div>}
      </div>
      <OutHandle isConnectable={isConnectable} colorClass="border-purple-500 text-purple-600" />
    </div>
  );
};

export const EndNode = ({ data, isConnectable, selected }: any) => {
  return (
    <div className={`bg-gray-50 rounded-full border-2 ${selected ? 'border-red-500 shadow-md ring-2 ring-red-100' : 'border-red-300'} px-5 py-2 shadow-sm transition-all flex items-center gap-2`}>
      <InHandle isConnectable={isConnectable} colorClass="border-red-400 text-red-500" />
      <StopCircle size={16} className="text-red-500" />
      <h4 className="text-[12px] font-bold text-red-600 uppercase tracking-wider">{data.label || 'End'}</h4>
    </div>
  );
};
