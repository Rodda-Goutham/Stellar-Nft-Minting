# Soroban NFT Contract

This repository contains the Soroban-based NFT smart contract that facilitates the minting and management of NFTs on the Soroban testnet.

## Features

- **Mint NFTs**: Generates unique token IDs and stores NFT metadata (name, description, owner).
- **Storage**: Persists metadata on the Soroban ledger for future retrieval.
- **Scalable**: Designed for easy extension and customization.

## Prerequisites

Before proceeding, ensure the following software is installed:

- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- Soroban CLI (`cargo install soroban-cli`)
- Stellar testnet account with XLM tokens
- [Node.js](https://nodejs.org/) (for auxiliary operations)

### **Frontend**

# Soroban NFT Frontend

This repository contains the React-based frontend for interacting with the Soroban NFT smart contract. It allows users to connect wallets, mint NFTs, and view NFT metadata.

## Features

- **Wallet Integration**: Supports Freighter wallet for secure connections to the Soroban testnet.
- **Mint NFTs**: Users can input NFT details (name, description) and mint directly.
- **IPFS Integration**: Leverages Pinata API to upload and store NFT images on IPFS.

## Prerequisites

- Node.js (v18 or higher)
- Freighter wallet configured for Soroban testnet
- Pinata API keys for IPFS integration

