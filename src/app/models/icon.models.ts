import { Guid } from 'guid-typescript';
export class Adapter_H{
    AdapterID:Guid;
    Type:string;
    Title:string;
    Status:boolean;
}
export class SRC_I{
    srcID:string;
    Item:string;
    Field1:string;
    Field2:string;
    FileExt:string;
}
export class ADAPTER_I{
    AdapterID:Guid;
    Key:string;
    Value:string;
}
export class ADAPTER_TYPE_C{
    Id:Guid;
    Type:string;
    Key:string;
    sampleValue:string;
    VisibleField:string;
}
export class BOT_H{
    botID:Guid;
    Title:string;
    Status:string;
    Comments:string;
    Freq:string;
    Interval:string;
    StartDate:Date;
    UntilWhen:Date;
}
export class BOT_LOG{
    RunID:Guid;
    srcVisibleField:string;
    tfrVisibleField:string;
    Status:string;

}
export class SRC_H{
    srcID:Guid;
    title:string;
    AdapterID:Guid;
}
export class TRF_H{
    trfID:Guid;
    Title:string;
    Type:string;

}
export class TRF_I{
    trfID:Guid;
    pramID:Guid;
    Value:string;
    NumOnly:boolean;
    TxtOnly:boolean;
    Amount:string;
    Quan:string;
    Date:Date;
    Digitscount:number;
    Pattern:string;
}