import { AssetManagement } from './../../../models/assetmanagement';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-asset-management',
    templateUrl: './asset-management.component.html',
    styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {
    displayedColumns: string[] = [
        'select',
        'AssetId',
        'Status',
        'PONumber',
        'PODate',
        'Value',
        'CurrencyUsedBy',
        'AssignmentDate',
        'Unit',
        'BarCode'
    ];
    dataSource = new MatTableDataSource<AssetManagement>(ELEMENT_DATA);
    constructor() {}

    ngOnInit() {
        this.dataSource;
    }
}

const ELEMENT_DATA: AssetManagement[] = [
    { AssetId: '', Status: '', PONumber: '', PODate: null, value: '', CurrencyUsedBy: '', AssignmentDate: null, Unit: '', BarCode: '' },
    { AssetId: '', Status: '', PONumber: '', PODate: null, value: '', CurrencyUsedBy: '', AssignmentDate: null, Unit: '', BarCode: '' },
    { AssetId: '', Status: '', PONumber: '', PODate: null, value: '', CurrencyUsedBy: '', AssignmentDate: null, Unit: '', BarCode: '' },
    { AssetId: '', Status: '', PONumber: '', PODate: null, value: '', CurrencyUsedBy: '', AssignmentDate: null, Unit: '', BarCode: '' }
];
