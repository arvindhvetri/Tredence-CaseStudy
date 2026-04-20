from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
import time

# Create all database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HR Workflow API")

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/automations")
def get_automations():
    """Mock API returning automated actions"""
    return [
        { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
        { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
        { "id": "notify_slack", "label": "Notify Slack", "params": ["channel", "message"] }
    ]

@app.post("/api/simulate", response_model=schemas.SimulationResponse)
def simulate_workflow(request: schemas.SimulationRequest):
    """Parses a workflow and simulates its execution"""
    logs = ["Starting workflow simulation..."]
    
    # Very basic simulation logic iterating over nodes
    for node in request.nodes:
        node_id = node.get("id")
        node_type = node.get("type", "unknown")
        node_data = node.get("data", {})
        label = node_data.get("label", f"Node {node_id}")
        
        # Simulate execution latency
        time.sleep(0.1)
        logs.append(f"Executing step '{label}' (Type: {node_type})... Success.")
        
    logs.append("Workflow simulation completed successfully.")
    
    return {"status": "success", "logs": logs}

@app.post("/api/workflows", response_model=schemas.WorkflowResponse)
def create_workflow(workflow: schemas.WorkflowCreate, db: Session = Depends(database.get_db)):
    db_workflow = models.Workflow(
        name=workflow.name,
        nodes=workflow.nodes,
        edges=workflow.edges
    )
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@app.get("/api/workflows", response_model=list[schemas.WorkflowResponse])
def get_workflows(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    workflows = db.query(models.Workflow).offset(skip).limit(limit).all()
    return workflows
