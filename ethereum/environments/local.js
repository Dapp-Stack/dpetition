const secrets = require("@dapp-stack/secrets");

// const decryptedSecrets = JSON.parse(secrets.decrypt());

module.exports = {
  compile: {
    // List of contracts to compile
    contracts: [
      "Identity/Identity.sol",
      "Sai/fab.sol",
      "Sai/weth9.sol",
      "Sai/pit.sol",
      "Controller.sol",
      "Escrow.sol",
      "Petition.sol",
    ]
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
      await deployer.ens.bootstrapWith('petition', 'eth');

      const petition = await deployer.deploy('Petition');
      const escrow = await deployer.deploy('Escrow');
      const controller = await deployer.deploy('Controller');

      const t1 = await petition.transferOwnership(controller.address);
      const t2 = await escrow.transferOwnership(controller.address);
      const t3 = await controller.initialize(petition.address, escrow.address);
      
      await t1.wait();
      await t2.wait();
      await t3.wait();
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