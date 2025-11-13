#!/bin/bash

source .env

echo "🔐 Top-up DPP with LCC..."

# --- Required env vars -------------------------------------------------------
if [ -z "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" ]; then
  echo "⛔ Error: IOTA_CUSTOM_NOTARIZATION_PKG_ID is not set"
  echo "💡 export IOTA_CUSTOM_NOTARIZATION_PKG_ID=<package_id_from_deployment>"
  exit 1
fi

if [ -z "$LCC_VAULT_ID" ]; then
  echo "⛔ Error: LCC_VAULT_ID is not set"
  echo "💡 export LCC_VAULT_ID=<shared_vault_object_id>"
  exit 1
fi

if [ -z "$LCC_COIN_ID" ]; then
  echo "⛔ Error: LCC_COIN_ID is not set"
  echo "💡 export LCC_COIN_ID=<coin_object_id_with_sufficient_balance>"
  exit 1
fi

if [ -z "$PRODUCT_ID" ]; then
  echo "⛔ Error: PRODUCT_ID is not set"
  echo "💡 export PRODUCT_ID=<address_of_dpp>"
  exit 1
fi


TOP_UP_AMOUNT=1000000000000000000
GAS_BUDGET="${GAS_BUDGET:-500000000}"

echo "📦 IOTA_CUSTOM_NOTARIZATION_PKG_ID:  $IOTA_CUSTOM_NOTARIZATION_PKG_ID"
echo "🏦 LCC_VAULT_ID:     $LCC_VAULT_ID"
echo "🪙 LCC_COIN_ID:      $LCC_COIN_ID"
echo "🏷️  PRODUCT_ID:         $PRODUCT_ID"
echo "➕ TOP_UP_AMOUNT:    $TOP_UP_AMOUNT (static)"


echo "➡️  Calling top_up_dpp..."
iota client call \
  --package "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" \
  --module "lcc_reward" \
  --function "top_up_dpp" \
  --args \
    "$LCC_VAULT_ID" \
    "$LCC_COIN_ID" \
    "$TOP_UP_AMOUNT" \
    "$PRODUCT_ID" \
  --gas-budget "$GAS_BUDGET"

CALL_STATUS=$?
if [ $CALL_STATUS -ne 0 ]; then
  echo "❌ top_up_dpp failed (exit $CALL_STATUS)"
  exit $CALL_STATUS
fi
echo "✅ top_up_dpp executed."

# --- Verify locked value with read_dpp_value ---------------------------------
echo "🔎 Reading DPP locked value..."
iota client call \
  --package "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" \
  --module "lcc_reward" \
  --function "read_dpp_value" \
  --args \
    "$LCC_VAULT_ID" \
    "$PRODUCT_ID" \
  --gas-budget "$GAS_BUDGET"
