# keycloak & mariaDB

dev: up logs

up:
	docker compose up -d

down:
	docker compose stop

purge: down
	docker compose rm -f
	docker volume rm atari_mariadb

logs:
	docker compose logs atari-meteor

npm:
	npm i
	meteor npm i

# run everything
all:
	$(MAKE) -j3 meteor dev

# frontend
meteor:
	meteor --settings settings.json

users:
	node server/special_users.js
