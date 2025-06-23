module audit_trails::vault {

    use iota::coin::{Self, Coin};
    use audit_trails::rwr::{RWR};
    use iota::vec_map::{Self, VecMap};

    const REWARD_VALUE: u64 = 1_000_000_000;

    public struct Vault has key {
        id: UID,
        balances: VecMap<address, Coin<RWR>>,
    }

    fun init(ctx: &mut TxContext){
        
        transfer::share_object(Vault {
            id: object::new(ctx),
            balances: vec_map::empty<address, Coin<RWR>>()
            }
        )
    }

    public entry fun top_up_dpp(
        vault: &mut Vault,
        coin: &mut Coin<RWR>,
        amount: u64,
        dpp_addr: address,
        ctx: &mut TxContext
    ) {
        let dpp_locked_value = coin::split<RWR>(coin, amount, ctx);
        vault.balances.insert<address, Coin<RWR>>(dpp_addr, dpp_locked_value);
    }


    public(package) fun send_reward(
        vault: &mut Vault,
        dpp_addr: address,
        recipient: address,
        ctx: &mut TxContext
    ){
        let dpp_locked_value = vault.balances.get_mut<address, Coin<RWR>>(&dpp_addr);
        
        let reward = coin::split<RWR>(dpp_locked_value, REWARD_VALUE, ctx);
        transfer::public_transfer(reward, recipient);
    }

}