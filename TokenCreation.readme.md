# Solana SPL Token Creation Guide

This guide provides step-by-step instructions for creating your own SPL token on the Solana blockchain using the included scripts. The code handles the entire process from token creation and metadata setup to IPFS image hosting via Pinata.

## How the Token Creation Works

The script performs the following steps:

1. Connects to Solana (devnet or mainnet)
2. Creates a new SPL token mint
3. Mints tokens to your wallet
4. Uploads token image to IPFS via Pinata
5. Creates and uploads token metadata
6. Establishes on-chain metadata using Metaplex
7. Revokes mint and freeze authorities (making the token supply fixed)
8. Saves all token details for future reference

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Solana CLI tools
- A Solana wallet with SOL for transaction fees
- Pinata account for IPFS hosting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

run the command

```
# Solana Configuration
run the command to create .env

cp .env.example .env


SOLANA_RPC_URL=https://api.devnet.solana.com  # For devnet testing
# Use https://api.mainnet-beta.solana.com for mainnet deployment

# Wallet Configuration - Your private key in base58 format
WALLET_PRIVATE_KEY=your_private_key_here

# Pinata Configuration (for IPFS)
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
```

### 3. Obtaining Pinata API Credentials

1. Create an account at [Pinata](https://app.pinata.cloud)
2. After logging in, navigate to the Developer section
3. Click on "API Keys" in the sidebar
4. Click "New Key" button
5. Name your key (e.g., "Token Creation")
6. Enable permissions for "pinFileToIPFS" and "pinJSONToIPFS"
7. Click "Create Key"
8. Copy the generated API Key and API Secret to your `.env` file

### 4. Solana Wallet Setup

#### Option 1: Generate a new Solana keypair

```bash
# Generate a new keypair
solana-keygen new --outfile ~/.config/solana/id.json

# View the public key (address)
solana address

# Export private key in base58 format for .env file

# for private key you have to run this command

yarn read-keypair
npm run read-keypair

# this will pick the private key from the ~/.config/solana/id.json


# ignore the command below
# solana-keygen dump-keypair ~/.config/solana/id.json | grep "Private key:" | cut -d' ' -f3
```

#### Option 2: Use an existing wallet

If you already have a wallet (e.g., from Phantom, Solflare), you can export the private key and use it in the `.env` file.

### 5. Solana Network Configuration

#### Devnet Configuration (for testing)

```bash
# Set to devnet
solana config set --url https://api.devnet.solana.com

# Verify configuration
solana config get

# Get devnet SOL via airdrop
solana airdrop 2 --url https://api.devnet.solana.com
```

#### Mainnet Configuration (for production)

```bash
# Set to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Verify configuration
solana config get
```

Make sure to update the `SOLANA_RPC_URL` in your `.env` file to match your chosen network.

### 6. Checking Wallet Balance

```bash
# Check your wallet balance
solana balance

# Or for a specific network
solana balance --url https://api.devnet.solana.com
```

You need at least 0.01 SOL for the token creation process.

### 7. Token Image Setup

Place your token image at:

```
cli/instructions/tokenImage.png
```

Requirements:

- PNG format recommended
- 512x512 pixels ideal size
- Maximum file size < 10MB (Pinata free tier limit)

### 8. Token Information Customization

The script creates a token with these default properties:

- Name: "$DEVDEAD"
- Symbol: "DDT"
- Description: "$DEVDEAD is the first memecoin that fully embraces the anxiety, chaos, and excitement of crypto trading."
- Decimals: 9
- Total Supply: 1,000,000,000 tokens

To customize these properties, modify the `metadata` object in the `createTokenForLiquidity` function in `cli/instructions/create-spl-token.ts`:

```typescript
const metadata: TokenMetadata = {
  name: "YOUR_TOKEN_NAME",
  symbol: "YOUR_SYMBOL",
  description: "Your token description",
  // ... other properties
};
```

You can also customize:

- Supply amount by changing `tokenSupply`
- Decimal places by changing `tokenDecimals`
- Token attributes and properties

## Creating the Token

### 1. Create Directory for Token Details

```bash
mkdir -p cli/instructions/createdTokens
```

### 2. Run the Token Creation Script

```bash
npx ts-node cli/instructions/create-spl-token.ts
```

The script will:

1. Connect to Solana
2. Create your token
3. Upload images and metadata to IPFS
4. Register on-chain metadata
5. Output all token details
6. Save token details to a JSON file in `cli/instructions/createdTokens/`

## Understanding the Code

### connection.ts

This file handles the Solana connection and wallet setup:

```typescript
// Gets the Solana connection using the RPC URL from .env
export const getConnection = () => {
  const endpoint =
    process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  return new Connection(endpoint, "confirmed");
};

// Gets the wallet keypair from the private key in .env
export const getPayer = (): Keypair => {
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  // Supports both base58 and comma-separated private key formats
  // ...
};
```

### create-spl-token.ts

This file implements the token creation process:

1. **Setup**: Establishes connection to Solana and loads wallet
2. **Token Creation**: Creates a new token mint with specified decimals
3. **Token Account**: Creates an associated token account for your wallet
4. **Minting**: Mints the entire token supply to your wallet
5. **IPFS**: Uploads image and metadata to IPFS via Pinata
6. **Metadata**: Creates on-chain metadata using Metaplex
7. **Authority**: Revokes mint and freeze authorities to fix supply
8. **Storage**: Saves all token details to a JSON file

## After Token Creation

Your token details will be saved to a file like:

```
cli/instructions/createdTokens/token-details-$DEVDEAD-DDT-1646106000000.json
```

This file contains:

- Token addresses
- Metadata URI
- Mint keypair (keep this secure!)
- Transaction signatures
- Other token details

## Troubleshooting

### "Insufficient SOL balance"

- Make sure you have at least 0.01 SOL for fees
- Use `solana airdrop` on devnet or fund your wallet on mainnet

### "Image file not found"

- Ensure you have the image at the correct path: `cli/instructions/tokenImage.png`

### "Invalid private key format"

- Your private key should be in base58 format in the .env file
- You can try the alternate comma-separated format if base58 fails

### Pinata errors

- Verify API key and secret are correct
- Check your Pinata account limits
- Ensure image file size is within limits

### Transaction errors

- Check your network connection
- Ensure your RPC endpoint is correct
- Increase the `maxRetries` parameter in the confirmOptions if transactions time out

## Security Considerations

- **NEVER share your private key** or the generated token details JSON
- The token creation revokes mint and freeze authorities, making the supply permanent
- Store the token details JSON securely as it contains sensitive information
