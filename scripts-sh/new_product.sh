#!/bin/bash

AUDIT_TRAIL_PACKAGE_ADDRESS=0xc2b3ad97c8b72c9a76b4963c47f6737b5d1d39aa24474852d909fa895793937f
FEDERATION_ADDR=0xcd874bde79e99bab7bc736949e65b618715a0fa7a447b8318b44cf3c893fdd98
SERIAL_NUMBER=abc-12345
IMAGE_URL=https://assets.xboxservices.com/assets/fa/b8/fab86afd-63d6-45a9-862f-798e5e45cda2.jpg?n=111101_Gallery-0_4_1350x759.jpg
CLOCK_ADDRESS=0x6
GAS_BUDGET=500000000


iota client call \
  --package "$AUDIT_TRAIL_PACKAGE_ADDRESS" \
  --module "app" \
  --function "new_product" \
  --args \
    $FEDERATION_ADDR \
    "$SERIAL_NUMBER" \
    "$IMAGE_URL" \
    '["Product", "Manufacturer", "Battery Pack", "Plastic Shell", "Screws and Fasteners", "Main PCB"]' \
    '["Xbox Wireless Controller", "Microsoft", "Rechargeable lithium-ion battery", "ABS injection-molded casing (top and bottom)", "Standard Torx screws and internal mounts", "Custom printed circuit board with integrated microcontroller"]' \
    $CLOCK_ADDRESS \
  --gas-budget "$GAS_BUDGET"

