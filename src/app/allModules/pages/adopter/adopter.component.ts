import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SRC_I } from 'app/models/icon.models';

@Component({
  selector: 'app-adopter',
  templateUrl: './adopter.component.html',
  styleUrls: ['./adopter.component.scss']
})
export class AdopterComponent implements OnInit {
  displayedColumns: string[] = [
    'Item',
    'Field1',
    'Field2',
    'FileExt',
];
SourceDataSource: MatTableDataSource<SRC>;
  constructor() { }

  ngOnInit() {
  }

}
