| :warning: WARNING                                                                                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------- |
| This repository is for reference and is not a fully-functional or regulation-compliant DPP application. It was built to showcase how IOTA components can power real-world use cases, using Digital Product Passports as one example. |


# 🚀 IOTA DPP Showcase

This repository demonstrates how multiple products from the IOTA portfolio can be orchestrated to build a Digital Product Passport (DPP).

In the demo scenario, you act as a Repairer operating inside a permissioned environment supervised by a Root of Authority (e.g., a public agency) and a Manufacturer. The authorization chain is:

`Root of Authority ──authorize──▶ Manufacturer ──authorize──▶ Repairer`


## 🔧 Technologies Showcased

This demonstrator integrates several IOTA technologies:

| Capability | IOTA Product |
| ---        | ---          |
|Tokenized incentives| **NFT Reward System**|
|Ledger & transaction explorer| **IOTA Explorer**|
|On-ledger access control| **IOTA Hierarchies**|
|Feeless user experience| **IOTA Gas Station**|
|Product traceability| **IOTA Custom Notarization**|
|Decentralized identity| **IOTA Identity**|
|User wallet & Tx signing| **IOTA Wallet & Nightly Wallet**|


## ✅ Prerequisites

Before starting, ensure you have the following tools installed:

1. **Docker**
1. **Rust**
1. [**IOTA CLI**](https://docs.iota.org/developer/references/cli):
    ```
    cargo install --locked \
      --git https://github.com/iotaledger/iota.git \
      --tag v1.6.1 \
      --features tracing iota
    ```
1. [**Lefthook**](https://lefthook.dev/installation/index.html): it manages git hooks
    - Install on MacOS: `brew install lefthook`. For more supported installations see: https://lefthook.dev/installation/index.html
    - After installing: update your terminal session and install hooks: `lefthook install`
1. [**Hashicorp Copywrite**](https://github.com/hashicorp/copywrite): it manages copywrite header on source files


## ⚙️ Environment Variables Setup
Follow these steps to prepare the DPP environment:

### 1. Initialize Accounts:
```bash
make init-accounts
```
This will create the Root of Authority, Manufacturer, and Gas Station accounts.


### 2. Fund the Accounts:

```bash
make faucet
```

### 3. Bootstrap IOTA Hierarchies Federation:

```bash
make init-hierarchies
```
[Here](https://github.com/iotaledger/hierarchies/blob/main/hierarchies-move/Move.lock) you can find IOTA_HIERARCHIES_PKG_ID
Copy the generated FEDERATION_ID.

### 4. Deploy the Custom Notarization Contract:

```bash
make publish-custom-notarization-contract
```

From the Transaction Save the following outputs:
* AUDIT_TRAIL_PKG
* WHITELIST_ID
* ADMIN_CAP_ID
* VAULT_ID
* LCCTreasuryCap

### 5. Create DIDs

You must generate one per environment, given they are deployed to different domains.

```bash
make init-dids
```
[Here](https://github.com/iotaledger/identity/blob/main/identity_iota_core/packages/iota_identity/Move.lock) you can find IDENTITY_PKG_ID.

Save the output for the DID and the domain linkage configuration.
Save the JWT credential accordinly to the environment; for development place it at `frontend/public/.well-known/did-configuration.dev.json` or at `frontend/public/.well-known/did-configuration.prod.json` for production.

### 6. Create a New Product:

Here you must also generate one per environment.

```bash
export AUDIT_TRAIL_PKG=<AUDIT_TRAIL_PKG>
export FEDERATION_ID=<FEDERATION_ID>
export MANUFACTURER_DID=<MANUFACTURER_DID>
```
Use the corresponding `MANUFACTURER_DID` for the target environment.

```bash
make create-new-product
```
Save the generated PRODUCT_ID.

### 7. Mint LCC Tokens
```bash
make mint-llc 
```

### 8. Top Up the Reward Vault
```bash
make top-up-reward-pool
```


## ▶️ Running the dApp
To run the frontend application:

1. Create an .env file in the project root based on the .env.example.

2. Convert your Gas Station secret key to base64 and insert it into config.yaml:

```bash
iota keytool convert [GAS_STATION_SECRET_KEY]
```
3. Start the application:
Configure the DNS, the Traefik load balancer and allocate the VM.

```bash
make dev-start
```
4. Open your browser and navigate to: `http://localhost:3000/introduction/1`


## 🔧 Backend Architecture

The project backend is developed in Rust and provides:

### REST APIs
- **Endpoint**: `/roles` for IOTA Hierarchies role management
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
│   ├── transaction.rs # Signing/execution
│   ├── lib.rs
│   └── utils.rs
├── routes/            # API routing
├── handlers/          # Business logic
├── services/          # Blockchain services
├── scripts/           # Setup automation
└── config/
```


## 📌 Notes
* The IOTA Identity integration is implemented with domain linkage support.

* The Custom Notarization smart-contract is intentionally simplified for demonstration purposes.

* Backend documentation available in `backend/docs/`.

* The app works better with Chrome based browsers.
