module audit_trails::LCC {
    use iota::balance::Balance;
    use iota::coin::{Self, Coin, TreasuryCap};
    use iota::url;

    const ENotSystemAddress: u64 = 1;

    public struct LCC has drop {}

    public struct LCCTreasuryCap has store {
        inner: TreasuryCap<LCC>,
    }

    fun init(otw: LCC, ctx: &mut TxContext) {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);

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

    public fun mint(cap: &mut LCCTreasuryCap, value: u64, ctx: &mut TxContext): Coin<LCC> {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.mint(value, ctx)
    }

    public fun mint_balance(cap: &mut LCCTreasuryCap, value: u64, ctx: &TxContext): Balance<LCC> {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.mint_balance(value)
    }

    public fun burn(cap: &mut LCCTreasuryCap, c: Coin<LCC>, ctx: &TxContext): u64 {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.burn(c)
    }

    public fun burn_balance(cap: &mut LCCTreasuryCap, b: Balance<LCC>, ctx: &TxContext): u64 {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.supply_mut().decrease_supply(b)
    }

    public fun total_supply(cap: &LCCTreasuryCap): u64 {
        cap.inner.total_supply()
    }
}