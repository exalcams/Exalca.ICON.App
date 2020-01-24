import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatIconRegistry, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { SRCI, SourceView, AdapterH, ADAPTERI, AdapterItemRule, SRCH, SRCHView } from 'app/models/icon.models';
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
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  SourceCreationFormGroup: FormGroup;
  SourceItemColumns: string[] = ['Field1', 'Field2', 'FileExt', 'TrainingID', 'Action'];
  SourceItemFormArray: FormArray = this._formBuilder.array([]);
  SourceItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedSource: SRCHView;
  SelectedSourceID: number;
  SourceItemList: SRCI[];
  AllAdapterItemRules: AdapterItemRule[] = [];
  AllTypes: string[];
  AllTrainingIDs: string[];
  AllSources: SRCH[] = [];
  searchText = '';
  constructor(
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _SourceService: SourcedefinationService,
    private _adapterService: AdapterService,
    private dialog: MatDialog,
    private _datePipe: DatePipe
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.SelectedSource = new SRCHView();
    this.SelectedSourceID = 0;
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
    this.SourceCreationFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      // Type: ['', Validators.required],
      AdapterID: ['', Validators.required],
      SourceItems: this.SourceItemFormArray
    });
    // this.AllTypes = ['xml', 'xlsx', 'csv'];
    this.AllTrainingIDs = ['1234', '1345', '14567', '345', '567'];
    this.GetAllAdapterItemRule();
    this.GetAllSource();
  }


  ResetForm(): void {
    this.SourceCreationFormGroup.reset();
    Object.keys(this.SourceCreationFormGroup.controls).forEach(key => {
      this.SourceCreationFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetSourceItems();
    this.ResetForm();
    this.SelectedSourceID = 0;
    this.SelectedSource = new SRCHView();
    this.SelectedSource.SRCIList = [];
    this.SourceItemList = [];
  }

  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  ResetSourceItems(): void {
    this.ClearFormArray(this.SourceItemFormArray);
    this.SourceItemDataSource.next(this.SourceItemFormArray.controls);
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

  GetAllSource(): void {
    this._SourceService.GetAllSource().subscribe(
      (data) => {
        this.AllSources = data as SRCH[];
        if (this.AllSources.length && this.AllSources.length > 0) {
          this.LoadSelectedSRCH(this.AllSources[0]);
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
  //     this.ResetSourceItems();
  //     if (this.SelectedSource && this.SelectedSource.SourceID &&
  //       this.SelectedSource.Type === selectedType &&
  //       this.SourceItemList && this.SourceItemList.length) {
  //       this.SourceItemList.forEach(x => {
  //         this.SetItemValues(x);
  //       });
  //     } else {
  //       const filteredSourceTypes = this.AllSourceTypes.filter(x => x.Type === selectedType);
  //       filteredSourceTypes.forEach(itr => {
  //         const x = new SourceI();
  //         x.Key = itr.Key;
  //         x.IsRemovable = false;
  //         this.SetItemValues(x);
  //       });
  //     }
  //   }
  // }

  LoadSelectedSRCH(Source: SRCH): void {
    this.SelectedSourceID = Source.srcID;
    this.SelectedSource = new SRCHView();
    this.SelectedSource.srcID = Source.srcID;
    // this.SelectedSource.Type = Source.Type;
    this.SourceCreationFormGroup.get('Title').patchValue(Source.Title);
    // this.SourceCreationFormGroup.get('Type').patchValue(Source.Type);
    this.SourceCreationFormGroup.get('AdapterID').patchValue(Source.AdapterID);
    this.ResetSourceItems();
    this.GetAllSourceItemsBySourceID();
  }

  GetAllSourceItemsBySourceID(): void {
    this._SourceService.GetAllSourceItemsBySourceID(this.SelectedSource.srcID).subscribe(
      (data) => {
        this.SourceItemList = data as SRCI[];
        this.SourceItemList.forEach(x => {
          this.SetItemValues(x);
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  SetItemValues(adpterItem: SRCI): void {
    const row = this._formBuilder.group({
      Field1: [adpterItem.Field1, Validators.required],
      Field2: [adpterItem.Field1, Validators.required],
      // Rule: [RuleValue, Validators.required],
      FileExt: [adpterItem.FileExt],
      TrainingID: [adpterItem.TrainingID, Validators.required],
    });
    this.SourceItemFormArray.push(row);
    this.SourceItemDataSource.next(this.SourceItemFormArray.controls);
  }

  AddSourceItem(): void {
    this.AddSourceItemFormGroup();
  }

  RemoveSourceItem(index: number): void {
    if (this.SourceCreationFormGroup.enabled) {
      if (this.SourceItemFormArray.length > 0) {
        this.SourceItemFormArray.removeAt(index);
        this.SourceItemDataSource.next(this.SourceItemFormArray.controls);
      } else {
        this.notificationSnackBarComponent.openSnackBar('no items to delete', SnackBarStatus.warning);
      }
    }
  }

  AddSourceItemFormGroup(): void {
    const row = this._formBuilder.group({
      Field1: ['', Validators.required],
      Field2: ['', Validators.required],
      FileExt: [''],
      TrainingID: ['', Validators.required],
    });
    this.SourceItemFormArray.push(row);
    // this.SourceItemFormArray.insert(0, row);
    this.SourceItemDataSource.next(this.SourceItemFormArray.controls);
  }

  SubmitClicked(): void {
    if (this.SourceCreationFormGroup.valid) {
      const SourceItemsArry = this.SourceCreationFormGroup.get('SourceItems') as FormArray;
      if (SourceItemsArry.length <= 0) {
        this.notificationSnackBarComponent.openSnackBar('Please add values', SnackBarStatus.danger);
      } else {
        this.GetHeaderValues();
        this.GetItemValues();
        this.CheckForDuplicateField1();
      }
    } else {
      this.ShowValidationErrors(this.SourceCreationFormGroup);
    }
  }

  CheckForDuplicateField1(): void {
    // const valueArr = this.SelectedSource.SRCIList.map(x => x.Field1);
    // const isDuplicate = valueArr.some(function (item, idx): boolean {
    //   return valueArr.indexOf(item) !== idx;
    // });
    // return isDuplicate;

    const uniq = this.SelectedSource.SRCIList
      .map((x) => {
        return {
          count: 1,
          Field1: x.Field1
        };
      })
      .reduce((a, b) => {
        a[b.Field1] = (a[b.Field1] || 0) + b.count;
        return a;
      }, {});

    const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    if (duplicates && duplicates.length && duplicates.length > 0) {
      const duplicateField1s = duplicates.join();
      this.notificationSnackBarComponent.openSnackBar(`Please remove duplicate Param ID(s) : ${duplicateField1s}`, SnackBarStatus.danger);
    } else {
      if (this.SelectedSource.srcID) {
        const Actiontype = 'Update';
        const Catagory = 'Source';
        this.OpenConfirmationDialog(Actiontype, Catagory);
      } else {
        const Actiontype = 'Create';
        const Catagory = 'Source';
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
            this.CreateSource();
          }
          else if (Actiontype === 'Update') {
            this.UpdateSource();
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

  CreateSource(): void {
    this.IsProgressBarVisibile = true;
    this._SourceService.CreateSource(this.SelectedSource).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Source details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllSource();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  UpdateSource(): void {
    this.IsProgressBarVisibile = true;
    this._SourceService.UpdateSource(this.SelectedSource).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('Source details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllSource();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  // CreateSourceParaMapping(): void {
  //   this.GetParameterValues();
  //   this.IsProgressBarVisibile = true;
  //   this._SourceService.CreateSourceParaMapping(this.TemplateParaMappingList).subscribe(
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
    // this.SelectedSource = new SRCHView();
    this.SelectedSource.Title = this.SourceCreationFormGroup.get('Title').value;
    // this.SelectedSource.Type = this.SourceCreationFormGroup.get('Type').value;
    this.SelectedSource.AdapterID = this.SourceCreationFormGroup.get('AdapterID').value;
  }

  GetItemValues(): void {
    this.SourceItemList = [];
    this.SelectedSource.SRCIList = [];
    const SourceItemsArr = this.SourceCreationFormGroup.get('SourceItems') as FormArray;
    SourceItemsArr.controls.forEach((x, i) => {
      const SourceItem: SRCI = new SRCI();
      SourceItem.srcID = this.SelectedSource.srcID;
      SourceItem.Field1 = x.get('Field1').value;
      SourceItem.Field2 = x.get('Field2').value;
      SourceItem.FileExt = x.get('FileExt').value;
      SourceItem.TrainingID = x.get('TrainingID').value;
      this.SelectedSource.SRCIList.push(SourceItem);
    });
  }
}

