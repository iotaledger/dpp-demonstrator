/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

module audit_trails::lcc_reward {

    use iota::coin::{Self, Coin};
    use audit_trails::LCC::{LCC};
    use iota::vec_map::{Self, VecMap};

    const REWARD_VALUE: u64 = 1_000_000_000;

    public struct Vault has key {
        id: UID,
        balances: VecMap<address, Coin<LCC>>,
    }

    fun init(ctx: &mut TxContext){
        
        transfer::share_object(Vault {
            id: object::new(ctx),
            balances: vec_map::empty<address, Coin<LCC>>()
            }
        )
    }

    public entry fun top_up_dpp(
        vault: &mut Vault,
        coin: &mut Coin<LCC>,
        amount: u64,
        dpp_addr: address,
        ctx: &mut TxContext
    ) {
        let dpp_locked_value = coin::split<LCC>(coin, amount, ctx);
        vault.balances.insert<address, Coin<LCC>>(dpp_addr, dpp_locked_value);
    }


    public(package) fun send_lcc_reward(
        vault: &mut Vault,
        dpp_addr: address,
        recipient: address,
        ctx: &mut TxContext
    ){
        let dpp_locked_value = vault.balances.get_mut<address, Coin<LCC>>(&dpp_addr);
        
        let reward = coin::split<LCC>(dpp_locked_value, REWARD_VALUE, ctx);
        transfer::public_transfer(reward, recipient);
    }

    public entry fun read_dpp_value(vault: &mut Vault, dpp_addr: address): u64{
        let dpp_locked_value = vault.balances.get_mut<address, Coin<LCC>>(&dpp_addr);
        coin::value<LCC>(dpp_locked_value)
    }

}