init-accounts:
	cd backend && cargo run --bin init_accounts
import-accounts:
	cd backend && cargo run --bin import_accounts
faucet:
	cd backend && cargo run --bin faucet
publish-hierarchies:
	git clone https://github.com/iotaledger/hierarchies.git
	cd hierarchies/hierarchies-move && iota client switch --address root-auth && iota client publish --with-unpublished-dependencies --skip-dependency-verification --json --gas-budget 5000000000 .
init-hierarchies:
	cd backend && iota client switch --address root-auth && cargo run --bin init_hierarchies
init-dids:
	cd backend && iota client switch --address manu-fact && cargo run --bin init_dids
verify-dids:
	cd backend && iota client switch --address manu-fact && cargo run --bin verify_dids
build-audit-trails-contract:
	cd contract && iota move build
publish-audit-trails-contract:
	cd contract && iota client switch --address root-auth && iota client publish --with-unpublished-dependencies --skip-dependency-verification --json --gas-budget 5000000000 .
create-new-product:
	iota client switch --address manu-fact && ./scripts-sh/new-product.sh
mint-llc:
	iota client switch --address root-auth && ./scripts-sh/mint-lcc.sh
run-frontend:
	cd frontend && npm run dev
run-prod-frontend:
	cd frontend && npm run build && npm run start
run-backend:
	cd backend && cargo run
build-frontend:
	git pull && docker-compose down && docker-compose build frontend && docker-compose up -d
dev-start:
	./scripts-sh/dev-start.sh
dev-stop:
	./scripts-sh/dev-stop.sh
