const ethers = require("ethers")
const { getJsonWalletAddress } = require("ethers/lib/utils.js")
const fs = require("fs-extra") // should come with node
require("dotenv").config()

// clear && yarn run go-ganache
// clear && yarn run compile && node deploy.js

async function main() {
	let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL) // connect to our Ganache local test blockchain
	let wallet = await getWallet(provider)

	let contractLive = await makeAndDeploy(
		"RossToken_sol_Contract8mytoken",
		wallet
	)

	await contractLive.mint()
	console.log(`owner 0: ${await contractLive.owners(0)}`) // string interpolation :D
}

async function makeAndDeploy(_contract, _wallet) {
	const abi = fs.readFileSync(_contract + ".abi", "utf8")
	const bin = fs.readFileSync(_contract + ".bin", "utf8")

	const contractFactory = new ethers.ContractFactory(abi, bin, _wallet)
	console.log(contractFactory.signer)

	console.log("deploying...")
	return await contractFactory.deploy("RossToken", "RT") // we may need to include constructor parameters here (the params of the contract constructor)
}

async function getWallet(_provider) {
	const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8") // read our encytyped JSON key to decrypt
	let _wallet = new ethers.Wallet.fromEncryptedJsonSync(
		encryptedJson,
		process.env.PRIVATE_KEY_PASSWORD
	)
	_wallet = await _wallet.connect(_provider)
	return _wallet
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
