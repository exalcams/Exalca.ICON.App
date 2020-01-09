import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatIconRegistry, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SRCI, AdapterHView, ADAPTERI } from 'app/models/icon.models';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormArray, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterService } from 'app/services/master.service';
import { DatePipe } from '@angular/common';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { AdapterService } from 'app/services/adapter.service';

@Component({
  selector: 'app-adopter',
  templateUrl: './adopter.component.html',
  styleUrls: ['./adopter.component.scss']
})
export class AdopterComponent implements OnInit {

  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  AdopterCreationFormGroup: FormGroup;
  AdapterItemColumns: string[] = ['Key', 'Value', 'Action'];
  AdapterItemFormArray: FormArray = this._formBuilder.array([]);
  AdapterItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedAdapter: AdapterHView;
  AdapterItemList: ADAPTERI[];
  constructor(
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _adapterService: AdapterService,
    private dialog: MatDialog,
    private _datePipe: DatePipe
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.SelectedAdapter = new AdapterHView();
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
  }


  AddAdapterItem(): void {
    this.AddAdapterItemFormGroup();
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
      Key: ['', Validators.required],
      Value: [''],
    });
    this.AdapterItemFormArray.insert(0, row);
    this.AdapterItemDataSource.next(this.AdapterItemFormArray.controls);
  }

  SubmitClicked(): void {
    if (this.AdopterCreationFormGroup.valid) {
      const AdapterItemsArry = this.AdopterCreationFormGroup.get('AdapterItems') as FormArray;
      if (AdapterItemsArry.length <= 0) {
        this.notificationSnackBarComponent.openSnackBar('Please add values', SnackBarStatus.danger);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'Template';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      }
    } else {
      this.ShowValidationErrors(this.AdopterCreationFormGroup);
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
            // console.log('valid');
          }
          else if (Actiontype === 'Approve') {
            // this.ApproveHeader();
          }
        }
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

  CreateAdapter(): void {
    this.GetHeaderValues();
    this.GetItemValues();
    this.IsProgressBarVisibile = true;
    this._adapterService.CreateAdapter(this.SelectedAdapter).subscribe(
      (data) => {
        if (data) {
          // this.SelectedCreatedTemplate.TemplateID = data as number;
          // this.CreateAdapterParaMapping();
        } else {
          this.notificationSnackBarComponent.openSnackBar('Something went wrong', SnackBarStatus.danger);
        }
        this.IsProgressBarVisibile = false;
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  // CreateAdapterParaMapping(): void {
  //   this.GetParameterValues();
  //   this.IsProgressBarVisibile = true;
  //   this._adapterService.CreateAdapterParaMapping(this.TemplateParaMappingList).subscribe(
  //     (data) => {
  //       this.notificationSnackBarComponent.openSnackBar('Template details updated successfully', SnackBarStatus.success);
  //       this.IsProgressBarVisibile = false;
  //       this.ResetControl();
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //       this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
  //     }
  //   );
  // }

  GetHeaderValues(): void {
    this.SelectedAdapter = new AdapterHView();
    this.SelectedAdapter.Type = this.AdopterCreationFormGroup.get('Type').value;
  }

  GetItemValues(): void {
    this.AdapterItemList = [];
    this.SelectedAdapter.ADAPTERIList = [];
    const AdapterItemsArr = this.AdopterCreationFormGroup.get('AdapterItems') as FormArray;
    AdapterItemsArr.controls.forEach((x, i) => {
      const AdapterItem: ADAPTERI = new ADAPTERI();
      AdapterItem.Key = x.get('Key').value;
      AdapterItem.Value = x.get('Value').value;
      this.SelectedAdapter.ADAPTERIList.push(AdapterItem);
    });
  }


}
