## Dapp's Description Report
### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /Users/anthony/code/DappStack/dpetition/ethereum/contracts/src/Petition.sol | b94178810d0f323b2287e6337622ac5131a99159 |

### Contracts Description Table

|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Petition** | Implementation | Ownable |||
| └ | length | Public ❗️ |   | |
| └ | create | Public ❗️ | 🛑  | onlyOwner |
| └ | sign | Public ❗️ | 🛑  | onlyOwner |
| └ | didSign | Public ❗️ |   | |
| └ | didWithdraw | Public ❗️ |   | |
| └ | canWithdraw | Public ❗️ |   | |
| └ | markAsWithdraw | Public ❗️ | 🛑  | onlyOwner |

### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
