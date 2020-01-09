import { Guid } from 'guid-typescript';
export class TRFI {
    trfID: Guid;
    pramID: Guid;
    Value: string;
    NumOnly: boolean;
    TxtOnly: boolean;
    Amount: string;
    Quan: string;
    Date: Date;
    Digitscount: number;
    Pattern: string;
}
