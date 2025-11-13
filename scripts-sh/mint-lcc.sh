#!/bin/bash

source .env

echo "=� Minting LCC Tokens..."

# Check required environment variables
if [ -z "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" ]; then
  echo "L Error: IOTA_CUSTOM_NOTARIZATION_PKG_ID is not set"
  echo "=� Set it with: export IOTA_CUSTOM_NOTARIZATION_PKG_ID=<package_id_from_deployment>"
  exit 1
fi

if [ -z "$LCC_TREASURY_CAP_ID" ]; then
  echo "L Error: LCC_TREASURY_CAP_ID is not set"
  echo "=� Set it with: export LCC_TREASURY_CAP_ID=<treasury_cap_id_from_deployment>"
  exit 1
fi

# Amount to mint: 1,000,000
MINT_AMOUNT=10000000000000000000

echo "Using IOTA_CUSTOM_NOTARIZATION_PKG_ID: $IOTA_CUSTOM_NOTARIZATION_PKG_ID"
echo "Using LCC_TREASURY_CAP_ID: $LCC_TREASURY_CAP_ID"
echo "Minting amount: 1,000,000,000,000 LCC tokens"

# Switch to root-auth address (required for minting)
echo "= Switching to root-auth address..."
iota client switch --address root-auth

# Mint LCC tokens
echo "> Minting LCC tokens..."
iota client call \
  --package "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" \
  --module "LCC" \
  --function "mint" \
  --args \
    $LCC_TREASURY_CAP_ID \
    "$MINT_AMOUNT" \
  --gas-budget 500000000
