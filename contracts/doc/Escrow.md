## Dapp's Description Report
### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /Users/anthony/code/DappStack/petition/contracts/src/Escrow.sol | b3c0ec1e6924dc0db5b0b83a23356f016c672ed1 |

### Contracts Description Table

|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **Escrow** | Implementation | Ownable |||
| └ | depositsOf | Public ❗️ |   | |
| └ | deposit | Public ❗️ | 🛑  | onlyOwner |
| └ | withdraw | Public ❗️ | 🛑  | onlyOwner |

### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
