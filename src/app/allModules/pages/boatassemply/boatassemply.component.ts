import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogConfig, MatIconRegistry } from '@angular/material';
import { BOTHView, BOTH, TransformationAdapterView } from 'app/models/icon.models';
import { AuthenticationDetails } from 'app/models/master';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormArray, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { Router } from '@angular/router';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { BotService } from 'app/services/BOT.service';
import { fuseAnimations } from '@fuse/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterService } from 'app/services/master.service';
import { DatePipe } from '@angular/common';
import { SourceDefinitionDialogComponent } from '../source-definition-dialog/source-definition-dialog.component';
import { TransformationRuleDialogComponent } from '../transformation-rule-dialog/transformation-rule-dialog.component';
import { SourceAdapterView } from 'app/models/SRC_H';
import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';

@Component({
  selector: 'app-boatassemply',
  templateUrl: './boatassemply.component.html',
  styleUrls: ['./boatassemply.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  // animations: fuseAnimations
})
export class BoatassemplyComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  CurrentUserName: string;
  CurrentUserID: Guid;
  CurrentUserRole = '';
  CurrentDate: Date;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  BOTCreationFormGroup: FormGroup;
  BOTItemColumns: string[] = ['Key', 'Value', 'Action'];
  BOTItemFormArray: FormArray = this._formBuilder.array([]);
  BOTItemDataSource = new BehaviorSubject<AbstractControl[]>([]);
  SelectedBOTView: BOTHView;
  SelectedBOT: BOTH;
  SelectedBOTID: number;
  AllTypes: string[];
  AllBOTs: BOTHView[] = [];
  searchText = '';
  constructor(
    private _router: Router,
    matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _BOTService: BotService,
    private dialog: MatDialog,
    private _datePipe: DatePipe
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
    this.SelectedBOT = new BOTH();
    this.SelectedBOTView = new BOTHView();
    this.SelectedBOTID = 0;
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
    this.BOTCreationFormGroup = this._formBuilder.group({
      Title: ['', Validators.required],
      Status: [''],
      srcID: ['', Validators.required],
      trfID: ['', Validators.required],
      Comments: [''],
      Freq: ['', Validators.required],
      Interval: ['', Validators.required],
      DatePart: [''],
      StartDate: ['', Validators.required],
      InstancesCount: ['', Validators.required],
      UntilWhen: ['', Validators.required],
    });
    // this.AllTypes = ['Email', 'FTP'];
    this.GetAllBOTHeaders();
  }


  ResetForm(): void {
    this.BOTCreationFormGroup.reset();
    Object.keys(this.BOTCreationFormGroup.controls).forEach(key => {
      this.BOTCreationFormGroup.get(key).markAsUntouched();
    });
  }
  ResetControl(): void {
    this.ResetForm();
    this.SelectedBOTID = 0;
    this.SelectedBOTView = new BOTHView();
    this.SelectedBOT = new BOTH();
  }

  ClearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  GetAllBOTHeaders(): void {
    this._BOTService.GetAllBOTHeaders().subscribe(
      (data) => {
        this.AllBOTs = data as BOTHView[];
        if (this.AllBOTs.length && this.AllBOTs.length > 0) {
          this.LoadSelectedBOTH(this.AllBOTs[0]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  LoadSelectedBOTH(BOT: BOTHView): void {
    this.SelectedBOTID = BOT.botID;
    this.SelectedBOTView = BOT;
    this.GetBOTByBOTID();
  }

  GetBOTByBOTID(): void {
    this._BOTService.GetBOTByBOTID(this.SelectedBOTID).subscribe(
      (data) => {
        this.SelectedBOT = data as BOTH;
        this.InsertBotDetails();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  InsertBotDetails(): void {
    this.BOTCreationFormGroup.patchValue({
      Title: this.SelectedBOT.Title,
      Status: this.SelectedBOT.Status,
      srcID: this.SelectedBOT.srcID,
      trfID: this.SelectedBOT.trfID,
      Comments: this.SelectedBOT.Comments,
      Freq: this.SelectedBOT.Freq,
      Interval: this.SelectedBOT.Interval,
      DatePart: this.SelectedBOT.DatePart,
      StartDate: this.SelectedBOT.StartDate,
      InstancesCount: this.SelectedBOT.InstancesCount,
      UntilWhen: this.SelectedBOT.UntilWhen,
    });
  }

  GetBotDetails(): void {
    this.SelectedBOT.Title = this.BOTCreationFormGroup.get('Title').value;
    this.SelectedBOT.Status = this.BOTCreationFormGroup.get('Status').value;
    this.SelectedBOT.srcID = this.BOTCreationFormGroup.get('srcID').value;
    this.SelectedBOT.trfID = this.BOTCreationFormGroup.get('trfID').value;
    this.SelectedBOT.Comments = this.BOTCreationFormGroup.get('Comments').value;
    this.SelectedBOT.Freq = this.BOTCreationFormGroup.get('Freq').value;
    this.SelectedBOT.DatePart = this.BOTCreationFormGroup.get('DatePart').value;
    this.SelectedBOT.StartDate = this.BOTCreationFormGroup.get('StartDate').value;
    this.SelectedBOT.InstancesCount = this.BOTCreationFormGroup.get('InstancesCount').value;
    this.SelectedBOT.UntilWhen = this.BOTCreationFormGroup.get('UntilWhen').value;
  }

  OpenSourceDefinitionDialog(): void {
    const data: SourceAdapterView = new SourceAdapterView();
    if (this.SelectedBOTID && this.SelectedBOTView) {
      data.srcID = this.SelectedBOTView.srcID;
      data.title = this.SelectedBOTView.srcTitle;
    }
    const dialogConfig: MatDialogConfig = {
      panelClass: 'source-definition-dialog',
      data: data
    };
    const dialogRef = this.dialog.open(SourceDefinitionDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const res = result as SourceAdapterView;
          this.SelectedBOT.srcID = res.srcID;
          this.BOTCreationFormGroup.get('srcID').patchValue(res.srcID);
        }
      });
  }

  OpenTransformationRuleDialog(): void {
    const data: TransformationAdapterView = new TransformationAdapterView();
    if (this.SelectedBOTID && this.SelectedBOTView) {
      data.trfID = this.SelectedBOTView.trfID;
      data.Title = this.SelectedBOTView.trfTitle;
    }
    const dialogConfig: MatDialogConfig = {
      panelClass: 'transformation-rule-dialog',
      data: data
    };
    const dialogRef = this.dialog.open(TransformationRuleDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const res = result as TransformationAdapterView;
          this.SelectedBOT.trfID = res.trfID;
          this.BOTCreationFormGroup.get('trfID').patchValue(res.trfID);
        }
      });
  }

  TestConnection(): void {
    if (this.SelectedBOT.srcID && this.SelectedBOT.trfID) {
      this._BOTService.TestConnection(this.SelectedBOT.trfID).subscribe(
        (data) => {
          if (data) {
            console.log(data);
            if (!this.SelectedBOT.Status) {
              this.SelectedBOT.Status = 'Test';
            }
            this.notificationSnackBarComponent.openSnackBar('Test succeeded', SnackBarStatus.success);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select source & transformation rule', SnackBarStatus.danger);
    }
  }

  OpenScheduleDialog(): void {
    const data: TransformationAdapterView = new TransformationAdapterView();
    const dialogConfig: MatDialogConfig = {
      panelClass: 'schedule-dialog',
      data: this.SelectedBOT
    };
    const dialogRef = this.dialog.open(ScheduleDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const res = result as BOTH;
          console.log(res);
          if (res) {
            this.SelectedBOT = res;
            this.InsertBotDetails();
            if (this.BOTCreationFormGroup.valid) {
              if (!this.SelectedBOT.botID) {
                this.CreateBOT();
              }
              else {
                this.UpdateBOT();
              }
            } else {
              this.ShowValidationErrors(this.BOTCreationFormGroup);
            }
          }
        }
      });
  }

  SubmitClicked(): void {
    if (this.BOTCreationFormGroup.valid) {
      const BOTItemsArry = this.BOTCreationFormGroup.get('BOTItems') as FormArray;
      if (BOTItemsArry.length <= 0) {
        this.notificationSnackBarComponent.openSnackBar('Please add values', SnackBarStatus.danger);
      } else {
        if (this.SelectedBOT.botID) {
          const Actiontype = 'Update';
          const Catagory = 'Template';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        } else {
          const Actiontype = 'Create';
          const Catagory = 'Template';
          this.OpenConfirmationDialog(Actiontype, Catagory);
        }
      }
    } else {
      this.ShowValidationErrors(this.BOTCreationFormGroup);
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
            this.CreateBOT();
          }
          else if (Actiontype === 'Update') {
            this.UpdateBOT();
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

  CreateBOT(): void {
    this.IsProgressBarVisibile = true;
    this.GetHeaderValues();
    this._BOTService.CreateBOT(this.SelectedBOT).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('BOT details created successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        this.ResetControl();
        this.GetAllBOTHeaders();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  UpdateBOT(): void {
    this.IsProgressBarVisibile = true;
    this.GetHeaderValues();
    this._BOTService.UpdateBOT(this.SelectedBOT).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('BOT details updated successfully', SnackBarStatus.success);
        this.IsProgressBarVisibile = false;
        // this.ResetControl();
        // this.GetAllBOTHeaders();
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetHeaderValues(): void {
    // this.SelectedBOT = new BOTHView();
    // this.SelectedBOT.Type = this.BOTCreationFormGroup.get('Type').value;
  }

  RunClicked(): void {
    this.UpdateBOTStatus('Run');
  }

  PassClicked(): void {
    this.UpdateBOTStatus('Pass');
  }

  RetireClicked(): void {
    this.UpdateBOTStatus('Retire');
  }

  UpdateBOTStatus(Status: string): void {
    this._BOTService.UpdateBOTStatus(this.SelectedBOT.botID, Status, this.CurrentUserID).subscribe(
      (data) => {
        this.notificationSnackBarComponent.openSnackBar('BOT status updated successfully', SnackBarStatus.success);
        this.SelectedBOT.Status = Status;
        // this.ResetControl();
        // this.GetAllBOTHeaders();
      },
      (err) => {
        console.error(err);
      }
    );
  }


}
