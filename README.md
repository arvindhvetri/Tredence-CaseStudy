# 🚀 FlowHR Designer - Full-Stack Enterprise Kubernetes Platform

Welcome to the definitive **FlowHR Designer** documentation. This file serves as the ultimate "Source of Truth" for the entire project. It documents the architecture, networking, infrastructure, CI/CD methodology, and granular container port mappings.

This project is an end-to-end, locally hosted, cloud-native HR workflow automation platform developed specifically as a Full Stack Engineering Case Study submission.

---

## 🎯 The Case Study: Objectives vs. Execution

The goal of the assignment was to build an interactive, modular HR Workflow UI interacting with a robust backend API. Below is an exact mapping of the requirements and how this architecture aggressively over-delivered on those expectations:

| Case Study Requirement | How We Achieved It |
| :--- | :--- |
| **Interactive Flow UI** | Leveraged the powerful `@xyflow/react` (React Flow) library to build an infinitely scrollable, zoomable HTML5 Canvas natively supporting drag-and-drop nodes. |
| **Dynamic Configuration** | Built `SidebarRight.tsx`, a state-reactive configuration panel that instantly parses the schema of the specific node selected and dynamically renders corresponding input fields. |
| **Backend Integration & Simulation** | Developed a highly performant **Python FastAPI** layer that parses complex nested YAML/JSON Node payloads and iteratively simulates latency to validate logic arrays, returning live streaming logs. |
| **Data Persistence (Nice to have)** | Implemented full persistence utilizing SQLAlchemy ORM mapping over a **PostgreSQL** relational database. Workflows are physically saved and recallable across browser reloads. |
| **Dockerization & CI/CD (Bonus)** | Engineered absolute zero-touch CI/CD pipelines natively in Groovy (`Jenkinsfile_k8s`). Code commits instantly trigger Multi-Stage Alpine Docker builds deployed over Jenkins to Kubernetes. |
| **Observability (Beyond Bonus)** | Deployed the absolute industry standard stack: **Prometheus** (Metrics), **Loki/Promtail** (Log streaming directly out of EC2 containerd paths), and **Grafana** (Visualization). |

---

## 🏛️ 1. Master System Architecture

The project shifts entirely away from monolithic development into a **Microservices Kubernetes Architecture**.

### 1a. Application Tier
*   **The Frontend (Client):** Developed in React 18 using TypeScript and Vite. It is served statically in production using an ultra-lightweight **Nginx** Alpine container.
*   **The Backend (API):** A high-throughput Python REST API built using **FastAPI** and SQLAlchemy. 

### 1b. Infrastructure & Database Tier
*   **The Database:** Utilizes `postgres:15-alpine`. To prevent data-loss, PostgreSQL is deployed securely using a **StatefulSet** coupled with an absolute `PersistentVolume` (PV) and `PersistentVolumeClaim` (PVC) bound locally to `/var/lib/tredence/postgres-data`.
*   **The Platform:** A custom-built, self-hosted multi-node **Kubernetes** cluster running directly on AWS EC2 worker nodes.

### 1c. Observability & Logging Stack
*   **Prometheus:** A massive Time-Series Database (TSDB) that actively Scrapes K8s API states, discovers application endpoints, and ingests metrics every 15 seconds.
*   **Loki & Promtail:** The definitive log aggregation stack. `Promtail` runs as a DaemonSet to scrape raw node container logs directly out of `/var/log/pods/` and pipelines them internally to Loki.
*   **Grafana:** The single pane of glass visualization tool that queries both Loki and Prometheus simultaneously.

---

## 🔌 2. The Comprehensive Networking & Port Matrix

Below is the literal exact mapping of every minute port utilized natively across the K8s internal Docker networks.

### Application Ports
| Service / Pod | Internal Container Port | K8s Target Port | K8s Service Type | External / EC2 Port (NodePort) | Purpose |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Backend API** | `8000` | `8000` | **NodePort** | **`30080`** | Receives synchronous fetch API requests directly from the user's web browser (`/api/workflows`) over HTTP. |
| **Frontend UI** | `80` (Nginx) | `80` | **NodePort** | **Dynamic** *(e.g. 31442)*| Serves minified JS/HTML files statically to the end-user. Auto-assigned a NodePort between 30000-32767. |
| **PostgreSQL** | `5432` | `5432` | **ClusterIP** (None) | **Closed** | Explicitly locked down Headless Service. Only the internal K8s Backend Pod can resolve or connect to this via internal K8s DNS. |

