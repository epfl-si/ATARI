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
	$(MAKE) -j3 tunnel meteor dev

# frontend
meteor:
	ATARI_ENVIRONMENT=local meteor

# https://gitlab.epfl.ch/si-idevfsd/bastion
tunnel:
	ssh -N -L3307:db-cadi-staging.epfl.ch:3306 bastion-test

users:
	node server/special_users.js