/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

module audit_trails::LCC {
    use iota::balance::Balance;
    use iota::coin::{Self, Coin, TreasuryCap};
    use iota::url;

    public struct LCC has drop {}

    fun init(otw: LCC, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            otw,
            9,
            b"LCC",
            b"IOTA LCC",
            b"IOTA Lifecycle Credit",
            option::some(url::new_unsafe_from_bytes(b"https://i.imgur.com/Pap0R3y.png")),
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, ctx.sender());
    }

    public entry fun transfer(c: Coin<LCC>, recipient: address) {
        transfer::public_transfer(c, recipient)
    }

    public fun mint(cap: &mut TreasuryCap<LCC>, value: u64, ctx: &mut TxContext) {
        let minted_coin = cap.mint(value, ctx);
        transfer(minted_coin, ctx.sender())
    }

    public fun mint_balance(cap: &mut TreasuryCap<LCC>, value: u64): Balance<LCC> {
        cap.mint_balance(value)
    }

    public fun burn(cap: &mut TreasuryCap<LCC>, c: Coin<LCC>): u64 {
        cap.burn(c)
    }

    public fun burn_balance(cap: &mut TreasuryCap<LCC>, b: Balance<LCC>): u64 {
        cap.supply_mut().decrease_supply(b)
    }

    public fun total_supply(cap: &TreasuryCap<LCC>): u64 {
        cap.total_supply()
    }
}