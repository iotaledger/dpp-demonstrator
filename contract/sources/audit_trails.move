module audit_trails::app {

    use std::string::{Self, String}; 
    use ith::main::{Federation, validate_trusted_properties};
    use ith::utils::{vec_map_from_keys_values};
    use ith::trusted_property::{TrustedPropertyName, TrustedPropertyValue, new_property_value_string, new_property_name};
    use iota::vec_map::{VecMap};
    use iota::clock::{Self, Clock};
    use iota::event;

    use audit_trails::rewards::send_reward;

    const E_INVALID_ROLE: u64 = 0;
    const E_MISMATCHED_VECTOR_LENGTHS: u64 = 1; 
    const E_MISMATCHED_FEDERATION: u64 = 2;


    public enum Role has store, copy, drop {
        Manufacturer,
        Repairer
    }


    public struct Product has key, store {
        id: UID,
        federation_addr: address, 
        serial_number: String,
        manufacturer: address,
        image_url: String,
        bill_of_materials: VecMap<String, String>,
        timestamp: u64
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
        serial_number: String, 
        image_url: String,
        bill_of_materials_keys: vector<String>, 
        bill_of_materials_values: vector<String>, 
        clock: &Clock, 
        ctx :&mut TxContext
    ) {
        check_vector_length<String>(&bill_of_materials_keys, &bill_of_materials_values);
        
        let trusted_properties = build_trusted_properties(string::utf8(b"role"), string::utf8(b"manufacturer"));
        validate_trusted_properties(federation, &object::id_from_address(ctx.sender()), trusted_properties, ctx);

        let p_id = object::new(ctx);
        let p_addr = object::uid_to_address(&p_id);

        let federation_id = object::id<Federation>(federation);
        let federation_addr = object::id_to_address(&federation_id);

        transfer::share_object(Product {
            id: p_id,
            federation_addr,
            serial_number,
            manufacturer: tx_context::sender(ctx),
            image_url,
            bill_of_materials: vec_map_from_keys_values<String, String>(bill_of_materials_keys, bill_of_materials_values),
            timestamp: clock::timestamp_ms(clock)
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
        ctx: &mut TxContext
    ) {   
        let role = to_role(issuer_role);

        check_vector_length<String>(&entry_data_keys, &entry_data_values);

        let federation_id = object::id<Federation>(federation);
        let federation_addr = object::id_to_address(&federation_id);
        assert_federation_eq(product.federation_addr, federation_addr);

        let product_id = object::id<Product>(product);
        let product_addr = object::id_to_address(&product_id);

        let trusted_properties = build_trusted_properties(string::utf8(b"role"), issuer_role);
        let issuer_id = object::id_from_address(ctx.sender());
        validate_trusted_properties(federation, &issuer_id, trusted_properties, ctx);

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

        send_reward(
            b"Certified Demo Legend!",
            b"Thanks for testing our demo! There's a reward waiting for you!",
            b"https://daily-ink.davidtruss.com/wp-content/uploads/2019/08/img_6684.jpg",
            tx_context::sender(ctx),
            ctx
        );
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


    fun build_trusted_properties(property_name_str: String, property_value_str: String): VecMap<TrustedPropertyName, TrustedPropertyValue>{
        
        let mut property_name_vec = vector::empty<TrustedPropertyName>();
        let property_name = new_property_name(property_name_str);

        let mut property_value_vec = vector::empty<TrustedPropertyValue>();
        let property_value = new_property_value_string(property_value_str);


        vector::push_back<TrustedPropertyName>(&mut property_name_vec, property_name);
        vector::push_back<TrustedPropertyValue>(&mut property_value_vec, property_value);
        
        vec_map_from_keys_values<TrustedPropertyName, TrustedPropertyValue>(property_name_vec, property_value_vec)
    }

    fun check_vector_length<K: store + copy + drop>(v1: &vector<K>, v2: &vector<K>){
        assert!(vector::length<K>(v1) == vector::length<K>(v2), E_MISMATCHED_VECTOR_LENGTHS);
    }

    fun assert_federation_eq(fed_addr_1: address, fed_addr_2:address){
        assert!(fed_addr_1 == fed_addr_2, E_MISMATCHED_FEDERATION);
    }
}


