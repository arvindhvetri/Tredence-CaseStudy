from pydantic import BaseModel
from typing import List, Dict, Any

class WorkflowBase(BaseModel):
    name: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowResponse(WorkflowBase):
    id: int

    class Config:
        from_attributes = True

class SimulationRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    
class SimulationResponse(BaseModel):
    status: str
    logs: List[str]
