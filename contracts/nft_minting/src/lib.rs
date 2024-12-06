#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, String, Symbol,
};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct NFTContract;

#[derive(Clone)]
#[contracttype]
pub struct NftMetadata {
    pub token_id: Bytes,
    pub owner: Address,
    pub name: String,
    pub description: String,
}

#[contractimpl]
impl NFTContract {
    //Mint an Nft
    pub fn mint(env: Env, owner: Address, name: String, description: String) -> NftMetadata {
        let token_id = Self::generate_token_id(&env);

        let nft_metadata = NftMetadata {
            token_id: token_id.clone(),
            owner: owner.clone(),
            name: name.clone(),
            description: description.clone(),
        };

        //store the values in contract storage
        env.storage().instance().set(&token_id, &nft_metadata);

        //publish event
        env.events().publish(
            (symbol_short!("NFTMinted"),owner.clone()),
            (token_id.clone(), name, description),
        );

        //return NFT metadata
        nft_metadata
    }

    //Helper function to generate a unique token ID
    fn generate_token_id(env: &Env) -> Bytes {
        let mut counter: u64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        counter += 1;

        env.storage().instance().set(&COUNTER, &counter);

        Bytes::from_array(env, &counter.to_be_bytes())
    }
}

mod test;