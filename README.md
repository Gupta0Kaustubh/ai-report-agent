# AI Report & Analytics Agent 🚀

A modern, full-stack AI-driven web application to generate stunning algorithmic reports and interactive metrics charts dynamically. It is powered by `FastAPI` + `React (Next.js)` + `PostgreSQL` + `CrewAI`.

---

## 🔧 One-Click Setup (Highly Recommended)

The entire application is completely dockerized. All databases, schemas, huge datasets, and API endpoints are mapped, injected, and seeded **automatically** on boot! 

### Prerequisite Checklist
Before you begin, ensure you have exactly these installed on your machine:
1. **[Git](https://git-scm.com/downloads)** - to clone the repository.
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** - Make sure the Docker Engine is running in the background.

### Deployment Instructions

**1. Clone the repository natively**
```bash
git clone <repo-url>
cd ai-report-agent
```

**2. Configure your Environment Keys**  
*(If the repo requires OpenAI keys to process AI fallback layers, specify them here)*
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

**3. Build and Deploy**  
Execute this command to compile the entire ecosystem natively:
```bash
docker-compose up -d --build
```

**4. Access Your Dashboard**
- **Frontend App:** http://localhost:3000  
- **Backend Swagger Docs:** http://localhost:8000/docs  


*Note: The first time you execute step 3, our secure auto-injection scripts will automatically insert 5 massive generic corporate databases along with multi-monthly graphical plot structures natively into your PostgreSQL volume instance.*

---

## 🧪 Alternative: Manual Deployment (Without Docker)

If you strictly want to run the engines manually without containerization, follow this tree:

### 1. Database Setup
Ensure you have a local instance of PostgreSQL running natively under user `postgres` at Port `5432` with access credentials. 
```bash
psql -U postgres -d report_agent_db -f database/schema.sql
```
*(You do not strictly need to execute `seed.sql`, the FastAPI backend handles injections natively).*

### 2. Backend Instance
```bash
cd backend
python -m venv venv

# Windows format: .\venv\Scripts\activate. Linux format: source venv/bin/activate
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend Node
```bash
cd frontend
npm install
npm run dev
```