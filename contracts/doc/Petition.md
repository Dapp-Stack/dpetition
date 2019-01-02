## Dapp's Description Report
### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /Users/anthony/code/DappStack/dpetition/contracts/src/Petition.sol | 10e434a67e2065b95318abb7be14ca1b9f24fe60 |

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
