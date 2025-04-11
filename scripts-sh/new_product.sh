 #!/bin/bash

FEDERATION_OBJ_ID=0xbb42be8c968aa1eabc9d240df04c49e15abc5485e3de9eaf8eb7ee1ceffae46a 
AUDIT_TRAIL_PACKAGE_ADDRESS=0x3dee5ca62426b2396afdb015ddf1e91d21b7f751f0d1d0b4907691cf5c380f7f
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
