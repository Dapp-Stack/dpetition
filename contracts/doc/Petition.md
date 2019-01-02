## Dapp's Description Report
### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /Users/anthony/code/DappStack/petition/contracts/src/Petition.sol | 2c535b5acf5fa4a8923af836fce6957824500418 |

### Contracts Description Table

|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Petition** | Implementation | Ownable |||
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
