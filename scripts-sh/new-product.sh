#!/bin/bash

source .env

if [ -z "$FEDERATION_ID" ]; then
  echo "❌ Error: FEDERATION_ID is not set"
  exit 1
fi

if [ -z "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" ]; then
  echo "❌ Error: IOTA_CUSTOM_NOTARIZATION_PKG_ID is not set"
  exit 1
fi

if [ -z "$MANUFACTURER_DID" ]; then
  echo "❌ Error: MANUFACTURER_DID is not set"
  exit 1
fi

echo "✅ Using FEDERATION_ID: $FEDERATION_ID"
echo "✅ Using IOTA_CUSTOM_NOTARIZATION_PKG_ID: $IOTA_CUSTOM_NOTARIZATION_PKG_ID"
echo "✅ Using MANUFACTURER_DID: $MANUFACTURER_DID"

SERIAL_NUMBER="EB-48V-2024-001337"
PRODUCT_NAME="Pro 48V Battery"
MANUFACTURER="EcoBike"
IMAGE_URL="https://i.imgur.com/AdTJC8Y.png"
CLOCK=0x6
GAS_BUDGET=500000000
REWARD_TYPE="LCC"

BILL_OF_MATERIALS_KEYS='[
  "Manufacturer Name",
  "Model",
  "Manufacturing Date",
  "Capacity",
  "Expected Lifespan",
  "Battery Pack",
  "Cells",
  "Housing",
  "Version"
]'

BILL_OF_MATERIALS_VALUES='[
  "EcoBike", 
  "EcoBike Pro 48V Battery",
  "March 15, 2022",
  "14Ah (672Wh)",
  "5 years with annual maintenance",
  "Rechargeable lithium-ion battery",
  "52x Samsung INR18650-35E",
  "Aluminum housing",
  "BMS v2.1"
]'


iota client call \
  --package "$IOTA_CUSTOM_NOTARIZATION_PKG_ID" \
  --module "app" \
  --function "new_product" \
  --args \
    $FEDERATION_ID \
    "$PRODUCT_NAME" \
    "$MANUFACTURER_DID" \
    "$SERIAL_NUMBER" \
    "$IMAGE_URL" \
    "$BILL_OF_MATERIALS_KEYS" \
    "$BILL_OF_MATERIALS_VALUES" \
    "$REWARD_TYPE" \
    $CLOCK \
  --gas-budget "$GAS_BUDGET"
