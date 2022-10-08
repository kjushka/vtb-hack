run:
	docker compose build --no-cache
	docker compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

logs: run
	docker-compose logs -f

restart: down logs