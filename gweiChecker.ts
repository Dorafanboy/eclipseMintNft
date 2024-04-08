import { createPublicClient, formatGwei, http } from 'viem';
import { mainnet } from 'viem/chains';
import {printInfo} from "./logPrinter";
import {Config} from "./config";
import {delay} from "./delayer";

export async function checkGwei() {
    printInfo(`Выполняю проверку Gwei`);

    const client = createPublicClient({
        chain: mainnet,
        transport: Config.ethereumRpc == '' ? http() : http(Config.ethereumRpc),
    });

    let gwei = await client.getGasPrice();

    while (Number(formatGwei(gwei)).toFixed(2) > Number(Config.maxBridgeL1Gwei).toFixed(2)) {
        if (Number(formatGwei(gwei)).toFixed(2) > Number(Config.maxBridgeL1Gwei).toFixed(2)) {
            printInfo(
                `Газ в сети Ethereum высокий: ${Number(formatGwei(gwei)).toFixed(2)} > ${Config.maxBridgeL1Gwei}(from config)\n`,
            );
            await delay(Config.delayBetweenGweiCheck.min, Config.delayBetweenGweiCheck.max, true);
        }

        gwei = await client.getGasPrice();
    }

    printInfo(`Гвей позволяет продолжить работу. Ethereum: ${Number(formatGwei(gwei)).toFixed(2)} gwei.`);
}
