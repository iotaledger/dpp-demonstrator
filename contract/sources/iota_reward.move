module audit_trails::vault {

    use iota::coin::{ Coin, split, value};
    use iota::iota::{IOTA};
    use iota::balance::{Self, Balance};
    use iota::vec_map::{Self, VecMap};

    const E_INSUFFICIENT_BALANCE: u64 = 0;

    public struct Vault has key {
        id: UID,
        balances: VecMap<address, Coin<IOTA>>,
    }

    fun init(ctx: &mut TxContext){
        
        transfer::share_object(Vault {
            id: object::new(ctx),
            balances: vec_map::empty<address, Coin<IOTA>>()
            }
        )
    }

    public entry fun top_up(
        v: &mut Vault,
        dpp: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(balance::value<IOTA>(tx_context::sender(ctx)) >= amount, E_INSUFFICIENT_BALANCE);
        let coin = Balance::withdraw(amount, ctx);
        if (!vec_map::contains_key<address, Coin<IOTA>>(&v.balances, dpp)) {
            vec_map::insert<address, Coin<IOTA>>(&mut v.balances, dpp, coin);
            return;
        };
        let existing = vec_map::remove<address, Coin<IOTA>>(&mut v.balances, dpp);
        merge(&mut existing, coin);
        vec_map::insert<address, Coin<IOTA>>(&mut v.balances, dpp, existing)
    }


}