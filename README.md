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

## 🔁 Mapping Microservice (AI-Powered Control Mapping)

The `mapping/` folder contains a **FastAPI-based microservice** designed to intelligently compare and map controls between different standards using semantic similarity.

### 💡 Overview

- Accepts two Excel or JSON files
- Extracts control titles and content
- Encodes them with `paraphrase-MiniLM-L6-v2`
- Compares embeddings using **cosine similarity**
- Returns matched pairs with a similarity score and summary

---

### 🚀 How to Run the Mapping API

1. **Navigate to the folder**:
   ```bash
   cd backend/mapping
Start the API server:
uvicorn main:app --reload
