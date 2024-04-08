import { privateKeyToAccount } from 'viem/accounts';
import { Config, EclipseConfig } from './config';
import * as fs from 'fs';
import * as readline from 'readline';
import {claimNFT} from "./eclipse";
import {IFunction} from "./interfaces";
import {printError, printInfo, printSuccess} from "./logPrinter";
import {delay} from "./delayer";

let account;

const privateKeysFilePath = 'private_keys.txt';

const privateKeysPath = fs.createReadStream(privateKeysFilePath);

const functions: { [key: string]: IFunction } = {
    claimNFT: { func: claimNFT, isUse: EclipseConfig.isUse },
};

const filteredFunctions = Object.keys(functions)
    .filter((key) => functions[key].isUse)
    .map((key) => functions[key].func);

if (filteredFunctions.length == 0) {
    printError(`Нету модулей для запуска`);
    throw `No modules`;
}

async function main() {
    const rl = readline.createInterface({
        input: privateKeysPath,
        crlfDelay: Infinity,
    });

    let index = 0;

    const data = fs.readFileSync(privateKeysFilePath, 'utf8');

    const count = data.split('\n').length;

    for await (const line of rl) {
        try {
            if (line == '') {
                printError(`Ошибка, пустая строка в файле private_keys.txt`);
                return;
            }

            account = privateKeyToAccount(<`0x${string}`>line);
            printInfo(`Start [${index + 1}/${count} - ${account.address}]\n`);

            const randomFunction = filteredFunctions[Math.floor(Math.random() * filteredFunctions.length)];

            await randomFunction(account);

            printSuccess(`Ended [${index + 1}/${count} - ${account.address}]\n`);

            index++;

            if (index == count) {
                printSuccess(`Все аккаунты отработаны`);
                rl.close();
                return;
            }

            printInfo(`Ожидаю получение нового аккаунта`);
            await delay(Config.delayBetweenAccounts.min, Config.delayBetweenAccounts.max, true);
        } catch (e) {
            printError(`Произошла ошибка при обработке строки: ${e}\n`);

            printInfo(`Ожидаю получение нового аккаунта`);
            await delay(Config.delayBetweenAccounts.min, Config.delayBetweenAccounts.max, true);

            index++;
        }
    }
}

main();
