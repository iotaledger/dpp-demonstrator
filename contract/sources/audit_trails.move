module audit_trails::app {

    use std::string::{Self, String};
    use hierarchies::main::{Federation, validate_property};
    use hierarchies::utils::{vec_map_from_keys_values};
    use hierarchies::{property_name::{new_property_name}, property_value::{new_property_value_string}};
    use iota::vec_map::{VecMap};
    use iota::clock::{Self, Clock};
    use iota::event;

    use audit_trails::nft_reward::{send_nft_reward, WHITELIST};
    use audit_trails::lcc_reward::{send_lcc_reward, Vault};

    const E_INVALID_ROLE: u64 = 0;
    const E_MISMATCHED_VECTOR_LENGTHS: u64 = 1;
    const E_MISMATCHED_FEDERATION: u64 = 2;
    const E_INVALID_ISSUER: u64 = 3;

    public enum Role has store, copy, drop {
        Manufacturer,
        Repairer
    }

    public enum RewardType has store, copy, drop {
        NFT,
        LCC
    }

    public struct Product has key, store {
        id: UID,
        federation_addr: address,
        name: String,
        serial_number: String,
        manufacturer: String,
        image_url: String,
        bill_of_materials: VecMap<String, String>,
        timestamp: u64,
        reward_type: RewardType
    }

    public struct ProductEntry has key, store {
        id: UID,
        issuer_role: Role,
        issuer_addr: address,
        entry_data: VecMap<String, String>,
        timestamp: u64
    }

    public struct ProductEntryLogged has drop, store, copy {
        issuer_role: Role,
        product_addr: address,
        entry_addr: Option<address>
    }

    public entry fun new_product(
        federation: &Federation,
        name: String,
        manufacturer_did: String,
        serial_number: String,
        image_url: String,
        bill_of_materials_keys: vector<String>,
        bill_of_materials_values: vector<String>,
        reward_type: String,
        clock: &Clock,
        ctx :&mut TxContext
    ) {
        check_vector_length<String>(&bill_of_materials_keys, &bill_of_materials_values);

        if (validate_property(
            federation,
            &object::id_from_address(ctx.sender()),
            new_property_name(string::utf8(b"role")),
            new_property_value_string(string::utf8(b"manufacturer")),
            clock
        ) == false) {
            abort E_INVALID_ISSUER
        };

        let p_id = object::new(ctx);
        let p_addr = object::uid_to_address(&p_id);

        let federation_id = object::id<Federation>(federation);
        let federation_addr = object::id_to_address(&federation_id);

        let mut reward_type_enum: RewardType = RewardType::LCC;
        if(reward_type == b"NFT".to_string()){
            reward_type_enum = RewardType::NFT
        };

        transfer::share_object(Product {
            id: p_id,
            federation_addr,
            name,
            serial_number,
            manufacturer: manufacturer_did,
            image_url,
            bill_of_materials: vec_map_from_keys_values<String, String>(bill_of_materials_keys, bill_of_materials_values),
            timestamp: clock::timestamp_ms(clock),
            reward_type: reward_type_enum
        });

        event::emit(
            ProductEntryLogged {
                issuer_role: Role::Manufacturer,
                product_addr: p_addr,
                entry_addr: option::none()
            }
        );
    }

    public entry fun log_entry_data(
        product: &Product,
        federation: &Federation,
        issuer_role: String,
        entry_data_keys: vector<String>,
        entry_data_values: vector<String>,
        clock: &Clock,
        whitelist: &mut WHITELIST,
        vault: &mut Vault,
        ctx: &mut TxContext
    ) {
        let role = to_role(issuer_role);

        check_vector_length<String>(&entry_data_keys, &entry_data_values);

        let federation_id = object::id<Federation>(federation);
        let federation_addr = object::id_to_address(&federation_id);
        assert_federation_eq(product.federation_addr, federation_addr);

        let product_id = object::id<Product>(product);
        let product_addr = object::id_to_address(&product_id);

        let issuer_id = object::id_from_address(ctx.sender());
        if (validate_property(
            federation,
            &issuer_id,
            new_property_name(string::utf8(b"role")),
            new_property_value_string(issuer_role),
            clock
        ) == false) {
            abort E_INVALID_ISSUER
        };

        let e_id = object::new(ctx);
        let e_addr = object::uid_to_address(&e_id);

        transfer::transfer(ProductEntry {
            id: e_id,
            issuer_role: role,
            issuer_addr: tx_context::sender(ctx),
            entry_data: vec_map_from_keys_values<String, String>(entry_data_keys, entry_data_values),
            timestamp: clock::timestamp_ms(clock)
        }, product_addr);

        event::emit(ProductEntryLogged{
            issuer_role: role,
            product_addr,
            entry_addr: option::some<address>(e_addr),
        });

        if(product.reward_type == RewardType::NFT){
            send_nft_reward(
                b"DPP Showcase Badge",
                b"Thanks for testing our demo! There's a reward waiting for you!",
                b"https://i.imgur.com/Jw7UvnH.png",
                tx_context::sender(ctx),
                whitelist,
                ctx
            );
        };
        if(product.reward_type == RewardType::LCC){
            send_lcc_reward(
                vault,
                product_addr,
                tx_context::sender(ctx),
                ctx
            );
        };
    }

    fun to_role(role_str: String): Role {
        if (role_str == string::utf8(b"manufacturer")) {
            Role::Manufacturer
        } else if (role_str == string::utf8(b"repairer")) {
            Role::Repairer
        } else {
            abort E_INVALID_ROLE
        }
    }

    fun check_vector_length<K: store + copy + drop>(v1: &vector<K>, v2: &vector<K>){
        assert!(vector::length<K>(v1) == vector::length<K>(v2), E_MISMATCHED_VECTOR_LENGTHS);
    }

    fun assert_federation_eq(fed_addr_1: address, fed_addr_2:address){
        assert!(fed_addr_1 == fed_addr_2, E_MISMATCHED_FEDERATION);
    }
}


