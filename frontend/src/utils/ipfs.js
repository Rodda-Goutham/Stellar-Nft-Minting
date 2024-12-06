import axios from "axios";
import{
  PINATA_API,
  PINATA_API_KEY,
  PINATA_JWT,
  PINATA_SECRET_API_KEY
} from './constants.js'
const uploadToPinata = async (file, name) => {
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);

  // Optional: Add metadata
  const pinataMetadata = JSON.stringify({
    name: name || 'NFT Image',
  });
  formData.append('pinataMetadata', pinataMetadata);

  // Pinata options (optional but recommended)
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    // Validate environment variable
    const pinataJWT = PINATA_JWT;
    if (!pinataJWT) {
      throw new Error('Pinata JWT token is not defined in environment variables');
    }

    // Detailed Axios request
    const response = await axios.post(
      PINATA_API,
      formData,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Verify response structure
    if (!response.data || !response.data.IpfsHash) {
      throw new Error('Invalid response from Pinata');
    }

    // Construct IPFS URL
    const ipfsUrl = `https://ipfs.io/ipfs/${response.data.IpfsHash}`;

    return ipfsUrl;

  } catch (error) {
    // Comprehensive error logging
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      console.error('Pinata Upload Axios Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      // Generic error handling
      console.error('Pinata Upload Error:', error);
    }

    // Throw error for caller to handle
    throw error;
  }
};

export {uploadToPinata};
