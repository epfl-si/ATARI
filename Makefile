# keycloak & mariaDB

dev: up logs

up:
	docker compose -f docker-compose-dev.yml up -d

logs:
	docker compose -f docker-compose-dev.yml logs atari-meteor

npm:
	npm i
	meteor npm i

# run everything
all:
	$(MAKE) -j3 meteor dev

# frontend
meteor:
	ATARI_ENVIRONMENT=local meteor

users:
	node server/special_users.js