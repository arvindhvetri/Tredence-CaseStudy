# FlowHR Designer - React Frontend Client

This directory contains the entire frontend React application for the FlowHR Designer. It is a modern, responsive, and highly interactive drag-and-drop workflow builder designed specifically to satisfy the requirements of the Full Stack Engineering Case Study natively scaling toward a production environment.

## 🎯 Case Study Requirements & Our Architecture

The instructions strictly necessitated an intuitive GUI explicitly designed to structure logical HR workflows. Here is a definitive breakdown of exactly what was asked, and structurally how it was addressed in the frontend codebase over the course of development:

### 1. Visual Drag-and-Drop Workflow Canvas
**The Ask:** Build a modular canvas where specific nodes ("Start", "Human Task", "Approval", "End") can be infinitely positioned, connected, and visualized.
**Our Solution:** 
Instead of building a rudimentary grid, we utilized **`@xyflow/react` (React Flow)**. 
- In `App.tsx`, we instantiate `<ReactFlow>` and map over our custom `nodeTypes`. 
- Our `SidebarLeft.tsx` component utilizes the native HTML5 Drag-and-Drop API. When a user begins dragging a node from the palette, we capture the `onDragStart` event, extract the specific nodetype as data, and calculate the exact `X,Y` drop coordinates utilizing our `reactFlowWrapper` reference logic to programmatically inject the node directly into global state!

### 2. Node-Specific Dynamic Configuration
**The Ask:** When a node is physically clicked on the canvas, a configuration panel must open rendering highly specific input arrays (e.g. Approvals require an "Approver" drop-down).
**Our Solution:**
- `SidebarRight.tsx` intercepts the `selectedNodeId` implicitly tracked by React Flow. 
- It actively renders completely different JSX components (Text inputs vs Selects) dependent *entirely* upon `node.type`. A "Task" type renders Assignee fields; an "Automated Action" dynamically changes its UI to support Email or API webhooks.
- Data bindings immediately push state adjustments directly back into the parent `nodes` array utilizing the powerful React `setNodes` hook, ensuring lightning-fast reactivity without causing prop drilling.

### 3. Backend Logic Integration
**The Ask:** Hitting "Simulate" must dispatch an action to a mock or physical server environment, which mimics the behavior of executing the logical sequence of connected node arrays.
**Our Solution:**
- We engineered an asynchronous `handleSimulate` pipeline! Instead of resolving locally, we construct a deep multi-dimensional JSON payload of connected Node/Edge arrays completely mapped to standard API contracts.
- **Dynamic Routing:** We utilized `window.location.hostname` intelligently wrapped inside literal string interpolation in `App.tsx` so fetch requests securely hit the `FastAPI` instance dynamically without requiring hardcoded static IPs that break over Kubernetes load balancers. 
- A specialized terminal UI inside `SidebarRight.tsx` streams simulated text outputs parsed directly from the JSON backend response back to the user to visually prove process execution!

---

## 🛠️ Technology Stack
* **Framework:** React 18 via Vite (In-memory server HMR + optimized production chunking).
* **Language:** TypeScript.
* **Canvas Engine:** React Flow (`@xyflow/react`).
* **Styling:** TailwindCSS for rapid, utility-first UI design patterns.
* **Icons:** `lucide-react` for beautiful, lossless SVG iconography.

---

## 📂 Core Folder & File Structure

```text
frontend/
├── Dockerfile              # The multi-stage Nginx CI/CD engine explicitly engineered for K8s deployment
├── package.json            # Lists all npm dependencies (React Flow, Tailwind, Lucide, etc.)
└── src/                    
    ├── App.tsx             # THE ENGINE. Houses the routing, React Flow Canvas, and API Node graph mapping.
    ├── index.css           # Global CSS, Tailwind directives, and customized React Flow background overrides.
    └── components/         
        ├── SidebarLeft.tsx  # The Palette UI (Start, Task, End, etc.) wrapping HTML5 draggable items.
        └── SidebarRight.tsx # The State-reactive Node Editor overriding UI schema dynamically based on selections.
```

---

## 🐳 Dockerization & The Nginx Production Build

To strictly satisfy the "Docker/Kubernetes Architecture Bonus" requirement, standard local deployments (`npm run dev`) were absolutely insufficient for a scalable environment. Ergo, we built a **Multi-Stage CI/CD Production Build Pipeline**:

1. **Stage 1 (Node Build):** Utilizing `node:20-alpine`, `npm run build` is executed. Vite heavily minifies and chunks the raw Typescript into completely static lightweight HTML/JS. 
2. **Environment Variable Injection:** Since static HTML processes cannot physically read Kubernetes `env` variables on the fly like Python apps, we execute a custom shell command `echo "VITE_API_URL=$VITE_API_URL" > .env` explicitly inside the Dockerfile. Jenkins interpolates the Kubernetes AWS IP into Docker dynamically so the frontend is completely decoupled!
3. **Stage 2 (Nginx Edge Serving):** The compiled static contents are pushed natively into an `nginx:stable-alpine` container, safely resolving port `80`. Nginx serves these edge static files with practically zero Memory utilization.
