# 🔐 GRCStack 

**GRCStack** is a full-stack web platform that automates the auditing and mapping of **GRC (Governance, Risk, and Compliance)** standards such as **ISO 27001**, **PCI DSS**,"SWIFT CSCF",....

The platform combines a modern web UI with a smart backend capable of **detecting control similarities** using NLP and vector embeddings to **automate cross-standard mapping**.

---

## 🧠 Key Features

- 🧾 **Project & Audit Management**  
  Organize your audits by project, year, and standard.

- 🧠 **Smart Control Mapping**  
  Uses **Sentence Transformers** (MiniLM) and **cosine similarity** to match controls between Excel or JSON-based frameworks.

- 📊 **PDF Reports & Statistics**  
  Export structured audit results and mapping summaries.

- 🛠️ **Corrective Actions Tracking**  
  Associate actions to non-compliant controls.

- 🌐 **Multi-framework Support**  
  Currently supports SWIFT CSCF, PCI DSS, and Algerian frameworks. Easily extendable.

---

## 🧰 Tech Stack

| Layer      | Tools                                                                 |
|------------|-----------------------------------------------------------------------|
| Frontend   | ReactJS, TailwindCSS, Redux Toolkit                                  |
| Backend    | Node.js, Express, MongoDB, JWT, Joi                                  |
| Mapping AI | FastAPI (Python), `sentence-transformers`, `sklearn`, `openpyxl`, `pandas` |
| Dev Tools  | VS Code, GitHub, Postman, MongoDB Compass                            |

---


---

## 🔁 Mapping Microservice (AI-Powered Control Mapping)

The `mapping/` folder contains a **FastAPI-based microservice** designed to intelligently compare and map controls between different standards using **semantic similarity**.

### 💡 Overview

- Accepts two Excel or JSON files
- Extracts control titles and content
- Encodes them with `paraphrase-MiniLM-L6-v2`
- Compares embeddings using **cosine similarity**
- Returns matched pairs with a similarity score and summary
- 🧠 **In Development**: Adds automatic **mapping classification** into:
  - `Equivalent` — controls have the same intent  
  - `Subset` — control A is a more specific form of B  
  - `Superset` — control A is more general than B  
  - `Non-Equivalent` — unrelated or dissimilar controls

This classification aims to **enhance audit accuracy** and provide **clear traceability** across compliance frameworks.

---

### 🚀 How to Run the Mapping API

To run the full GRCStack system (AI Mapping + Web Platform), follow these steps:

---

#### 🧠 Start the Mapping Microservice (FastAPI)

1. Navigate to the mapping service folder:
   ```bash
   cd mappingscripts
Run the API server:
uvicorn main:app --reload
📍 Access the API at: http://localhost:8000/docs

🧩 Start the Web Backend (Node.js)
Navigate to the backend folder:
 ```bash
cd web/backend

Start the development server:
  ```bash
  npm run dev

🎨 Start the Frontend (React)
Open a new terminal and go to the frontend:
cd web/frontend
Launch the React app:
 ```bash
npm start
