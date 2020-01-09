import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-boatassemply',
  templateUrl: './boatassemply.component.html',
  styleUrls: ['./boatassemply.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations                                                      
})
export class BoatassemplyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
