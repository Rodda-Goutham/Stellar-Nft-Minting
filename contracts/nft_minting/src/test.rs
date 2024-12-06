#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Bytes, Env, String};

#[test]

fn test_mint() {
    let env = Env::default();
    let contract_id = env.register_contract(None, NFTContract);

    let owner = Address::generate(&env);
    let name = String::from_str(&env, "My First NFT");
    let description = String::from_str(&env, "This is a description of my first NFT.");

    // Mint the first NFT
    let nft_metadata = NFTContractClient::new(&env, &contract_id).mint(&owner, &name, &description);

    // Verify the token ID is not empty
    let token_id = nft_metadata.token_id;
    assert!(!token_id.is_empty(), "Token ID should not be empty");
}

#[test]

fn test_generate_token_id() {
    let env = Env::default();
    let contract_id = env.register_contract(None, NFTContract);
    let client = NFTContractClient::new(&env, &contract_id);

    let mut last_token_id: Option<Bytes> = None;

    for _ in 1..=5 {
        let owner = Address::generate(&env);
        let name = String::from_str(&env, "NFT");
        let description = String::from_str(&env, "description");

        //Mint the NFT
        let nft_metadata = client.mint(&owner, &name, &description);
        let token_id = nft_metadata.token_id;

        // Verify if token_id increments
        if let Some(last_id) = last_token_id {
            assert_ne!(last_id, token_id, "Token ID should increment");
        }
        last_token_id = Some(token_id);
    }
}
