module audit_trails::rwr {
    use iota::balance::Balance;
    use iota::coin::{Self, Coin, TreasuryCap};
    use iota::transfer;
    use iota::tx_context::TxContext;
    use iota::url;

    const ENotSystemAddress: u64 = 1;

    public struct RWR has drop {}

    public struct RWRTreasuryCap has store {
        inner: TreasuryCap<RWR>,
    }

    fun init(otw: RWR, ctx: &mut TxContext) {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);

        let (treasury, metadata) = coin::create_currency(
            otw,
            9,
            b"RWR",
            b"IOTA RWR",
            b"IOTA Real World Reward Token",
            option::some(url::new_unsafe_from_bytes(b"https://iota.org/logo.png")),
            ctx
        );

        transfer::public_freeze_object(metadata);
        let rwr_treasuryCap =  RWRTreasuryCap { inner: treasury }
        transfer::public_transfer(rwr_treasuryCap, ctx.sender());

        
    }

    public entry fun transfer(c: Coin<RWR>, recipient: address) {
        transfer::public_transfer(c, recipient)
    }

    public fun mint(cap: &mut IotaTreasuryCap, value: u64, ctx: &mut TxContext): Coin<RWR> {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.mint(value, ctx)
    }

    public fun mint_balance(cap: &mut IotaTreasuryCap, value: u64, ctx: &TxContext): Balance<RWR> {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.mint_balance(value)
    }

    public fun burn(cap: &mut IotaTreasuryCap, c: Coin<RWR>, ctx: &TxContext): u64 {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.burn(c)
    }

    public fun burn_balance(cap: &mut IotaTreasuryCap, b: Balance<RWR>, ctx: &TxContext): u64 {
        assert!(ctx.sender() == @0x0, ENotSystemAddress);
        cap.inner.supply_mut().decrease_supply(b)
    }

    public fun total_supply(cap: &IotaTreasuryCap): u64 {
        cap.inner.total_supply()
    }
}