#!/bin/bash

echo "=° Minting LCC Tokens..."

# Check required environment variables
if [ -z "$LCC_PKG_ID" ]; then
  echo "L Error: LCC_PKG_ID is not set"
  echo "=¡ Set it with: export LCC_PKG_ID=<package_id_from_deployment>"
  exit 1
fi

if [ -z "$LCC_TREASURY_CAP_ID" ]; then
  echo "L Error: LCC_TREASURY_CAP_ID is not set"
  echo "=¡ Set it with: export LCC_TREASURY_CAP_ID=<treasury_cap_id_from_deployment>"
  exit 1
fi

# Amount to mint: 1,000,000,000,000 (1 trillion with 9 decimals)
MINT_AMOUNT=1000000000000000000000

echo " Using LCC_PKG_ID: $LCC_PKG_ID"
echo " Using LCC_TREASURY_CAP_ID: $LCC_TREASURY_CAP_ID"
echo " Minting amount: 1,000,000,000,000 LCC tokens"

# Switch to root-auth address (required for minting)
echo "= Switching to root-auth address..."
iota client switch --address root-auth

# Mint LCC tokens
echo ">™ Minting LCC tokens..."
iota client call \
  --package "$LCC_PKG_ID" \
  --module "LCC" \
  --function "mint" \
  --args \
    "$LCC_TREASURY_CAP_ID" \
    "$MINT_AMOUNT" \
  --gas-budget 500000000

if [ $? -eq 0 ]; then
  echo " Successfully minted 1,000,000,000,000 LCC tokens!"
  echo "=¡ The minted tokens have been transferred to the root-auth address"
else
  echo "L Error: Failed to mint LCC tokens"
  exit 1
fi