import React, { useState } from 'react';
import { ConnectWallet } from './components/ConnectWallet.jsx';
import { MintNft } from './components/MintNft.jsx';
import './styles/App.css';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div className='app-container'>
      <h1 className='app-header'>NFT Minter</h1>
      <ConnectWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress}/>
      <MintNft walletAddress={walletAddress}/>
    </div>
  );
};

export default App;
