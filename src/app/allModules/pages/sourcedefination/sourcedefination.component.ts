import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatIconRegistry, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
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
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';

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
  fileMapperMainFormGroup: FormGroup;
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
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.SelectedAdapter = new SourceView();
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
    this.fileMapperMainFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      Title:['',Validators.required],
      SourceItems: this.AdapterItemFormArray
     
    });
    this.AllTypes = ['Email', 'FTP'];
    this.GetAllAdapter();
  }
  ResetForm(): void {
    this.fileMapperMainFormGroup.reset();
    Object.keys(this.fileMapperMainFormGroup.controls).forEach(key => {
      this.fileMapperMainFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetSourceItems();
    this.ResetForm();
    this.SelectedAdapter = new SourceView();
    this.SelectedAdapter.SourceItemList = [];
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
    this.GetAllAdapter();
    

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
      Field1: ['',Validators.required],
      Field2: ['',Validators.required],
      FileExt: ['',Validators.required],
    });
    this.AdapterItemFormArray.insert(0, row);
    this.AdapterItemDataSource.next(this.AdapterItemFormArray.controls);
  }

  SubmitClicked():void{
    // console.log(this.fileMapperMainFormGroup.get('Type').value);
    // console.log(this.fileMapperMainFormGroup.get('Title').value);
    if (this.fileMapperMainFormGroup.valid) {
      const AdapterItemsArry = this.fileMapperMainFormGroup.get('SourceItems') as FormArray;
      console.log(AdapterItemsArry.value);
      if (AdapterItemsArry.length <= 0) {
        this.notificationSnackBarComponent.openSnackBar('Please add values', SnackBarStatus.danger);
      } else {
        this.GetHeaderValues();
        this.GetItemValues();
        this.CheckForDuplicateParamID();
      }
    } else {
      this.ShowValidationErrors(this.fileMapperMainFormGroup);
    }
  }
  GetHeaderValues(): void {
    this.SelectedAdapter = new SourceView();
    this.SelectedAdapter.AdapterID = this.fileMapperMainFormGroup.get('Type').value;
    this.SelectedAdapter.title=this.fileMapperMainFormGroup.get('Title').value;

  }
  GetItemValues(): void {
    this.AdapterItemList = [];
    this.SelectedAdapter.SourceItemList = [];
    const AdapterItemsArr = this.fileMapperMainFormGroup.get('SourceItems') as FormArray;
    AdapterItemsArr.controls.forEach((x, i) => {
      const AdapterItem: SRCI = new SRCI();
      // AdapterItem. = this.SelectedAdapter.srcID;
      AdapterItem.Item = x.get('Item').value;
      AdapterItem.Field1 = x.get('Field1').value;
      AdapterItem.Field2 = x.get('Field2').value;
      AdapterItem.FileExt = x.get('FileExt').value;
      this.SelectedAdapter.SourceItemList.push(AdapterItem);
    });
  }
  ShowValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!formGroup.get(key).valid) {
        console.log(key);
      }
      formGroup.get(key).markAsTouched();
      formGroup.get(key).markAsDirty();
      if (formGroup.get(key) instanceof FormArray) {
        const FormArrayControls = formGroup.get(key) as FormArray;
        Object.keys(FormArrayControls.controls).forEach(key1 => {
          if (FormArrayControls.get(key1) instanceof FormGroup) {
            const FormGroupControls = FormArrayControls.get(key1) as FormGroup;
            Object.keys(FormGroupControls.controls).forEach(key2 => {
              FormGroupControls.get(key2).markAsTouched();
              FormGroupControls.get(key2).markAsDirty();
              if (!FormGroupControls.get(key2).valid) {
                console.log(key2);
              }
            });
          } else {
            FormArrayControls.get(key1).markAsTouched();
            FormArrayControls.get(key1).markAsDirty();
          }
        });
      }
    });
  }
  CheckForDuplicateParamID(): void {
    // const valueArr = this.SelectedTransform.TRFIList.map(x => x.paramID);
    // const isDuplicate = valueArr.some(function (item, idx): boolean {
    //   return valueArr.indexOf(item) !== idx;
    // });
    // return isDuplicate;

    const uniq = this.SelectedAdapter.SourceItemList
      .map((x) => {
        return {
          count: 1,
          Key: x.Item
        };
      })
      .reduce((a, b) => {
        a[b.Key] = (a[b.Key] || 0) + b.count;
        return a;
      }, {});

    const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    if (duplicates && duplicates.length && duplicates.length > 0) {
      const duplicateKeys = duplicates.join();
      this.notificationSnackBarComponent.openSnackBar(`Please remove duplicate Key(s) : ${duplicateKeys}`, SnackBarStatus.danger);
    } else {
      if (this.SelectedAdapter.AdapterID) {
        const Actiontype = 'Update';
        const Catagory = 'Template';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'Template';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    }
  }
  OpenConfirmationDialog(Actiontype: string, Catagory: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: Catagory
      },
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Create') {
            this.CreateAdapter();
          }
          else if (Actiontype === 'Update') {
            this.CreateAdapter();
          }
          else if (Actiontype === 'Approve') {
            // this.ApproveHeader();
          }
        }
      });
  }
  CreateAdapter(): void {
    this.IsProgressBarVisibile = true;
    this._sourceService.CreateSource(this.SelectedAdapter).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Source details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllAdapter();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  UpdateAdapter(): void {
    this.IsProgressBarVisibile = true;
    this._sourceService.UpdateSource(this.SelectedAdapter).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Source details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllAdapter();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
}
//const ELEMENT_DATA1: SRCI[] = [{ srcID: 'b43a4086-ef7a-4d20-9bcf-338a3a928041', Item: '8001002118', Field1: '10', Field2: '25411.00', FileExt: 'xyz' }];
