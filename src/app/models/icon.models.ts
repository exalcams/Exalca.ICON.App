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
    srcID: number;
    Item: string;
    Field1: string;
    Field2: string;
    FileExt: string;
    TrainingID: string;
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
export class ADAPTERTYPE {
    AdapterTypeID: number;
    Type: string;
    VisibleField: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}

export class ADAPTERTYPEITEM {
    Id: number;
    AdapterTypeID: number;
    Key: string;
    sampleValue: string;
    VisibleField: string;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class AdapterTypeWithItem {
    AdapterTypeID: number;
    Type: string;
    VisibleField: string;
    AdapterTypeItems: AdapterTypeItemView[];
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class AdapterTypeItemView {
    Id: number;
    AdapterTypeID: number;
    Key: string;
    sampleValue: string;
    VisibleField: string;
}
export class BOTH {
    botID: number;
    Title: string;
    srcID: number;
    trfID: number;
    Status: string;
    Comments: string;
    Freq: string;
    Interval: string;
    DatePart: string;
    StartDate: Date;
    InstancesCount: number;
    UntilWhen: Date;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class BOTHView {
    botID: number;
    Title: string;
    srcID: number;
    srcTitle: string;
    trfID: number;
    trfTitle: string;
    Status: string;
    Freq: string;
    CreatedOn: Date;
}
export class BOTLOG {
    RunID: Guid;
    srcVisibleField: string;
    tfrVisibleField: string;
    Status: string;

}
export class SRCH {
    srcID: number;
    Title: string;
    AdapterID: Guid;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
}
export class SRCHView {
    srcID: number;
    Title: string;
    AdapterID: Guid;
    CreatedOn: Date;
    CreatedBy: string;
    ModifiedOn?: Date;
    ModifiedBy: string;
    SRCIList: SRCI[];
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
export class TransformationAdapterView {
    trfID: number;
    Title: string;
    AdapterID: number;
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
    srcID: number;
    title: string;
    AdapterID: number;
    SourceItemList: SourcdeDefinationValues[];
}

export class AdapterItemRule {
    AdapterID: number;
    Value: string;
}
export class SourcdeDefinationValues {
    srcID: number;
    Item: string;
    Field1: string;
    Field2: string;
    FileExt: string;

}
