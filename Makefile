up:
	docker-compose up --build

down:
	docker-compose down

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev