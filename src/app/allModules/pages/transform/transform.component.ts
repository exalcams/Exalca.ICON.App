import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatIconRegistry, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SRCI, TRFHView, TRFI, TRFH, AdapterH, AdapterItemRule } from 'app/models/icon.models';
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
import { TransformService } from 'app/services/Transform.service';
import { AdapterService } from 'app/services/adapter.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-transform',
  templateUrl: './transform.component.html',
  styleUrls: ['./transform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TransformComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  TransformCreationFormGroup: FormGroup;
  TransformItemColumns: string[] = ['ParamID', 'Value', 'Rule', 'Digitscount', 'Pattern', 'Action'];
  TransformItemFormArray: FormArray = this._formBuilder.array([]);
  TransformItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedTransform: TRFHView;
  SelectedTransformID: number;
  TransformItemList: TRFI[];
  AllAdapterItemRules: AdapterItemRule[] = [];
  AllTypes: string[];
  AllRules: string[];
  AllTransforms: TRFH[] = [];
  searchText = '';
  constructor(
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _transformService: TransformService,
    private _adapterService: AdapterService,
    private dialog: MatDialog,
    private _datePipe: DatePipe
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.SelectedTransform = new TRFHView();
    this.SelectedTransformID = 0;
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
    this.TransformCreationFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      Type: ['', Validators.required],
      AdapterID: ['', Validators.required],
      TransformItems: this.TransformItemFormArray
    });
    this.AllTypes = ['xml', 'xlsx', 'csv'];
    this.AllRules = ['NumOnly', 'TxtOnly', 'Amount', 'Quan', 'Date'];
    this.GetAllAdapterItemRule();
    this.GetAllTransform();
  }


  ResetForm(): void {
    this.TransformCreationFormGroup.reset();
    Object.keys(this.TransformCreationFormGroup.controls).forEach(key => {
      this.TransformCreationFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetTransformItems();
    this.ResetForm();
    this.SelectedTransformID = 0;
    this.SelectedTransform = new TRFHView();
    this.SelectedTransform.TRFIList = [];
    this.TransformItemList = [];
  }

  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  ResetTransformItems(): void {
    this.ClearFormArray(this.TransformItemFormArray);
    this.TransformItemDataSource.next(this.TransformItemFormArray.controls);
  }

  GetAllAdapterItemRule(): void {
    this._adapterService.GetAllAdapterItemRule().subscribe(
      (data) => {
        this.AllAdapterItemRules = data as AdapterItemRule[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  GetAllTransform(): void {
    this._transformService.GetAllTransform().subscribe(
      (data) => {
        this.AllTransforms = data as TRFH[];
        if (this.AllTransforms.length && this.AllTransforms.length > 0) {
          this.LoadSelectedTRFH(this.AllTransforms[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // TypeSelected(event): void {
  //   const selectedType = event.value;
  //   if (selectedType) {
  //     this.ResetTransformItems();
  //     if (this.SelectedTransform && this.SelectedTransform.TransformID &&
  //       this.SelectedTransform.Type === selectedType &&
  //       this.TransformItemList && this.TransformItemList.length) {
  //       this.TransformItemList.forEach(x => {
  //         this.SetItemValues(x);
  //       });
  //     } else {
  //       const filteredTransformTypes = this.AllTransformTypes.filter(x => x.Type === selectedType);
  //       filteredTransformTypes.forEach(itr => {
  //         const x = new TransformI();
  //         x.Key = itr.Key;
  //         x.IsRemovable = false;
  //         this.SetItemValues(x);
  //       });
  //     }
  //   }
  // }

  LoadSelectedTRFH(Transform: TRFH): void {
    this.SelectedTransformID = Transform.trfID;
    this.SelectedTransform = new TRFHView();
    this.SelectedTransform.trfID = Transform.trfID;
    this.SelectedTransform.Type = Transform.Type;
    this.TransformCreationFormGroup.get('Title').patchValue(Transform.Title);
    this.TransformCreationFormGroup.get('Type').patchValue(Transform.Type);
    this.TransformCreationFormGroup.get('AdapterID').patchValue(Transform.AdapterID);
    this.ResetTransformItems();
    this.GetAllTransformItemsByTransformID();
  }

  GetAllTransformItemsByTransformID(): void {
    this._transformService.GetAllTransformItemsByTransformID(this.SelectedTransform.trfID).subscribe(
      (data) => {
        this.TransformItemList = data as TRFI[];
        if (this.TransformItemList && this.TransformItemList.length) {
          this.TransformItemList.forEach(x => {
            this.SetItemValues(x);
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  SetItemValues(adpterItem: TRFI): void {
    const RuleValue = adpterItem.NumOnly ? 'NumOnly' : adpterItem.TxtOnly ? 'TxtOnly' :
      adpterItem.Amount ? 'Amount' : adpterItem.Quan ? 'Quan' : adpterItem.Date ? 'Date' : '';
    const row = this._formBuilder.group({
      ParamID: [adpterItem.paramID, Validators.required],
      Value: [adpterItem.Value, Validators.required],
      Rule: [RuleValue, Validators.required],
      Digitscount: [adpterItem.Digitscount],
      Pattern: [adpterItem.Pattern],
    });
    this.TransformItemFormArray.push(row);
    this.TransformItemDataSource.next(this.TransformItemFormArray.controls);
  }

  AddTransformItem(): void {
    this.AddTransformItemFormGroup();
  }

  RemoveTransformItem(index: number): void {
    if (this.TransformCreationFormGroup.enabled) {
      if (this.TransformItemFormArray.length > 0) {
        this.TransformItemFormArray.removeAt(index);
        this.TransformItemDataSource.next(this.TransformItemFormArray.controls);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddTransformItemFormGroup(): void {
    const row = this._formBuilder.group({
      ParamID: ['', Validators.required],
      Value: ['', Validators.required],
      Rule: ['', Validators.required],
      Digitscount: [''],
      Pattern: [''],
    });
    this.TransformItemFormArray.push(row);
    // this.TransformItemFormArray.insert(0, row);
    this.TransformItemDataSource.next(this.TransformItemFormArray.controls);
  }

  SubmitClicked(): void {
    if (this.TransformCreationFormGroup.valid) {
      const TransformItemsArry = this.TransformCreationFormGroup.get('TransformItems') as FormArray;
      if (TransformItemsArry.length <= 0) {
        this.notificationSnackBarComponent.openSnackBar('Please add values', SnackBarStatus.danger);
      } else {
        this.GetHeaderValues();
        this.GetItemValues();
        this.CheckForDuplicateParamID();
      }
    } else {
      this.ShowValidationErrors(this.TransformCreationFormGroup);
    }
  }

  CheckForDuplicateParamID(): void {
    // const valueArr = this.SelectedTransform.TRFIList.map(x => x.paramID);
    // const isDuplicate = valueArr.some(function (item, idx): boolean {
    //   return valueArr.indexOf(item) !== idx;
    // });
    // return isDuplicate;

    const uniq = this.SelectedTransform.TRFIList
      .map((x) => {
        return {
          count: 1,
          ParamID: x.paramID
        };
      })
      .reduce((a, b) => {
        a[b.ParamID] = (a[b.ParamID] || 0) + b.count;
        return a;
      }, {});

    const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    if (duplicates && duplicates.length && duplicates.length > 0) {
      const duplicateParamIDs = duplicates.join();
      this.notificationSnackBarComponent.openSnackBar(`Please remove duplicate Param ID(s) : ${duplicateParamIDs}`, SnackBarStatus.danger);
    } else {
      if (this.SelectedTransform.trfID) {
        const Actiontype = 'Update';
        const Catagory = 'Transform';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'Transform';
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
            this.CreateTransform();
          }
          else if (Actiontype === 'Update') {
            this.UpdateTransform();
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

  CreateTransform(): void {
    this.IsProgressBarVisibile = true;
    this._transformService.CreateTransform(this.SelectedTransform).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Transform details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllTransform();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  UpdateTransform(): void {
    this.IsProgressBarVisibile = true;
    this._transformService.UpdateTransform(this.SelectedTransform).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Transform details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllTransform();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }



  // CreateTransformParaMapping(): void {
  //   this.GetParameterValues();
  //   this.IsProgressBarVisibile = true;
  //   this._transformService.CreateTransformParaMapping(this.TemplateParaMappingList).subscribe(
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
    // this.SelectedTransform = new TRFHView();
    this.SelectedTransform.Title = this.TransformCreationFormGroup.get('Title').value;
    this.SelectedTransform.Type = this.TransformCreationFormGroup.get('Type').value;
    this.SelectedTransform.AdapterID = this.TransformCreationFormGroup.get('AdapterID').value;
  }

  GetItemValues(): void {
    this.TransformItemList = [];
    this.SelectedTransform.TRFIList = [];
    const TransformItemsArr = this.TransformCreationFormGroup.get('TransformItems') as FormArray;
    TransformItemsArr.controls.forEach((x, i) => {
      const TransformItem: TRFI = new TRFI();
      TransformItem.trfID = this.SelectedTransform.trfID;
      TransformItem.paramID = x.get('ParamID').value;
      TransformItem.Value = x.get('Value').value;
      const RuleValue = x.get('Rule').value;
      TransformItem.NumOnly = RuleValue === 'NumOnly';
      TransformItem.TxtOnly = RuleValue === 'TxtOnly';
      TransformItem.Amount = RuleValue === 'Amount';
      TransformItem.Quan = RuleValue === 'Quan';
      TransformItem.Date = RuleValue === 'Date';
      TransformItem.Digitscount = x.get('Digitscount').value;
      TransformItem.Pattern = x.get('Pattern').value;
      this.SelectedTransform.TRFIList.push(TransformItem);
    });
  }
}
