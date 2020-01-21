import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogConfig, MatIconRegistry } from '@angular/material';
import { BOTHView, BOTH } from 'app/models/icon.models';
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

@Component({
  selector: 'app-boatassemply',
  templateUrl: './boatassemply.component.html',
  styleUrls: ['./boatassemply.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
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
  AllBOTs: BOTH[] = [];
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
    this.ResetBOTItems();
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
  ResetBOTItems(): void {
    this.ClearFormArray(this.BOTItemFormArray);
    this.BOTItemDataSource.next(this.BOTItemFormArray.controls);
  }

  GetAllBOTHeaders(): void {
    this._BOTService.GetAllBOTHeaders().subscribe(
      (data) => {
        this.AllBOTs = data as BOTH[];
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
    this.ResetBOTItems();
    this.GetBOTByBOTID();
  }

  GetBOTByBOTID(): void {
    this._BOTService.GetBOTByBOTID(this.SelectedBOTID).subscribe(
      (data) => {
        this.SelectedBOT = data as BOTH;
      },
      (err) => {
        console.error(err);
      }
    );
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

  GetHeaderValues(): void {
    // this.SelectedBOT = new BOTHView();
    // this.SelectedBOT.Type = this.BOTCreationFormGroup.get('Type').value;
  }


}
