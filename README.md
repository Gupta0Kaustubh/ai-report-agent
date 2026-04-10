# AI Report Agent 🚀

## 🔧 Setup (Recommended - Docker)

### 1. Clone repo
git clone <repo-url>
cd ai-report-agent

### 2. Create env file
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

### 3. Start everything
docker-compose up --build

### 4. Access
Frontend → http://localhost:3000  
Backend → http://localhost:8000/docs  

---

## 🧪 Without Docker

### Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev

---

## 🗄️ Database Setup

Run:

psql -U postgres -d report_agent_db -f database/schema.sql
psql -U postgres -d report_agent_db -f database/seed.sql

---

## 👥 Contribution

- Create feature branch
- Push changes
- Raise PR