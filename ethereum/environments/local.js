const secrets = require("@dapp-stack/secrets");
const ethers = require("ethers");

// const decryptedSecrets = JSON.parse(secrets.decrypt());

const petitionTokenContracts = [
  "PetitionToken/ERC20Mintable.sol",
  "PetitionToken/MintedCrowdsale.sol",
]

async function deployPetitionTokenProtocol(deployer) {
  const token = await deployer.deploy('ERC20Mintable');
  const address = await deployer.signer.getAddress()
  await deployer.deploy('MintedCrowdsale', 1, address, token.address);
}

async function deployENSProtocol(deployer) {
  await deployer.ens.bootstrapWith('petition', 'eth');
}

const saiContracts = [
  "Sai/DappHub/token",
  "Sai/DappHub/roles",
  "Sai/fab.sol",
  "Sai/weth9.sol",
  "Sai/pit.sol",
];

async function deploySAIProtocol(deployer) {
  const gemFab = await deployer.deploy('GemFab');
  const voxFab = await deployer.deploy('VoxFab');
  const tubFab = await deployer.deploy('TubFab');
  const tapFab = await deployer.deploy('TapFab');
  const topFab = await deployer.deploy('TopFab');
  const momFab = await deployer.deploy('MomFab');
  const dadFab = await deployer.deploy('DadFab');

  const daiFab = await deployer.deploy(
    'DaiFab',
    gemFab.address,
    voxFab.address,
    tubFab.address,
    tapFab.address,
    topFab.address,
    momFab.address,
    dadFab.address
  )

  const saiGem = await deployer.deploy('DSToken', ethers.utils.formatBytes32String('ETH'));
  const saiGov = await deployer.deploy('DSToken', ethers.utils.formatBytes32String('GOV'));

  const saiPep = await deployer.deploy('DSValue');
  const saiPip = await deployer.deploy('DSValue');
  const saiPit = "0x0000000000000000000000000000000000000123"

  const saiAdm = await deployer.deploy('DSRoles');
  const admT = await saiAdm.setRootUser(deployer.signer._address, true);
  await admT.wait();

  const daiFabT1 = await daiFab.makeTokens();
  const daiFabT2 = await daiFab.makeVoxTub(saiGem.address, saiGov.address, saiPip.address, saiPep.address, saiPit);
  const daiFabT3 = await daiFab.makeTapTop();
  const daiFabT4 = await daiFab.configParams();
  const daiFabT5 = await daiFab.verifyParams();
  const daiFabT6 = await daiFab.configAuth(saiAdm.address)

  await daiFabT1.wait();
  await daiFabT2.wait();
  await daiFabT3.wait();
  await daiFabT4.wait();
  await daiFabT5.wait();
  await daiFabT6.wait();
}

const zeroContracts = [
  "0x/protocol/AssetProxy/ERC20Proxy.sol",
  "0x/protocol/AssetProxy/ERC721Proxy.sol",
  "0x/tokens/ZRXToken/ZRXToken.sol",
  "0x/protocol/Exchange/Exchange.sol",
  "0x/protocol/AssetProxy/MultiAssetProxy.sol",
  "0x/extensions/Forwarder/Forwarder.sol",
  "0x/extensions/OrderValidator/OrderValidator.sol",
  "0x/extensions/DutchAuction/DutchAuction.sol",
  "0x/protocol/AssetProxyOwner/AssetProxyOwner.sol",
];

async function deploy0xProtocol(deployer) {
  const erc20Proxy = await deployer.deploy('ERC20Proxy');
  const erc721Proxy = await deployer.deploy('ERC721Proxy');
  const zrxToken = await deployer.deploy('ZRXToken');

  const exchange = await deployer.deploy('Exchange');
}

const identityContracts = [
  "Identity/Identity.sol",
]

const petitionContracts = [
  "Petition/Escrow.sol",
  "Petition/Petition.sol",
  "Petition/Controller.sol",
]

async function deployPetitionProtocol(deployer) {
  await deployer.deploy('Controller');
}

module.exports = {
  compile: {
    // List of contracts to compile
    // contracts: saiContracts.concat(zeroContracts).concat(identityContracts).concat(petitionContracts)
    solidity: {
      "0.5.0": identityContracts.concat(petitionContracts).concat(petitionTokenContracts)
    },

    // List of vyper contracts to compile
    // vyper: [
    // ]

    // Optimize solidity compilation, you can learn more about it here:
    // https://solidity.readthedocs.io/en/v0.4.24/using-the-compiler.html
    optimizer: {
      enabled: false,
      runs: 200
    },
  },

  // Ethererum configuration, it can be false if not needed
  ethereum: {
    // The name of the network you want to start/connect
    // Default value is dev
    // Possible values are: homestead, rinkeby, ropsten, kovan, dev and external
    // In case of external, the expected url will be http://localhost:8545
    // network: 'dev',

    // If the network is public (homestead, rinkeby, ropsten or kovan)
    // you can set your infura API key with this setting.
    // apiKey: decryptedSecrets.rinkeby.infuraApiKey,

    // If the network is public (homestead, rinkeby, ropsten or kovan)
    // the mnemonic is required in order to deploy the contracts.
    // Make sure it is funded.
    // mnemonic: decryptedSecrets.rinkeby.mnemonic,

    // Function executed by DApp Stack to deploy the contracts.
    migrate: async (deployer) => {
      await deployENSProtocol(deployer);
      // await deploySAIProtocol(deployer);
      // await deploy0xProtocol(deployer);
      await deployPetitionProtocol(deployer);
      await deployPetitionTokenProtocol(deployer);
    }
  },

  // IPFS configuration, if can be true or false
  // In case if true, an IPFS daemon will be started at http://localhost:5001
  // Default value is false
  ipfs: true,

  // Web configuration
  web: {
    // The web framework you are using.
    // Default value is react
    // Possible values are: create-react-app, angular, vue, test, next and false
    framework: false,

    // How to deploy the assets,
    // Default value is ipfs
    // Possible values are: ipfs and false
    deploy: 'ipfs',
  },
};