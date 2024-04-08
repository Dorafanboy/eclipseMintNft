import {IBridgeRange, IDelayRange} from "./interfaces";

export class Config {
    public static readonly delayBetweenAccounts: IDelayRange = { min: 15, max: 25 }; // задержка между аккаунтами (в минутах)
    public static readonly delayBetweenGweiCheck: IDelayRange = { min: 0.3, max: 1 }; // задержка перед получением нового гвея (в минутах)
    public static readonly maxBridgeL1Gwei = 40; // до какого гвея будет использоваться бридж
    public static readonly ethereumRpc: string = 'https://rpc.ankr.com/eth'; // rpc для Ethereum chain, если нет необходимости то оставить ''
}

export class EclipseConfig {
    public static readonly isUse: boolean = true; // использовать ли ethereum сеть
    public static readonly nftAmount: IBridgeRange = { min: 1, max: 1 }; // в каком диапазоне будут минтиться нфт
}
