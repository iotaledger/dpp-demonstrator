# Backend API Documentation

## Overview

The DPP Demonstrator backend exposes REST APIs for role management within the IOTA Trusted Hierarchies (ITH) system. The server is implemented in Rust using the Axum framework and requires authentication via API key.

## Configuration

### Environment Variables

- `TCP_LISTNER`: Server address and port (default: `0.0.0.0:3001`)
- `API_KEY`: API key for authentication (required)
- `IOTA_HIERARCHIES_PKG_ID`: IOTA Hierarchies contract package ID
- Other configuration parameters for keystore and blockchain

### Authentication

All APIs require the `x-api-key` header with a valid key.

```bash
curl -H "x-api-key: 12345" http://localhost:3001/roles
```

## Endpoints

### POST `/roles`

Assigns a specific role to a user within an ITH federation.

#### Request Parameters

```json
{
  "user_addr": "0x...", // User address (Object ID)
  "user_role": "Manufacturer" | "Repairer", // Role to assign
  "federation_addr": "0x..." // ITH federation address
}
```

#### Success Response

```json
{
  "message": "User 0x... granted Manufacturer permission on federation 0x..."
}
```

#### Error Response

```json
{
  "message": "Failed to set permission: [error details]"
}
```

#### Status Codes

- `200 OK`: Role assigned successfully
- `401 Unauthorized`: Missing or invalid API key  
- `500 Internal Server Error`: Error during role assignment

#### Usage Example

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: 12345" \
  -d '{
    "user_addr": "0x1234567890abcdef",
    "user_role": "Repairer",
    "federation_addr": "0xfederation123"
  }' \
  http://localhost:3001/roles
```

## Internal Workflow

### Role Assignment Workflow

1. **Request Validation**: Validates parameter format and authentication
2. **ITH Client Creation**: Initializes blockchain client with `MANUFACTURER_ALIAS`
3. **Attestation Creation**: Creates an ITH attestation with:
   - Property name: `"role"`
   - Property value: specified role (lowercase)
   - Timespan: default
4. **On-chain Validation**: Verifies that the attestation was created correctly

### Error Handling

The system handles different types of errors:
- Object ID parsing errors
- Blockchain connection errors
- ITH attestation creation errors
- Trusted properties validation errors

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Client    │───▶│  Axum Router     │───▶│ Permission      │
│                 │    │  (auth middleware│    │ Handler         │
└─────────────────┘    │   + routing)     │    └─────────────────┘
                       └──────────────────┘             │
                                                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Blockchain      │◄───│ ITH Client      │
                       │  Service         │    │                 │
                       └──────────────────┘    └─────────────────┘
```

## Security

- **Authentication**: API key required for all endpoints
- **Validation**: Format checking for blockchain addresses
- **Logging**: Error logging for debugging
- **CORS**: Not configured (internal use only)

## Limitations

- Only supports `Manufacturer` and `Repairer` roles
- Requires a keystore configured with `MANUFACTURER_ALIAS`
- Does not support role revocation (assignment only)
- No rate limiting included
