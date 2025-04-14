import * as fs from "fs";
import * as path from "path";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export function readKeypairFromFile(filePath: string): string {
  try {
    const keypairFile = fs.readFileSync(filePath, "utf-8");
    const keypairData = JSON.parse(keypairFile);

    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

    const privateKey = bs58.encode(keypair.secretKey);

    return privateKey;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read keypair file: ${error.message}`);
    }
    throw new Error("Failed to read keypair file: Unknown error");
  }
}

if (require.main === module) {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (!homeDir) {
      throw new Error("Could not determine home directory");
    }

    const keypairPath = path.join(homeDir, ".config", "solana", "id.json");

    if (!fs.existsSync(keypairPath)) {
      throw new Error(
        `Keypair file not found at: ${keypairPath}\nPlease make sure you have a Solana keypair file at this location.`
      );
    }

    const privateKey = readKeypairFromFile(keypairPath);
    console.log("Private Key:", privateKey);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error: Unknown error occurred");
    }
    process.exit(1);
  }
}
