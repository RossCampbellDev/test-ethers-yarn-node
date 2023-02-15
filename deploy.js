const ethers = require("ethers");
const fs = require("fs-extra"); // should come with node
require("dotenv").config();

async function main() {
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // connect to our Ganache local test blockchain
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // get one of the wallets from our provider blockchain
  wallet = wallet.connect(provider);
  let contractLive = await makeAndDeploy(
    "RossToken_sol_Contract8mytoken",
    wallet
  );

  await contractLive.mint();
  console.log(await contractLive.ownerCount);

  // how about try a simpler sol contract first without inheritance
  // clear && yarn run go-ganache
  // clear && yarn run compile && node deploy.js
}

async function makeAndDeploy(_contract, _wallet) {
  const abi = fs.readFileSync(_contract + ".abi", "utf8");
  const bin = fs.readFileSync(_contract + ".bin", "utf8");

  const contractFactory = new ethers.ContractFactory(abi, bin, _wallet);
  console.log(contractFactory.signer);

  console.log("deploying...");
  return await contractFactory.deploy("RossToken", "RT"); // we may need to include constructor parameters here (the params of the contract constructor)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
