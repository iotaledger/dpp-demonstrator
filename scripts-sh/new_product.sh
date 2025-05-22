 #!/bin/bash

if [ -z "$FEDERATION_ID" ]; then
  echo "❌ Error: FEDERATION_ID is not set"
  exit 1
fi

if [ -z "$AUDIT_TRAIL_PKG" ]; then
  echo "❌ Error: AUDIT_TRAIL_PKG is not set"
  exit 1
fi

echo "✅ Using FEDERATION_ID: $FEDERATION_ID"
echo "✅ Using AUDIT_TRAIL_PKG: $AUDIT_TRAIL_PKG"

SERIAL_NUMBER=EY74A2-LJ2G-001
PRODUCT_NAME="Berner BACSD-1"
GTIN="5025232813723"
MANUFACTURER="Berner Group"
IMAGE_URL="https://i.imgur.com/imdFJQ0.jpeg"
CLOCK=0x6
GAS_BUDGET=500000000

COMPONENT_LABELS='[
  "Product",
  "Manufacturer",
  "GTIN",
  "Motor",
  "Chuck",
  "Battery Pack",
  "Gearbox",
  "Housing",
  "LED Light",
  "Belt Hook",
  "Carrying Case"
]'

COMPONENT_DESCRIPTIONS='[
  "'"$PRODUCT_NAME"'",
  "'"$MANUFACTURER"'",
  "'"$GTIN"'",
  "Brushless DC motor, 32 Nm (soft), 50 Nm (hard), 30–1,580 rpm range",
  "13 mm keyless chuck, single-sleeve, metal with spindle lock",
  "18V Li-ion battery pack, 3.0 Ah (EY9L53B) / 5.0 Ah (EY9L54B)",
  "2-speed gearbox with electronic speed control",
  "Compact housing (178 mm), ABS/polycarbonate blend, ergonomic grip",
  "Front-facing LED work light, auto-off after 5 s",
  "Stainless steel belt hook, ambidextrous, detachable",
  "PP carrying case with accessory slots and locking latches"
]'

# Esecuzione della chiamata IOTA
iota client call \
  --package "$AUDIT_TRAIL_PKG" \
  --module "app" \
  --function "new_product" \
  --args \
    $FEDERATION_ID \
    "$PRODUCT_NAME" \
    "$SERIAL_NUMBER" \
    "$IMAGE_URL" \
    "$COMPONENT_LABELS" \
    "$COMPONENT_DESCRIPTIONS" \
    $CLOCK \
  --gas-budget "$GAS_BUDGET"
