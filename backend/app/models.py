from sqlalchemy import Column, Integer, String, JSON
from .database import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    nodes = Column(JSON) # Store React Flow Nodes
    edges = Column(JSON) # Store React Flow Edges
