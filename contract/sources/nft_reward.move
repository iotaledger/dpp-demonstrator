/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

module custom_notarization::nft_reward {
    use std::string::{Self, String};
    use iota::vec_map::{Self, VecMap};
    use iota::event;
    use iota::display;
    use iota::package;

    /// NFT reward object
    public struct RewardNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
    }

    /// One-Time-Witness for initializing the Display
    public struct NFT_REWARD has drop {}

    public struct REWARD_ADMIN_CAP has key, store{
        id: UID
    }

    public struct WHITELIST has key, store {
        id: UID,
        hasMinted: VecMap<address, bool>
    }

    /// Event emitted when an NFT is minted
    public struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: String,
    }

    public struct AddressAuthorized has copy, drop {
        account: address,
    }

    // ===== INIT =====

    /// Initialize the Display<RewardNFT>
    fun init(otw: NFT_REWARD, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"description".to_string(),
            b"image_url".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{description}".to_string(),
            b"{image_url}".to_string(),
        ];

        let publisher = package::claim(otw, ctx);

        let mut nft_display = display::new_with_fields<RewardNFT>(
            &publisher, keys, values, ctx
        );

        nft_display.update_version();


        package::burn_publisher(publisher);

        transfer::transfer(REWARD_ADMIN_CAP{
            id: object::new(ctx)
        }, tx_context::sender(ctx));
        transfer::share_object(WHITELIST { 
           id: object::new(ctx), 
           hasMinted: vec_map::empty<address, bool>() }
        );
        transfer::public_freeze_object<display::Display<RewardNFT>>(nft_display);

    }

    // ===== Public view functions =====

    public fun name(nft: &RewardNFT): &String {
        &nft.name
    }

    public fun description(nft: &RewardNFT): &String {
        &nft.description
    }

    public fun image_url(nft: &RewardNFT): &String {
        &nft.image_url
    }

    // ===== MINT FUNCTION =====

    /// Mint a new RewardNFT to a recipient
    public(package) fun send_nft_reward(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        recipient: address,
        whitelist: &mut WHITELIST,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);

        if (!vec_map::contains<address, bool>(&whitelist.hasMinted, &caller)) {
            return
        };

        let minted_ref = vec_map::get_mut<address, bool>(&mut whitelist.hasMinted, &caller);
        if (*minted_ref) {
            return
        };

        let nft = RewardNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: caller,
            name: nft.name,
        });

        transfer::public_transfer(nft, recipient);
        *minted_ref = true;
    }



    public entry fun authorize_address(_: &REWARD_ADMIN_CAP, whitelist: &mut WHITELIST, recipient: address){
        vec_map::insert<address, bool>(&mut whitelist.hasMinted, recipient, false);
        event::emit(AddressAuthorized{
            account: recipient
        })
    }

    // ===== Utility =====

    public fun transfer(nft: RewardNFT, recipient: address, _: &mut TxContext) {
        transfer::public_transfer(nft, recipient)
    }

    public fun update_description(nft: &mut RewardNFT, new_description: vector<u8>, _: &mut TxContext) {
        nft.description = string::utf8(new_description)
    }

    public fun burn(nft: RewardNFT, _: &mut TxContext) {
        let RewardNFT { id, name: _, description: _, image_url: _ } = nft;
        object::delete(id)
    }
}
