 #!/bin/bash

FEDERATION_OBJ_ID=0xbb42be8c968aa1eabc9d240df04c49e15abc5485e3de9eaf8eb7ee1ceffae46a 
AUDIT_TRAIL_PACKAGE_ADDRESS=0x4ea3a4ee137ace4c9174d0b354f233540406eb9cca3cbc54d76f213fb83b94ce
SERIAL_NUMBER=EY74A2-LJ2G-001
PRODUCT_NAME="Cordless Drill & Driver EY74A2"
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
    "$SERIAL_NUMBER" \
    "$IMAGE_URL" \
    "$COMPONENT_LABELS" \
    "$COMPONENT_DESCRIPTIONS" \
    $CLOCK \
  --gas-budget "$GAS_BUDGET"
