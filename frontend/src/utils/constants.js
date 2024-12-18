import 'dotenv/config';

const CONTRACT_ID = process.env.CONTRACT_ID;
const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = process.env.NETWORK_PASSPHRASE;
const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API;
const PINATA_API = process.env.PINATA_API;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY
const STELLAR_SECRET_KEY = process.env.STELLAR_SECRET_KEY

export { CONTRACT_ID, SOROBAN_RPC_URL, NETWORK_PASSPHRASE, PINATA_API, PINATA_API_KEY, PINATA_JWT, PINATA_SECRET_API_KEY, STELLAR_SECRET_KEY }