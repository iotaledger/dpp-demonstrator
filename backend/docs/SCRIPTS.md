# Backend Scripts Documentation

## Overview

The backend includes a series of Rust scripts to configure and manage the DPP Demonstrator infrastructure. The scripts handle accounts, ITH federations, and decentralized identities (DIDs).

## Available Scripts

### 1. `init_accounts` - Account Initialization

**File**: `src/scripts/init_accounts.rs`

**Purpose**: Creates the main system accounts (Root Authority, Manufacturer, Gas Station)

**Operation**:
- Initializes the local keystore (`../keystore/iota.keystore`)
- Generates new keys for the three main roles:
  - `root-auth`: Root of Authority
  - `manu-fact`: Manufacturer
  - `gas-stat`: Gas Station

**Usage**:
```bash
cargo run --bin init_accounts
```

**Output**: Keystore with three configured accounts

---

### 2. `import_accounts` - Account Import

**File**: `src/scripts/import_accounts.rs`

**Purpose**: Imports existing accounts from private keys

**Required environment variables**:
- `ROOT_AUTH_SECRET_KEY`: Root Authority private key
- `MANUFACTURER_SECRET_KEY`: Manufacturer private key

**Operation**:
- Reads private keys from environment variables
- Imports accounts into keystore using IOTA CLI
- Initializes keystore if it doesn't exist

**Usage**:
```bash
export ROOT_AUTH_SECRET_KEY="iotaprivkey1q..."
export MANUFACTURER_SECRET_KEY="iotaprivkey1q..."
cargo run --bin import_accounts
```

---

### 3. `faucet` - Account Funding

**File**: `src/scripts/faucet.rs`

**Purpose**: Requests funds from testnet faucet for all accounts

**Operation**:
- Retrieves addresses of the three accounts from keystore
- Makes requests to IOTA testnet faucet
- Faucet endpoint: `https://faucet.testnet.iota.cafe/gas`

**Usage**:
```bash
cargo run --bin faucet
```

**Prerequisites**: Accounts already configured in keystore

---

### 4. `init_hierarchies` - ITH Initialization

**File**: `src/scripts/init_hierarchies.rs`

**Purpose**: Configures the ITH (IOTA Trusted Hierarchies) federation

**Required environment variables**:
- `ITH_PKG_ID`: ITH contract package ID

**Operation**:
1. **Federation creation**: Creates a new Federation
2. **Federation Properties**: Adds the Property `role` with values `manufacturer` and `repairer`
3. **Attestation**: Creates attestation for the Manufacturer
4. **Accreditation**: Enables the Manufacturer to create attestations for Repairers
5. **Persistence**: Saves the `federation_id` in `../data/ith.json`

**Usage**:
```bash
export ITH_PKG_ID="0x..."
cargo run --bin init_hierarchies
```

**Output**: Federation ID for subsequent use

---

### 5. `init_dids` - DID Generation

**File**: `src/scripts/init_dids.rs`

**Purpose**: Creates DID (Decentralized Identifier) with domain linkage

**Required environment variables**:
- `NEXT_PUBLIC_DAPP_URL`: Domain URL to link
- `IOTA_IDENTITY_PKG_ID`: Identity package ID

**Operation**:
1. Creates DID document for the Manufacturer
2. Adds LinkedDomainService for domain linkage
3. Generates Domain Linkage Credential
4. Publishes the DID on-chain

**Usage**:
```bash
export NEXT_PUBLIC_DAPP_URL="https://dpp-demonstrator.example.com"
export IOTA_IDENTITY_PKG_ID="0x..."
cargo run --bin init_dids
```

**Output**: DID configuration JSON for `/.well-known/did-configuration.json`

---

### 6. `verify_dids` - DID Verification

**File**: `src/scripts/verify_dids.rs`

**Purpose**: Validates the domain linkage between DID and domain

**Required environment variables**:
- `NEXT_PUBLIC_DAPP_URL`: Domain URL
- `MANUFACTURER_DID`: Manufacturer's DID

**Operation**:
1. Resolves the DID document
2. Extracts LinkedDomainServices
3. Retrieves domain linkage configuration from domain
4. Validates Domain Linkage Credential signature

**Usage**:
```bash
export MANUFACTURER_DID="did:iota:..."
cargo run --bin verify_dids
```

## Complete Setup Workflow

To fully configure the system, run the scripts in this order:

1. **Account configuration**:
   ```bash
   cargo run --bin init_accounts
   # or
   cargo run --bin import_accounts
   ```

2. **Funding**:
   ```bash
   cargo run --bin faucet
   ```

3. **Hierarchies setup**:
   ```bash
   export ITH_PKG_ID="0x..."
   cargo run --bin init_hierarchies
   ```

4. **Identity setup** (optional):
   ```bash
   export NEXT_PUBLIC_DAPP_URL="https://..."
   export IOTA_IDENTITY_PKG_ID="0x..."
   cargo run --bin init_dids
   cargo run --bin verify_dids
   ```

## Generated Files

The scripts create the following files and folders:

```
../
├── keystore/
│   └── iota.keystore          # Account keys
└── data/
    └── ith.json              # Federation data
```

## Troubleshooting

### Common Errors

1. **"No key found for alias"**: Run `init_accounts` or `import_accounts` first
2. **"ITH_PKG_ID not set"**: Configure the environment variable
3. **"Failed to connect to network"**: Check internet connection
4. **"Insufficient funds"**: Run `faucet` to get testnet funds
