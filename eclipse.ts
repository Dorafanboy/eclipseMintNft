import {printError, printInfo, printSuccess} from "./logPrinter";
import {mainnet} from "viem/chains";
import {
    createPublicClient,
    createWalletClient,
    formatUnits,
    http,
    PrivateKeyAccount,
    SimulateContractReturnType
} from "viem";
import {Config, EclipseConfig} from "./config";
import {checkGwei} from "./gweiChecker";
import {currency, eclipseContractAddress, proof, quantityLimit, tokenPrice} from "./eclipseData";
import {eclipseABI} from "./eclipseABI";

export async function claimNFT(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль Eclipse Claim`);
    
    const client = createPublicClient({
        chain: mainnet,
        transport: Config.ethereumRpc == '' ? http() : http(Config.ethereumRpc),
    });

    await checkGwei();
    
    const quantity = Math.floor(Math.random() * (EclipseConfig.nftAmount.max - EclipseConfig.nftAmount.min)
        + EclipseConfig.nftAmount.min);
    
    const price = BigInt(quantity) * BigInt(tokenPrice)

    printInfo(`Вызываю функцию Claim по цене ${formatUnits(price, 18)} ETH [${quantity} NFTS]`);
    
    const walletClient = createWalletClient({
        chain: mainnet,
        transport: Config.ethereumRpc == '' ? http() : http(Config.ethereumRpc),
    });

    const { request } = await client
        .simulateContract({
            address: eclipseContractAddress,
            abi: eclipseABI,
            functionName: 'claim',
            args: [account.address, quantity,currency, tokenPrice, [[proof], quantityLimit, tokenPrice, currency], '0x'],
            account: account,
            value: price
        })
        .then((result) => result as SimulateContractReturnType)
        .catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Eclipse - ${e}`);
            return { request: undefined };
        });

    if (request !== undefined) {
        const hash = await walletClient.writeContract(request).catch((e) => {
            printError(`Произошла ошибка во время выполнения модуля Eclipse - ${e}`);
            return false;
        });

        if (hash == false) {
            return false;
        }

        const url = `${mainnet.blockExplorers?.default.url + '/tx/' + hash}`;

        printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`);
   }

    return true;
}
