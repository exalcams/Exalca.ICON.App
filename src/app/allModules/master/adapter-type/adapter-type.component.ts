import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationDetails } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { ADAPTERTYPE, AdapterTypeWithItem, AdapterTypeItemView } from 'app/models/icon.models';
import { fuseAnimations } from '@fuse/animations';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-adapter-type',
  templateUrl: './adapter-type.component.html',
  styleUrls: ['./adapter-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdapterTypeComponent implements OnInit {
  MenuItems: string[];
  authenticationDetails: AuthenticationDetails;
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  DistinctAdapterTypes: string[] = [];
  AllAdapterTypes: AdapterTypeWithItem[] = [];
  SelectedAdapterTypeWithItem: AdapterTypeWithItem;
  SelectedAdapterType: string;
  searchText = '';
  selectAdapterTypeID = 0;
  AdapterTypeFormGroup: FormGroup;
  KeysFormArray: FormArray = this._formBuilder.array([]);
  constructor(
    private _masterService: MasterService,
    private _router: Router,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.AdapterTypeFormGroup = this._formBuilder.group({
      Type: ['', Validators.required],
      Keys: this.KeysFormArray
      // Key: ['', Validators.required],
      // sampleValue: ['']
    });
    this.SelectedAdapterTypeWithItem = new AdapterTypeWithItem();
  }

  ngOnInit(): void {
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.CurrentUserName = this.authenticationDetails.userName;
      this.CurrentUserID = this.authenticationDetails.userID;
      this.CurrentUserRole = this.authenticationDetails.userRole;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('AdapterType') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
      // this.GetAllAdapterTypes();
      this.GetDistinctAdapterTypes();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    this.SelectedAdapterType = '';
    this.selectAdapterTypeID = 0;
    this.ResetKeys();
    this.AdapterTypeFormGroup.reset();
    Object.keys(this.AdapterTypeFormGroup.controls).forEach(key => {
      this.AdapterTypeFormGroup.get(key).markAsUntouched();
    });

  }

  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  ResetKeys(): void {
    this.ClearFormArray(this.KeysFormArray);
  }

  AddAdapterType(): void {
    this.ResetControl();
  }

  GetDistinctAdapterTypes(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetDistinctAdapterTypes().subscribe(
      (data) => {
        if (data) {
          this.DistinctAdapterTypes = data as string[];
          if (this.DistinctAdapterTypes.length && this.DistinctAdapterTypes.length > 0) {
            this.loadSelectedAdapterType(this.DistinctAdapterTypes[0]);
          }
          this.IsProgressBarVisibile = false;
        }
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  // GetAllAdapterTypes(): void {
  //   this.IsProgressBarVisibile = true;
  //   this._masterService.GetAllAdapterTypes().subscribe(
  //     (data) => {
  //       if (data) {
  //         this.AllAdapterTypes = data as ADAPTERTYPEC[];
  //         if (this.AllAdapterTypes.length && this.AllAdapterTypes.length > 0) {
  //           this.loadSelectedAdapterType(this.AllAdapterTypes[0]);
  //         }
  //         this.IsProgressBarVisibile = false;
  //       }
  //     },
  //     (err) => {
  //       console.error(err);
  //       this.IsProgressBarVisibile = false;
  //     }
  //   );
  // }

  loadSelectedAdapterType(Adapter: string): void {
    this.ResetControl();
    this.SelectedAdapterType = Adapter;
    // this.selectAdapterTypeID = AdapterType.Id;
    this.AdapterTypeFormGroup.get('Type').patchValue(Adapter);
    this.GetAdapterTypesByType(Adapter);
    // this.AdapterTypeFormGroup.get('Key').patchValue(AdapterType.Key);
    // this.AdapterTypeFormGroup.get('sampleValue').patchValue(AdapterType.sampleValue);
  }

  GetAdapterTypesByType(Adapter: string): void {
    this._masterService.GetAdapterTypesByType(Adapter).subscribe(
      (data) => {
        this.SelectedAdapterTypeWithItem = data as AdapterTypeWithItem;
        this.SelectedAdapterTypeWithItem.AdapterTypeItems.forEach(x => {
          this.SetKeyValues(x);
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  SetKeyValues(adpterItem: AdapterTypeItemView): void {
    const row = this._formBuilder.group({
      Key: [adpterItem.Key, Validators.required],
      sampleValue: [adpterItem.sampleValue],
    });
    this.KeysFormArray.push(row);
  }

  AddKey(): void {
    this.AddKeyFormGroup();
  }

  RemoveKey(index: number): void {
    if (this.AdapterTypeFormGroup.enabled) {
      if (this.KeysFormArray.length > 0) {
        this.KeysFormArray.removeAt(index);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddKeyFormGroup(): void {
    const row = this._formBuilder.group({
      Key: ['', Validators.required],
      sampleValue: ['', Validators.required],
    });
    this.KeysFormArray.push(row);
  }



  // loadSelectedAdapterType(AdapterType: ADAPTERTYPEC): void {
  //   this.SelectedAdapterType = AdapterType;
  //   this.selectAdapterTypeID = AdapterType.Id;
  //   this.AdapterTypeFormGroup.get('Type').patchValue(AdapterType.Type);
  //   this.AdapterTypeFormGroup.get('Key').patchValue(AdapterType.Key);
  //   this.AdapterTypeFormGroup.get('sampleValue').patchValue(AdapterType.sampleValue);
  // }

  SaveClicked(): void {
    if (this.AdapterTypeFormGroup.valid) {
      this.GetAdapterTypeValues();
      this.GetKeyValues();
      if (this.SelectedAdapterTypeWithItem.AdapterTypeItems.length && this.SelectedAdapterTypeWithItem.AdapterTypeItems.length > 0) {
        this.CheckForDuplicateKey();
      } else {
        this.notificationSnackBarComponent.openSnackBar('Please add atleast one item for key', SnackBarStatus.danger);
      }
      // if (this.SelectedAdapterType.Id) {
      //   const Actiontype = 'Update';
      //   this.OpenConfirmationDialog(Actiontype);
      // } else {
      //   const Actiontype = 'Create';
      //   this.OpenConfirmationDialog(Actiontype);
      // }
    } else {
      this.ShowValidationErrors(this.AdapterTypeFormGroup);
    }
  }

  DeleteClicked(): void {
    if (this.AdapterTypeFormGroup.valid) {
      // if (this.SelectedAdapterType.Id) {
      //   const Actiontype = 'Delete';
      //   this.OpenConfirmationDialog(Actiontype);
      // }
      const Actiontype = 'Delete';
      this.OpenConfirmationDialog(Actiontype);
    } else {
      this.ShowValidationErrors(this.AdapterTypeFormGroup);
    }
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
  // ShowValidationErrors(): void {
  //   Object.keys(this.AdapterTypeFormGroup.controls).forEach(key => {
  //     this.AdapterTypeFormGroup.get(key).markAsTouched();
  //     this.AdapterTypeFormGroup.get(key).markAsDirty();
  //   });
  // }

  OpenConfirmationDialog(Actiontype: string): void {
    const dialogConfig: MatDialogConfig = {
      data: {
        Actiontype: Actiontype,
        Catagory: 'Adapter type'
      },
      panelClass: 'confirmation-dialog'
    };
    const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          if (Actiontype === 'Create') {
            this.CreateAdapterType();
          } else if (Actiontype === 'Update') {
            this.UpdateAdapterType();
          } else if (Actiontype === 'Delete') {
            this.DeleteAdapterType();
          }
          // if (Actiontype === 'Save') {
          //   this.UpdateAdapterType();
          // } 
          // else if (Actiontype === 'Delete') {
          //   this.DeleteAdapterType();
          // }
        }
      });
  }

  GetAdapterTypeValues(): void {
    this.SelectedAdapterTypeWithItem.Type = this.AdapterTypeFormGroup.get('Type').value;
    // this.SelectedAdapterType.Type = this.AdapterTypeFormGroup.get('Type').value;
    // this.SelectedAdapterType.Key = this.AdapterTypeFormGroup.get('Key').value;
    // this.SelectedAdapterType.sampleValue = this.AdapterTypeFormGroup.get('sampleValue').value;
  }

  GetKeyValues(): void {
    // const selAdapterType = this.AdapterTypeFormGroup.get('Type').value;
    // const CurrentUserID = this.authenticationDetails.userID.toString();
    // this.AllAdapterTypes = [];
    this.SelectedAdapterTypeWithItem.AdapterTypeItems = [];
    const TransformItemsArr = this.AdapterTypeFormGroup.get('Keys') as FormArray;
    TransformItemsArr.controls.forEach((x, i) => {
      const TransformItem: AdapterTypeItemView = new AdapterTypeItemView();
      TransformItem.Key = x.get('Key').value;
      TransformItem.sampleValue = x.get('sampleValue').value;
      // this.AllAdapterTypes.push(TransformItem);
      this.SelectedAdapterTypeWithItem.AdapterTypeItems.push(TransformItem);
    });
  }

  CheckForDuplicateKey(): void {
    // const valueArr = this.SelectedTransform.TRFIList.map(x => x.paramID);
    // const isDuplicate = valueArr.some(function (item, idx): boolean {
    //   return valueArr.indexOf(item) !== idx;
    // });
    // return isDuplicate;

    const uniq = this.SelectedAdapterTypeWithItem.AdapterTypeItems
      .map((x) => {
        return {
          count: 1,
          Key: x.Key
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
      if (this.SelectedAdapterType) {
        const Actiontype = 'Update';
        this.OpenConfirmationDialog(Actiontype);
      } else {
        const Actiontype = 'Create';
        this.OpenConfirmationDialog(Actiontype);
      }
    }
  }


  CreateAdapterType(): void {
    this.SelectedAdapterTypeWithItem.CreatedBy = this.CurrentUserID.toString();
    this.IsProgressBarVisibile = true;
    this._masterService.CreateAdapterType(this.SelectedAdapterTypeWithItem).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Adapter type created successfully', SnackBarStatus.success);
        this.GetDistinctAdapterTypes();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  UpdateAdapterType(): void {
    this.SelectedAdapterTypeWithItem.ModifiedBy = this.CurrentUserID.toString();
    this.IsProgressBarVisibile = true;
    this._masterService.UpdateAdapterType(this.SelectedAdapterTypeWithItem).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Adapter type updated successfully', SnackBarStatus.success);
        this.GetDistinctAdapterTypes();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  DeleteAdapterType(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.DeleteAdapterType(this.SelectedAdapterTypeWithItem).subscribe(
      (data) => {
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar('Adapter type deleted successfully', SnackBarStatus.success);
        this.GetDistinctAdapterTypes();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

}