### Observability Ports
| Service / Pod | Internal Container Port | K8s Target Port | K8s Service Type | External Level / EC2 Port | Purpose |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Grafana** | `3000` | `3000` | **NodePort** | **Dynamic** | The public dashboard UI. Exposed publicly via AWS. |
| **Prometheus** | `9090` | `9090` | **NodePort** | **Dynamic** | Publicly accessible TSDB API Interface for debugging raw PromQL. |
| **Loki** | `3100` | `3100` | **ClusterIP** | **Closed** | Internal log-ingestion endpoint. Only Promtail and Grafana can connect to this over `loki-service`. |

### AWS Security Group Requirements (EC2 CNI Inter-Node Traffic)
For Kube-Proxy to appropriately forward a request from a Worker node across the Container Native Interface (CNI), the AWS Security groups MUST allow internal instances to route traffic over **ALL UDP/TCP Ports**. Strict firewalls will drop encapsulation packets silently causing a `Timeout`.

---

## 🤖 3. The Jenkins CI/CD Lifecycle Pipeline

The orchestrator connecting Github to Production is a single `Jenkinsfile_k8s` Groovy script that executes upon every Github commit.

1.  **Clone:** Jenkins pulls down the exact latest Head of the `main` branch.
2.  **Build Stage:** Initiates `sudo docker build` commands on the worker. 
    *   *The Crucial Fix:* Jenkins dynamically utilizes `--build-arg VITE_API_URL` to securely interpolate the AWS EC2 Master IP address directly into the Alpine Node static build so no proxy routing logic is required natively. 
3.  **Push Stage:** Authenticates dynamically using Jenkins Credentials (`dockerhub-creds`) to push the newest images into Docker Hub.
4.  **Tag Injection:** Executes GNU `sed` to rewrite the physical Docker tag placeholders within `k8s/frontend.yaml` prior to applying.
5.  **Provision Kubernetes:** Sequentially runs `kubectl apply -f` across Namespaces, Databases, Apps, and Monitoring stacks.
6.  **Rollout Restart (Zero-Downtime):** Physically executes `kubectl rollout restart deployment/tredence-frontend` to force K8s to tear down replica sets gracefully and pull the freshly generated Docker Hub image in the background without causing an outage.

---

## 👨‍💻 4. Engineer's Troubleshooting Command Cheat Sheet

Everything belongs to the isolated namespace `tredence`. These terminal commands are the lifeline to K8s administration. 

### Statuses and Debugging
```bash
# Verify exactly which NodePorts got assigned to Grafana and Frontend UI
kubectl get svc -n tredence

# Check standard pod deployment statuses and CrashLoopBackOff Errors
kubectl get pods -n tredence

# Inspect why a single pod failed to initialize (ImagePullBackOff, Pending, Error)
kubectl describe pod <THE-POD-NAME> -n tredence
```

### Viewing Logs Directly via CLI (Bypassing Loki)
```bash
# Stream the raw stdout output live from your backend FastAPI pod processing requests
kubectl logs -f <BACKEND-POD-NAME> -n tredence
```

### Inspecting PostgreSQL Persistence
To mathematically prove the UI accurately saved the data via standard internal routing through K8s services:
```bash
# 1. Access the completely isolated Postgres container natively:
kubectl exec -it tredence-postgres-0 -n tredence -- psql -U hr_user -d hr_workflow_db

# 2. Extract Data (Once the connection establishes -> hr_workflow_db=>)
SELECT id, name FROM workflows;

# To cleanly terminate the SQL session
\q
```
---

## 📸 5. Application ScreenShots
<img width="1550" height="827" alt="Out1" src="https://github.com/user-attachments/assets/5522fe7e-3d51-45c1-835e-023680124f59" />
<img width="1340" height="526" alt="Out2" src="https://github.com/user-attachments/assets/3dcc37ea-ba78-43f9-ac55-a12596d349c1" />
<img width="1337" height="704" alt="Out3" src="https://github.com/user-attachments/assets/586cbdb1-2bc9-4866-941b-ce7560e458b6" />
<img width="1110" height="592" alt="Out4" src="https://github.com/user-attachments/assets/44dd0ed8-304b-4acd-a06e-a61beb9daf73" />

---
## 📄 6. Output Document

[Tredence-CaseStudy.pdf](https://github.com/user-attachments/files/26914590/Tredence-CaseStudy.pdf)
