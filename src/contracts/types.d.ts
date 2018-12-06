declare module '@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json' {
  let artifact: ContractArtifact;
  export = artifact;
}

declare module '@gnosis.pm/dx-contracts/networks.json' {
  let networks: {
    DutchExchangeProxy: {
      [networkId: string]: ContractInstance;
    };
  };

  export = networks;
}

interface ContractArtifact {
  contractName: string;
  abi: any[];
  networks: {
    [networkId: string]: ContractInstance;
  };
}

interface ContractInstance {
  events: object;
  links: object;
  address: Address;
  transactionHash: TransactionHash;
}
