module audit_trails::rewards;

use iota::display;
use iota::event;
use iota::package;
use std::string::{Self, String};

/// NFT reward object
public struct RewardNFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
}

/// One-Time-Witness for initializing the Display
public struct REWARDS has drop {}

/// Event emitted when an NFT is minted
public struct NFTMinted has copy, drop {
    object_id: ID,
    creator: address,
    name: String,
}

// ===== INIT =====

/// Initialize the Display<RewardNFT>
fun init(otw: REWARDS, ctx: &mut TxContext) {
    let keys = vector[b"name".to_string(), b"description".to_string(), b"image_url".to_string()];

    let values = vector[
        b"{name}".to_string(),
        b"{description}".to_string(),
        b"{image_url}".to_string(),
    ];

    let publisher = package::claim(otw, ctx);

    let mut nft_display = display::new_with_fields<RewardNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );

    nft_display.update_version();

    package::burn_publisher(publisher);
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
public(package) fun send_reward(
    name: vector<u8>,
    description: vector<u8>,
    image_url: vector<u8>,
    recipient: address,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);

    let nft = RewardNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        image_url: string::utf8(image_url),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, recipient);
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
