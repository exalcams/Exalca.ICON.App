import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material';
import { SRCI } from 'app/models/icon.models';

@Component({
  selector: 'app-sourcedefination',
  templateUrl: './sourcedefination.component.html',
  styleUrls: ['./sourcedefination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SourcedefinationComponent implements OnInit {
  displayedColumns: string[] = [
    'Item',
    'Field1',
    'Field2',
    'FileExt',
  ];
  SourceDataSource: MatTableDataSource<SRCI>;
  constructor() { }

  ngOnInit(): void {
    this.SourceDataSource = new MatTableDataSource(ELEMENT_DATA1);
  }

}
const ELEMENT_DATA1: SRCI[] = [{ srcID: 'b43a4086-ef7a-4d20-9bcf-338a3a928041', Item: '8001002118', Field1: '10', Field2: '25411.00', FileExt: 'xyz' }];
