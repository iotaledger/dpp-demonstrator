init-accounts:
	cd backend && cargo run --bin init_accounts
import-accounts:
	cd backend && cargo run --bin import_accounts
faucet:
	cd backend && cargo run --bin faucet
publish-ith:
	cd backend/ith/scripts && iota client switch --address root-auth && ./publish_ith.sh
init-ith:
	cd backend && cargo run --bin init_ith
build-audit-trails-contract:
	cd contract && iota move build
publish-audit-trails-contract:
	cd contract && iota client switch --address root-auth && iota client publish --with-unpublished-dependencies --skip-dependency-verification --json --gas-budget 5000000000 .
create-new-product:
	iota client switch --address manu-fact && ./scripts-sh/new_product.sh
run-frontend:
	cd frontend && npm run dev
run-prod-frontend:
	cd frontend && npm run build && npm run start
run-backend:
	cd backend && cargo run
run-docker-containers:
	docker compose down && docker compose up
build-frontend:
	docker compose build frontend
