import { useState } from "react";
import {
    rpc,
    TransactionBuilder,
    BASE_FEE,
    Keypair,
    xdr,
    Contract,
    Address,
} from '@stellar/stellar-sdk';
import {
    CONTRACT_ID,
    NETWORK_PASSPHRASE,
    STELLAR_SECRET_KEY,
    SOROBAN_RPC_URL
} from '../utils/constants.js'
import { uploadToPinata } from '../utils/ipfs.js';
import '../styles/MintNft.css';

const MintNft = ({ walletAddress }) => {
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftImage, setNftImage] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [minted, setMinted] = useState(null);
    const [isMinted, setIsMinted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadFailed, setUploadFailed] = useState(false);

    const handleCloseMintedDisplay = () => {
        setIsMinted(false);
        setNftName("");
        setNftDescription("");
        setNftImage(null); // Reset the uploaded file
    };

    const mintNFT = async () => {
        if (!walletAddress) {
            alert('Please Connect Your Wallet');
            return;
        }
        if (!nftName || !nftDescription || !nftImage) {
            alert('Please fill all fields and connect wallet');
            return;
        }
        try {
            // Upload image to IPFS
            setUploading(true);
            const imageUrl = await uploadToPinata(nftImage);
            if (!imageUrl) {
                setUploadFailed(true);
                throw new Error('IPFS upload failed');
            }
            setUploading(false);
            setIsMinting(true);

            // Create Stellar server instance
            const server = new rpc.Server(
                SOROBAN_RPC_URL,
                { allowHttp: true },
            );

            // Fetch sender's account
            const sourceAccount = await server.getAccount(walletAddress);
            const contract = new Contract(CONTRACT_ID);

            // Prepare ScVal arguments
            const args = [
                xdr.ScVal.scvAddress(Address.fromString(walletAddress).toScAddress()),
                xdr.ScVal.scvString(nftName),
                xdr.ScVal.scvString(nftDescription)
            ];

            // Prepare transaction contract.call('mint', ...args)
            const transaction = new TransactionBuilder(sourceAccount, {
                fee: BASE_FEE,
                networkPassphrase: NETWORK_PASSPHRASE
            })
                .addOperation(contract.call('mint', ...args))
                .setTimeout(30)
                .build();

            let preparedTransaction = await server.prepareTransaction(transaction);
            const keypair = Keypair.fromSecret(STELLAR_SECRET_KEY);
            // Sign transaction

            preparedTransaction.sign(keypair);

            // Submit transaction
            let sendResponse = await server.sendTransaction(preparedTransaction);

            if (sendResponse.status === "PENDING") {
                let getResponse = await server.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    getResponse = await server.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                } else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            } else {
                setIsMinting(false);
                throw sendResponse.errorResult;
            }

            setMinted({ image: imageUrl, hash: sendResponse.hash });
            setIsMinting(false);
            setIsMinted(true);
        } catch (error) {
            console.error('Minting failed', error);
            console.error('Error Response:', error.response?.data);
        }
    };

    return (<div>
        {uploading && (
            <div className="minting-animation">
                <p>Uploading File...</p>
            </div>
        )}
        {uploadFailed && (
            <div className="nft-details">
                <p>Failed to Upload to IPFS</p>
                <button onClick={setUploadFailed(false)}>
                    close
                </button>
            </div>
        )}
        {!uploading && isMinting && (
            <div className="nft-details">
                <p>Uploaded File!</p>
            </div>
        )}
        {isMinting && !isMinted && (
            <div className="minting-animation">
                <p>Minting Your NFT...</p>
            </div>
        )}
        {!uploading && !isMinting && !isMinted && (
            <div className="mint-nft-container" >
                <input
                    type="text"
                    placeholder="NFT Name"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    className="mint-nft-input"
                />

                <textarea
                    placeholder="NFT Description"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    className="mint-nft-input"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) setNftImage(e.target.files[0])
                    }}
                />
                <button
                    onClick={mintNFT}
                    className="mint-nft-button"
                    disabled={!nftName || !nftDescription || !nftImage}
                >
                    Mint NFT
                </button>
            </div>
        )}
        {isMinted && (
            <div className="nft-display">
                <img src={minted.image} className="nft-image" />
                <div className="nft-details">
                    <p><strong>Name : </strong>{nftName}</p>
                    <p><strong>Description : </strong>{nftDescription}</p>
                    <p><strong>Transaction Hash : </strong>
                        <a className="transaction-hash" href={`https://stellar.expert/explorer/testnet/tx/${minted.hash}`} target="_blank" rel="noopener noreferrer">
                            {minted.hash}
                        </a>
                    </p>
                </div>
                <div>
                    <button onClick={handleCloseMintedDisplay}>
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>)
}

export { MintNft };
