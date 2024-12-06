import React from "react";
import { isConnected, requestAccess } from '@stellar/freighter-api';
import '../styles/ConnectWallet.css';
const ConnectWallet = ({ walletAddress, setWalletAddress }) => {

    const retrievePublicKey = async () => {
        const accessObj = await requestAccess();

        if (accessObj.error) {
            return accessObj.error;
        } else {
            return accessObj.address;
        }
    };
    const connectWallet = async () => {
        try {
            const connected = await isConnected();
            if (connected) {
                const publicKey = await retrievePublicKey();
                setWalletAddress(publicKey);
            } else {
                alert('Please connect to freighter wallet');
            }
        } catch (error) {
            console.error('Wallet connection failed', error);
            alert('Failed to connect wallet');
        }
    }

    const disconnectWallet = async () => {
        setWalletAddress(null);
    }

    return (
        <div className="connect-wallet-container">
            {walletAddress && (<p className="connected-text">Connected to: {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}</p>
            )}
            {walletAddress ? (
                <button onClick={disconnectWallet} className="connect-wallet-button">Disconnect</button>
            ) : (
                <button onClick={connectWallet} className="connect-wallet-button">Connect Wallet</button>
            )}
        </div>
    );
}
export { ConnectWallet }