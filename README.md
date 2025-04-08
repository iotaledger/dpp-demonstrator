# 🚀 IOTA DPP Demonstrator

This demonstrator showcases how various components of the IOTA product portfolio work in synergy to create a decentralized permissioned process (DPP).

In this scenario, the user takes on the role of a **Repairer**, interacting within a permissioned system governed by a **Root of Authority** (typically a governmental entity) and a **Manufacturer**. The authorization hierarchy is as follows:

`Root of Authority --authorize--> Manufacturer --authorize--> Repairer`

---

## 🔧 Technologies Showcased

This demonstrator integrates several IOTA technologies:

- **Tokenization** (NFT Reward System)
- **IOTA Explorer**
- **IOTA Trusted Hierarchies (ITH)**
- **IOTA Gas Station**
- **IOTA Audit Trails**
- **IOTA Identity** *(To be implemented)*
- **Nightly Wallet** (for user authentication and transaction signing)

---

## ✅ Prerequisites

Before starting, ensure you have the following tools installed:

1. **Docker** 
2. **IOTA CLI**:`cargo install --locked --git https://github.com/iotaledger/iota.git --tag v0.11.4-rc --features tracing iota`
3. **Nightly Wallet Browser Extension**

---

## ⚙️ Environment Setup
Follow these steps to prepare the DPP environment:

### 1. Initialize accounts:
```bash
make init-accounts
```
This will create the Root of Authority, Manufacturer, and Gas Station accounts.


### 2. Fund the accounts using the testnet faucet:

```bash
make faucet
```

### 3. Switch the CLI to the Root of Authority address:

```bash
iota client switch --address root-auth
```

### 4. Publish the IOTA Trusted Hierarchy contract:

```bash
make publish-ith
```
Save the generated ITH_PKG_ID to ./backend/.env.

### 5. Initialize the ITH Federation:

```bash
make init-ith
```
Save the generated FEDERATION_ID.

### 6. Publish the Audit Trails smart contract:

update into ITH_PKG_ID, ROOT_AUTH_SECRET_KEY, MANUFACTURER_SECRET_KEY into `./backend/.env`

```bash
make publish-audit-trails-contract
```

### 7. Create a new product:

update variable AUDIT_TRAIL_PACKAGE_ADDRESS, FEDERATION_ADDR into `./scripts-sh/new_product.sh`

```bash
iota client switch --address manu-fact
make create-new-product
```
Save the generated PRODUCT_ID.

---

## ▶️ Running the dApp
To run the frontend application:

1. Create an .env file in the project root based on the .env.example.

```txt
GAS_STATION_AUTH=12345
NEXT_PUBLIC_EXPLORER_URL=https://explorer.rebased.iota.org
NEXT_PUBLIC_AUDIT_TRAIL_PKG=0x760581b3e74bb50dabd89a66e007df9c74b46c5ce26a3b114d4fe458d6d8a380
NEXT_PUBLIC_REFRESH_INTERVAL_MS=5000
BACKEND_ENDPOINT=http://backend:3001
BACKEND_API_KEY=12345
GAS_STATION_URL=http://iota-gas-station:9527
ITH_PKG_ID=0xfef5a9c6df130e8f60677689f3f414bbaa2b5a31f463a12fd174a925efa604bb
API_KEY=12345
TCP_LISTNER=0.0.0.0:3001
ROOT_AUTH_SECRET_KEY=iotaprivkey1qpl6hj5h9ax9fsmulh35us7rvnqalyckhzh58qvrpwmze9u6zulzxlca83x
MANUFACTURER_SECRET_KEY=iotaprivkey1qqkr770u0cw7fggqz7dd527t79pm7r2fmdt49mw0kkhsetkd2zdpsggvtth
```

2. Convert your Gas Station secret key to base64 and insert it into config.yaml:

```bash
iota keytool convert [GAS_STATION_SECRET_KEY]
```
3. Start the application:

```bash
docker compose up
```
4. Open your browser and navigate to: `åhttp://localhost:3000/dpp/[[PRODUCT_ID]]`

---

## 📌 Notes
The IOTA Identity integration is planned but not yet implemented.

Ensure you use the correct CLI version (v0.11.4-rc) to avoid compatibility issues.