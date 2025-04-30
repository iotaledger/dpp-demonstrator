# 🚀 IOTA DPP Demonstrator

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
2. **IOTA CLI**:`cargo install --locked --git https://github.com/iotaledger/iota.git --tag v0.12.0-rc --features tracing iota`

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

### 3. Publish the ITH package:

```bash
make publish-ith
```
Copy the generated ITH_PKG_ID for later use

### 4. Bootstrap the ITH federation:

```bash
make init-ith
```
Copy the generated FEDERATION_ID.

### 5. Deploy the Audit Trails contract:

```bash
make publish-audit-trails-contract
```

Save the following outputs:
* AUDIT_TRAIL_PKG
* WHITELIST_ID
* ADMIN_CAP_ID

### 6. Create a new product:

```bash
export AUDIT_TRAIL_PACKAGE_ADDRESS=<AUDIT_TRAIL_PKG>
export FEDERATION_ADDR=<FEDERATION_ID>
```

```bash
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
NEXT_PUBLIC_DAPP_URL=https://dpp-demostrator.if4testing.rocks
NEXT_PUBLIC_AUDIT_TRAIL_PKG=0x760581b3e74bb50dabd89a66e007df9c74b46c5ce26a3b114d4fe458d6d8a380
NEXT_PUBLIC_REWARD_WHITELIST_ID=0xwhitelist
NEXT_PUBLIC_ADMIN_CAP_ID=0xadmincap
NEXT_PUBLIC_REFRESH_INTERVAL_MS=5000
NEXT_PUBLIC_DAPP_URL=https://dpp-demostrator.if4testing.rocks
BACKEND_ENDPOINT=http://backend:3001
BACKEND_API_KEY=12345
GAS_STATION_URL=http://iota-gas-station:9527
ITH_PKG_ID=0xfef5a9c6df130e8f60677689f3f414bbaa2b5a31f463a12fd174a925efa604bb
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

## 📌 Notes
* The IOTA Identity integration is planned but not yet implemented.

* The Audit Trails smart-contract is intentionally simplified for demonstration purposes.

Ensure you use the correct CLI version (v0.12.0-rc) to avoid compatibility issues.