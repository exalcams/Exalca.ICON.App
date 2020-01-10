import { Guid } from 'guid-typescript';
export class AdapterH {
    AdapterID: Guid;
    Type: string;
    Title: string;
    Status: boolean;
    CreadtedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date;
    ModifiedBy: string;
}
export class SRCI {
    srcID: string;
    Item: string;
    Field1: string;
    Field2: string;
    FileExt: string;
}

export class ADAPTERI {
    AdapterID: Guid;
    Key: string;
    Value: string;
    CreadtedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date;
    ModifiedBy: string;
}
export class ADAPTERTYPEC {
    Id: Guid;
    Type: string;
    Key: string;
    sampleValue: string;
    VisibleField: string;
}
export class BOTH {
    botID: Guid;
    Title: string;
    Status: string;
    Comments: string;
    Freq: string;
    Interval: string;
    StartDate: Date;
    UntilWhen: Date;
}
export class BOTLOG {
    RunID: Guid;
    srcVisibleField: string;
    tfrVisibleField: string;
    Status: string;

}
export class SRCH {
    srcID: Guid;
    title: string;
    AdapterID: Guid;
}
export class TRFH {
    trfID: Guid;
    Title: string;
    Type: string;

}
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

export class AdapterHView {
    AdapterID: Guid;
    Type: string;
    Title: string;
    Status: boolean;
    CreadtedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date;
    ModifiedBy: string;
    ADAPTERIList: ADAPTERIView[];
}
export class ADAPTERIView {
    AdapterID: Guid;
    Key: string;
    Value: string;
    CreadtedOn: Date;
    CreatedBy: string;
    ModifiedOn: Date;
    ModifiedBy: string;
}
export class SourceView {
    AdapterID: Guid;
    Type: string;
    Title: string;
    Status: boolean;

    SRCIList: SRCI[]
}
