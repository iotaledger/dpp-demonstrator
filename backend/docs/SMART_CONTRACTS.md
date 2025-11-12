# Smart Contracts Documentation

## Overview

The DPP Demonstrator implements a product lifecycle tracking system using 4 smart contracts deployed on IOTA blockchain. The contracts handle product registration, custom notarization logging, and reward distribution.

## Architecture

```
┌─────────────────┐    ┌───────────────────────────────┐
│   audit_trails  │───▶│   IOTA Hierarchies Contract   │
│   (main app)    │    │         (permissions)         │
└─────────┬───────┘    └───────────────────────────────┘
          │
          ▼
┌─────────────────┐    ┌──────────────────┐
│   nft_rewards   │    │   rwr + vault    │
│   (NFT badges)  │    │   (token system) │
└─────────────────┘    └──────────────────┘
```

## Smart Contracts

### 1. audit_trails::app (`audit_trails.move`)

**Purpose**: Main application logic for product lifecycle management

**Key Functions**:
- `new_product()`: Register a new product in the system
- `log_entry_data()`: Log maintenance/repair entries

**Data Structures**:
```move
public struct Product has key, store {
    id: UID,
    federation_addr: address,
    name: String,
    serial_number: String, 
    manufacturer: String,
    image_url: String,
    bill_of_materials: VecMap<String, String>,
    timestamp: u64
}

public struct ProductEntry has key, store {
    id: UID,
    issuer_role: Role,
    issuer_addr: address,
    entry_data: VecMap<String, String>,
    timestamp: u64
}
```

**Permissions**: 
- **Manufacturer**: Can create products and log entries
- **Repairer**: Can only log maintenance entries
- Roles validated through IOTA Hierarchies

**Events**:
- `ProductEntryLogged`: Emitted when products are created or entries logged

---

### 2. audit_trails::nft_reward (`nft_rewards.move`)

**Purpose**: NFT reward system for demo participants

**Key Functions**:
- `send_reward()`: Mint NFT badge for users who log entries
- `authorize_address()`: Whitelist addresses for rewards (admin only)

**Data Structures**:
```move
public struct RewardNFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
}

public struct WHITELIST has key, store {
    id: UID,
    hasMinted: VecMap<address, bool>
}
```

**Reward Logic**:
- Users receive NFT badge after logging their first entry
- One NFT per address (whitelist controlled)
- Fixed metadata: "DPP Demonstrator Badge"

---

### 3. audit_trails::rwr (`rwr.move`)

**Purpose**: RWR (Real World Reward) token definition

**Token Details**:
- Symbol: `RWR`
- Name: `IOTA RWR` 
- Decimals: 9
- Icon: https://i.imgur.com/VSaCWsf.png

**Functions**:
- Standard coin operations (mint, burn, transfer)
- Admin-only minting (sender must be @0x0)

**Note**: Currently unused in main application flow

---

### 4. audit_trails::vault (`vault.move`)

**Purpose**: Token vault for DPP reward distribution

**Functions**:
- `top_up_dpp()`: Fund a specific product's reward pool
- `send_reward()`: Distribute tokens (currently unused)
- `read_dpp_value()`: Check remaining balance

**Configuration**:
- `REWARD_VALUE`: 1,000,000,000 (1 RWR token)

**Note**: Prepared for token rewards but not integrated

## Deployment Workflow

### 1. Deploy Contracts
```bash
make build-custom-notarization-contract
make publish-custom-notarization-contract
```

**Outputs to save**:
- `AUDIT_TRAIL_PKG`: Package ID
- `WHITELIST_ID`: Whitelist object ID  
- `ADMIN_CAP_ID`: Admin capability ID

### 2. Create Product
```bash
export AUDIT_TRAIL_PKG=<package_id>
export FEDERATION_ID=<ith_federation_id>
export MANUFACTURER_DID=<manufacturer_did>
make create-new-product
```

**Script**: `scripts-sh/new_product.sh`
**Sample Product**: Berner BACSD-1 drill with detailed bill of materials

## Integration Points

### IOTA Hierarchies Integration
```move
use ith::main::{Federation, validate_trusted_properties};
```
- Validates user roles before allowing operations
- Ensures only authorized Manufacturers can create products  
- Ensures only authorized Repairers can log entries

### Event System
```move
event::emit(ProductEntryLogged {
    issuer_role: Role::Manufacturer,
    product_addr: p_addr,
    entry_addr: option::none()
});
```
- All operations emit events for frontend tracking
- Events indexed by product address and role

## Security Considerations

### Demo-Appropriate Security
✅ **Good for Demo**:
- IOTA Hierarchies role validation
- Admin capability protection
- Event emission for auditability

⚠️ **Demo Limitations** (not production-ready):
- Silent failures in NFT minting
- No input sanitization for strings
- Hardcoded reward metadata
- No emergency pause functionality

### Access Control
- **Manufacturer**: Create products, log entries
- **Repairer**: Log entries only  
- **Admin**: Manage NFT whitelist
- **System**: Mint tokens (requires @0x0 sender)

## Error Codes

```move
const E_INVALID_ROLE: u64 = 0;           // Invalid role string
const E_MISMATCHED_VECTOR_LENGTHS: u64 = 1;  // Vector length mismatch  
const E_MISMATCHED_FEDERATION: u64 = 2;      // Federation mismatch
const ENotSystemAddress: u64 = 1;            // Not system address
```

## Frontend Integration

### Key Objects to Track
- **Products**: Shared objects, accessible by address
- **ProductEntries**: Transferred to product address
- **RewardNFTs**: Transferred to user addresses
- **WHITELIST**: Shared object for admin management

### Event Listening
```typescript
// Listen for ProductEntryLogged events
const filter = {
    MoveEventType: `${packageId}::app::ProductEntryLogged`
};
```

## Limitations & Future Improvements

### Current Demo Limitations
1. **Token rewards unused**: RWR/Vault system not integrated
2. **Fixed NFT metadata**: No customization per entry type
3. **Silent failures**: NFT minting fails silently if not whitelisted
4. **Basic validation**: No deep validation of DID format or content

### Potential Enhancements
1. Integrate token rewards based on entry type
2. Dynamic NFT metadata based on repair complexity  
3. Add product lifecycle status (active, retired, recalled)
4. Implement upgrade/migration capabilities
5. Add batch operations for enterprise use
