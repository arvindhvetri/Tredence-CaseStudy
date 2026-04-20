# HR Workflow Designer Module

## 📌 Project Overview
The **HR Workflow Designer** is a dynamic, full-stack application tailored for HR administrators to visually construct, configure, and simulate complex internal workflows (e.g., onboarding, leave approvals, document verification). Built as a "zero-to-one" modular system, the application heavily utilizes **React and React Flow** for its interactive canvas. To ensure scalability and robust cloud-native delivery, the entire application is containerized using **Docker** and orchestrated via **Kubernetes**.

## 🚀 Key Features
- **Interactive Drag-and-Drop Canvas:** Seamlessly build workflows using React Flow. Includes custom nodes tailored for HR: `Start Node`, `Task Node`, `Approval Node`, `Automated Step Node`, and `End Node`.
- **Dynamic Node Configuration:** Each node type has a contextual configuration panel with tailored form fields, type safety, and basic validation requirements.
- **Mock API Service Layer:** A backend layer providing dynamic automated actions (`GET /automations`) and step-by-step execution simulation (`POST /simulate`).
- **Workflow Sandbox & Validation:** A testing panel that validates graph integrity (e.g., cycles, missing connections), serializes the entire workflow, and simulates step-by-step execution.
- **Cloud-Native Deployment:** Fully dockerized application images with a provided Kubernetes deployment strategy, ensuring high availability and easy scaling.

## 🏗️ Architecture & Tech Stack
- **Frontend:** React (Vite/Next.js preferred), TypeScript, React Flow, Tailwind CSS
- **Backend / API Mock:** Python with FastAPI
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes (Bare-Metal Clusters, NodePorts)
- **Infrastructure:** AWS (3x EC2 Instances)
- **CI/CD:** Jenkins (Pipeline as Code)
- **Observability:** Prometheus, Loki & Grafana (PLG Stack)
- **Code Quality:** ESLint, Prettier, strict TypeScript typing

## 📂 Architecture & Folder Structure
```text
.
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── nodes/            # Custom React Flow node components
│   │   ├── forms/            # Dynamic configuration panels for nodes
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api/              # API interaction layer
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Main application canvas and layout
│   ├── Dockerfile
│   └── package.json
├── backend/                  # API Layer (Mock data & Simulation)
│   ├── app/
│   │   ├── routers/          # API Endpoints (/automations, /simulate)
│   │   ├── services/         # Workflow simulation logic
│   │   └── main.py           # FastAPI app entry point
│   ├── Dockerfile
│   └── requirements.txt
├── k8s/                      # Kubernetes deployment manifests
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── postgres.yaml
│   ├── prometheus.yaml       # Metrics gathering
│   ├── loki.yaml             # Log aggregation
│   ├── grafana.yaml          # Metrics & log visualization dashboard
│   ├── services.yaml
│   └── ingress.yaml
├── docker-compose.yml        # Local orchestrated development
├── Jenkinsfile               # Automation pipeline config
└── README.md
```

## ⚙️ Running Locally (Docker Compose)
The easiest way to get the full stack up and running locally is via Docker Compose.

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd HR-Workflow-Designer
   ```

2. **Build and spin up the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000` (or `5173` if Vite)
   - API Layer: `http://localhost:8000/api` (Swagger UI at `/docs`)

## 🛳️ Infrastructure & Kubernetes Deployment
The architecture is designed to function across **3 AWS EC2 Instances**:
1. **Jenkins Master Node:** Orchestrates the pipelines.
2. **Jenkins Worker & K8s Master Node:** Builds Docker images, pushes to registry, and manages the Kubernetes cluster state.
3. **K8s Worker Node:** Executes the application and observability pods.

To deploy the stack to the Kubernetes master node:
1. **Apply the Kubernetes manifests:**
   ```bash
   kubectl apply -f k8s/
   ```
2. **Verify Deployments and Services:**
   ```bash
   kubectl get pods -wide
   kubectl get svc
   ```
*Note: Applications are securely exposed to the public internet via K8s `NodePort` mapping.*

## 🧠 Design Decisions & Assumptions
- **Separation of Concerns:** Opted for a distinct separation between canvas logic, node rendering, and the API interaction layer to ensure the codebase remains highly maintainable and scalable.
- **State Management:** Used React state / context or lightweight libraries (e.g., Zustand) for predictable and reliable workflow parsing. Forms strictly use controlled components.
- **Mock API Server:** Although persistence is not strictly required, a modular FastAPI mock server in Python was chosen to align with the core backend skills requested and to simulate realistic API latency and real-world backend responses.
- **Type Safety:** The entire workflow logic (edges, node types, attributes) relies on TypeScript interfaces to catch configuration discrepancies during validation.

## 🔮 Future Enhancements
- Export/Import workflow configuration as raw JSON.
- Implement auto-layout for complex nodes.
- Introduce persistent backend storage using PostgreSQL.
- Add advanced CI/CD pipelines via GitHub Actions.
