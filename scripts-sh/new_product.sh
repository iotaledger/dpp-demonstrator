 #!/bin/bash

FEDERATION_OBJ_ID=0x8173b3aa4c6ba17a891af0589b8977c9a0dbbcb0d3b9f9d23cfcdeebc8dca9f4 
AUDIT_TRAIL_PACKAGE_ADDRESS=0xbeb6acdb70770a9cd547792436ed130f86cbc703f20fe71dd2d231d465665fd7
SERIAL_NUMBER=EY74A2-LJ2G-001
PRODUCT_NAME="Panasonic EY74A2"
GTIN="5025232813723"
MANUFACTURER="Panasonic"
IMAGE_URL="https://i.imgur.com/jHb2LkY.png"
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
  --package "$AUDIT_TRAIL_PACKAGE_ADDRESS" \
  --module "app" \
  --function "new_product" \
  --args \
    $FEDERATION_OBJ_ID \
    "$PRODUCT_NAME" \
    "$SERIAL_NUMBER" \
    "$IMAGE_URL" \
    "$COMPONENT_LABELS" \
    "$COMPONENT_DESCRIPTIONS" \
    $CLOCK \
  --gas-budget "$GAS_BUDGET"
