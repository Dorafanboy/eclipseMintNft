import {PrivateKeyAccount} from "viem";

export interface IBridgeRange {
    readonly min: number;
    readonly max: number;
}

export interface IDelayRange extends IBridgeRange {}

export interface IFunction {
    readonly func: (account: PrivateKeyAccount) => Promise<boolean>;
    readonly isUse: boolean;
}