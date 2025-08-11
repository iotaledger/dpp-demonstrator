# Backend Documentation

Complete documentation for the IOTA DPP Demonstrator backend.

## Overview

The backend is a Rust application that provides:
- REST APIs for ITH role management
- Automated scripts for setup and configuration
- Integration with IOTA blockchain and Identity framework
- Keystore and transaction management

## Available Documents

### [API Documentation](API.md)
Complete REST API documentation:
- `/roles` endpoint for role assignment
- Authentication and security
- Usage examples
- Error handling

### [Scripts Documentation](SCRIPTS.md) 
Setup and configuration scripts guide:
- Account and keystore setup
- ITH federation initialization
- Decentralized identity management
- Complete setup workflow

## Quick Start

### 1. Initial Configuration
```bash
cd backend
cargo run --bin init_accounts
cargo run --bin faucet
```

### 2. ITH Setup
```bash
export ITH_PKG_ID="0x..."
cargo run --bin init_ith
```

### 3. Start Server
```bash
export API_KEY="12345"
cargo run --bin main
```

### 4. Test API
```bash
curl -H "x-api-key: 12345" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3001/roles \
     -d '{"user_addr":"0x...","user_role":"Repairer","federation_addr":"0x..."}'
```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└─────────┬───────┘
          │ HTTP API
          ▼
┌─────────────────┐
│   Backend       │
│   (Rust/Axum)   │
├─────────────────┤
│ • API Routes    │
│ • ITH Service   │
│ • Identity Mgmt │
│ • Keystore      │
└─────────┬───────┘
          │ RPC
          ▼
┌─────────────────┐
│ IOTA Blockchain │
│ • ITH Contract  │
│ • Identity      │
│ • Transactions  │
└─────────────────┘
```

## Technologies

- **Rust**: Main programming language
- **Axum**: Web framework for REST APIs
- **IOTA SDK**: Blockchain interaction
- **ITH (Trusted Hierarchies)**: Permission management
- **IOTA Identity**: Decentralized identities
- **Tokio**: Async runtime

## Development

### Prerequisites
- Rust 1.70+
- IOTA CLI
- Docker (for complete environment)

### Project Structure
```
backend/
├── src/
│   ├── lib/           # Reusable modules
│   ├── routes/        # API routing
│   ├── handlers/      # Request handlers
│   ├── services/      # Business logic
│   ├── scripts/       # Setup scripts
│   └── main.rs        # Entry point
├── docs/              # Documentation
└── Cargo.toml         # Rust dependencies
```

### Testing
```bash
cargo test
cargo check
```

## Troubleshooting

See specific documentation for:
- [Script issues](SCRIPTS.md#troubleshooting)
- [API errors](API.md#error-handling)

## Security

- API key required for authentication
- Keystore protected locally
- Testnet only for development
- Detailed logging for audit