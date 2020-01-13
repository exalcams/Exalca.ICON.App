import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatIconRegistry, MatSnackBar, MatDialog } from '@angular/material';
import { SRCI, SourceView, AdapterH, ADAPTERI } from 'app/models/icon.models';
import { FormArray, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterService } from 'app/services/master.service';
import { AdapterService } from 'app/services/adapter.service';
import { DatePipe } from '@angular/common';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { SourcedefinationService } from 'app/services/sourcedefination.service';

@Component({
  selector: 'app-sourcedefination',
  templateUrl: './sourcedefination.component.html',
  styleUrls: ['./sourcedefination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SourcedefinationComponent implements OnInit {
  AdapterItemColumns: string[] = [
    'Item',
    'Field1',
    'Field2',
    'FileExt',
    'Action',
  ];
  adapterdisplayname:string[]=[
'Key',
'Value',
  ];
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  AllTypes: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  AdopterCreationFormGroup: FormGroup;
  AdapterItemFormArray: FormArray = this._formBuilder.array([]);
  AdapterItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  AdaptereaderList: ADAPTERI[] = [];
  AdapterHeaderDataSource: MatTableDataSource<ADAPTERI>;
  SelectedAdapter: SourceView;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  AdapterCreationFormGroup: FormGroup;
  AdapterItemList: SRCI[];
  SourceDataSource: MatTableDataSource<SRCI>;
  AllAdapters: ADAPTERI[] = [];
  constructor(
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _sourceService: SourcedefinationService,
    private dialog: MatDialog,
    private _datePipe: DatePipe
  ) {
    
   }

   ngOnInit(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.CurrentUserRole = this.authenticationDetails.userRole;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      // if (this.MenuItems.indexOf('TemplateCreation') < 0) {
      //   this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
      //   this._router.navigate(['/auth/login']);
      // }
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.AdopterCreationFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      AdapterItems: this.AdapterItemFormArray
     
    });
    this.AllTypes = ['Email', 'FTP'];
    this.GetAllAdapter();
  }
  ResetForm(): void {
    this.AdapterCreationFormGroup.reset();
    Object.keys(this.AdapterCreationFormGroup.controls).forEach(key => {
      this.AdapterCreationFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetSourceItems();
    this.ResetForm();
    this.SelectedAdapter = new SourceView();
    this.AdapterItemList = [];
  }
  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  ResetSourceItems(): void {
    this.ClearFormArray(this.AdapterItemFormArray);
    this.AdapterItemDataSource.next(this.AdapterItemFormArray.controls);
  }
  GetAllAdapter(): void {
    this._sourceService.GetAllAdapter().subscribe(
      (data) => {
        this.AllAdapters = data as ADAPTERI[];
        if (this.AllAdapters.length && this.AllAdapters.length > 0) {

        }
        console.log(this.AllAdapters);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  AddAdapterItem(): void {
    this.AddAdapterItemFormGroup();
  }
  SelcetAdopter(value:number):void{
    this._sourceService.GetAdapterById(value).subscribe(
      (data) => {
        this.AdaptereaderList = data as ADAPTERI[];
        this.AdapterHeaderDataSource = new MatTableDataSource(this.AdaptereaderList);
       // this.AdapterHeaderDataSource.sort = this.sort;
        console.log(this.AdaptereaderList);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  RemoveAdapterItem(index: number): void {
    if (this.AdopterCreationFormGroup.enabled) {
      if (this.AdapterItemFormArray.length > 0) {
        this.AdapterItemFormArray.removeAt(index);
        this.AdapterItemDataSource.next(this.AdapterItemFormArray.controls);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddAdapterItemFormGroup(): void {
    const row = this._formBuilder.group({
      Item: ['', Validators.required],
      Field1: [''],
      Field2: [''],
      FileExt: [''],
    });
    this.AdapterItemFormArray.insert(0, row);
    this.AdapterItemDataSource.next(this.AdapterItemFormArray.controls);
  }

}
const ELEMENT_DATA1: SRCI[] = [{ srcID: 'b43a4086-ef7a-4d20-9bcf-338a3a928041', Item: '8001002118', Field1: '10', Field2: '25411.00', FileExt: 'xyz' }];
