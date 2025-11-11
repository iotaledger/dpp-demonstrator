# 🚀 IOTA DPP Showcase

This repository demonstrates how multiple products from the IOTA portfolio can be orchestrated to build a Decentralized Permissioned Process (DPP).

In the demo scenario, you act as a Repairer operating inside a permissioned environment supervised by a Root of Authority (e.g., a public agency) and a Manufacturer. The authorization chain is:

`Root of Authority ──authorize──▶ Manufacturer ──authorize──▶ Repairer`

---

## 🔧 Technologies Showcased

This demonstrator integrates several IOTA technologies:

| Capability | IOTA Product |
| ---        | ---          |
|Tokenized incentives| **NFT Reward System**|
|Ledger & transaction explorer| **IOTA Explorer**|
|On-ledger access control| **IOTA Trusted Hierarchies (ITH)**|
|Feeless user experience| **IOTA Gas Station**|
|End-to-end traceability| **IOTA Audit Trails**|
|Decentralized identity| **IOTA Identity** *(planned)*|
|User wallet & Tx signing| **Nightly Wallet**|

---

## ✅ Prerequisites

Before starting, ensure you have the following tools installed:

1. **Docker**
2. **IOTA CLI**:`cargo install --locked --git https://github.com/iotaledger/iota.git --tag v1.6.1 --features tracing iota`
3. **Lefthook**: it manages git hooks
    - Install on MacOS: `brew install lefthook`
        - For more supported installations see: https://lefthook.dev/installation/index.html
    - After installing: update your terminal session and install hooks: `lefthook install`
4. **Hashicorp Copywrite**: it manages license header
    - Install on MacOS making use of brew, see: https://github.com/hashicorp/copywrite

---

## ⚙️ Environment Variables Setup
Follow these steps to prepare the DPP environment:

### 1. Initialize accounts:
```bash
make init-accounts
```
This will create the Root of Authority, Manufacturer, and Gas Station accounts.


### 2. Fund the accounts:

```bash
make faucet
```

### 3. Bootstrap the ITH federation:

```bash
make init-hierarchies
```
[Here](https://github.com/iotaledger/hierarchies/blob/main/hierarchies-move/Move.lock) you can find HIERARCHIES_PKG_ID
Copy the generated FEDERATION_ID.

### 4. Deploy the Audit Trails contract:

```bash
make publish-audit-trails-contract
```

From the Transaction Save the following outputs:
* AUDIT_TRAIL_PKG
* WHITELIST_ID
* ADMIN_CAP_ID
* VAULT_ID
* LCCTreasuryCap

### 5. Create DIDs
```bash
make init-dids
```
[Here](https://github.com/iotaledger/identity/blob/main/identity_iota_core/packages/iota_identity/Move.lock) you can find IDENTITY_PKG_ID.

Save the output for the did and the domain linkage configuration.
Save the JWT credential into `frontend/public/.well-known/did-configuration.json`

### 6. Create a new product:

```bash
export AUDIT_TRAIL_PKG=<AUDIT_TRAIL_PKG>
export FEDERATION_ID=<FEDERATION_ID>
export MANUFACTURER_DID=<MANUFACTURER_DID>
```

```bash
make create-new-product
```
Save the generated PRODUCT_ID.

### 7. Mint LCC Tokens
```bash
make mint-llc 
```

### 8. Top up the reward vault
```bash
make top-up-reward-pool
```

---

## ▶️ Running the dApp
To run the frontend application:

1. Create an .env file in the project root based on the .env.example.

```txt
GAS_STATION_AUTH=12345
NEXT_PUBLIC_EXPLORER_URL=https://explorer.rebased.iota.org
NEXT_PUBLIC_DAPP_URL=https://dpp-demostrator.if4testing.rocks
NEXT_PUBLIC_AUDIT_TRAIL_PKG=0x760581b3e74bb50dabd89a66e007df9c74b46c5ce26a3b114d4fe458d6d8a380
NEXT_PUBLIC_REWARD_WHITELIST_ID=0xwhitelist
NEXT_PUBLIC_ADMIN_CAP_ID=0xadmincap
NEXT_PUBLIC_REFRESH_INTERVAL_MS=5000
NEXT_PUBLIC_DAPP_URL=https://dpp-demostrator.if4testing.rocks
BACKEND_ENDPOINT=http://backend:3001
BACKEND_API_KEY=12345
GAS_STATION_URL=http://iota-gas-station:9527
HIERARCHIES_PKG_ID=0xfef5a9c6df130e8f60677689f3f414bbaa2b5a31f463a12fd174a925efa604bb
API_KEY=12345
TCP_LISTNER=0.0.0.0:3001
ROOT_AUTH_SECRET_KEY=iotaprivkey1qpl6hj5h9ax9fsmulh35us7rvnqalyckhzh58qvrpwmze9u6zulzxlca83x
MANUFACTURER_SECRET_KEY=iotaprivkey1qqkr770u0cw7fggqz7dd527t79pm7r2fmdt49mw0kkhsetkd2zdpsggvtth
CLOUDFLARE_DNS_API_TOKEN=
```

2. Convert your Gas Station secret key to base64 and insert it into config.yaml:

```bash
iota keytool convert [GAS_STATION_SECRET_KEY]
```
3. Start the application:
Configure the DNS, the Traefik load balancer and allocate the VM.

```bash
docker-compose up -d
```
4. Open your browser and navigate to: `http://cafe.foo/dpp/[[PRODUCT_ID]]`

---

---

## 🔧 Backend Architecture

The project backend is developed in Rust and provides:

### REST APIs
- **Endpoint**: `/roles` for ITH role management
- **Authentication**: API key via `x-api-key` header
- **Documentation**: [Backend API docs](backend/docs/API.md)

### Setup Scripts
The backend includes automated configuration scripts:
- `init_accounts`: Main account creation
- `faucet`: Testnet account funding
- `init_hierarchies`: Hierarchies federation setup
- `init_dids`: Decentralized identity generation
- **Documentation**: [Backend Scripts docs](backend/docs/SCRIPTS.md)

### Module Structure
```
backend/src/
├── lib/               # Modular libraries
│   ├── keystore.rs    # Keystore/wallet management
│   ├── identity.rs    # DID/credential operations
│   └── transaction.rs # Signing/execution
├── routes/            # API routing
├── handlers/          # Business logic
├── services/          # Blockchain services
└── scripts/           # Setup automation
```

---

## 📌 Notes
* The IOTA Identity integration is implemented with domain linkage support.

* The Audit Trails smart-contract is intentionally simplified for demonstration purposes.

* Backend documentation available in `backend/docs/`.
