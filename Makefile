# keycloak & mariaDB
dev:
	docker compose -f docker-compose-dev.yml up

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
	node special_users.js