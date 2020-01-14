import { Guid } from 'guid-typescript';
export class AdapterH {
    AdapterID: number;
    Type: string;
    Title: string;
    Status: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
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
    ID: number;
    AdapterID: number;
    Key: string;
    Value: string;
    IsRemovable: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class ADAPTERTYPEC {
    Id: number;
    Type: string;
    Key: string;
    sampleValue: string;
    VisibleField: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
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
    AdapterID: number;
}
export class TRFH {
    trfID: number;
    Title: string;
    Type: string;
    AdapterID: number;
}
export class TRFI {
    ID: number;
    trfID: number;
    paramID: string;
    Value: string;
    NumOnly: boolean;
    TxtOnly: boolean;
    Amount: boolean;
    Quan: boolean;
    Date: boolean;
    Digitscount?: number;
    Pattern: string;
}

export class TRFHView {
    trfID: number;
    Title: string;
    Type: string;
    AdapterID: number;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    TRFIList: TRFI[];
}

export class AdapterHView {
    AdapterID: number;
    Type: string;
    Title: string;
    Status: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    ADAPTERIList: ADAPTERIView[];
}
export class ADAPTERIView {
    ID: number;
    AdapterID: number;
    Key: string;
    Value: string;
    IsRemovable: boolean;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class SourceView {
    AdapterID: Guid;
    Type: string;
    Title: string;
    Status: boolean;
    SRCIList: SRCI[];
}

export class AdapterItemRule {
    AdapterID: number;
    Value: string;
}
