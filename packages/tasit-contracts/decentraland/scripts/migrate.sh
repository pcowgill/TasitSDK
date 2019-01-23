#!/bin/bash
DECENTRALAND_DIR="$PROJECT_DIR/decentraland"

# mana
cp $DECENTRALAND_DIR/scripts/3_mana_token.js $DECENTRALAND_DIR/mana/migrations
cd $DECENTRALAND_DIR/mana
npx truffle migrate

# land
cp $DECENTRALAND_DIR/scripts/3_land_registry.js $DECENTRALAND_DIR/land/migrations
cd $DECENTRALAND_DIR/land
npx truffle migrate --network livenet
