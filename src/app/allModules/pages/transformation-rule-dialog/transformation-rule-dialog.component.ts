import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChangePasswordDialogComponent } from 'app/allModules/authentication/change-password-dialog/change-password-dialog.component';
import { CustomValidator } from 'app/shared/custom-validator';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { TransformationAdapterView } from 'app/models/icon.models';
import { TransformService } from 'app/services/Transform.service';

@Component({
  selector: 'app-transformation-rule-dialog',
  templateUrl: './transformation-rule-dialog.component.html',
  styleUrls: ['./transformation-rule-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TransformationRuleDialogComponent implements OnInit {
  notificationSnackBarComponent: NotificationSnackBarComponent;
  AllTransformationAdapterView: TransformationAdapterView[] = [];
  SelectedTransformationID = 0;
  constructor(
    public matDialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public SelectedTransformationAdapterView: TransformationAdapterView,
    public snackBar: MatSnackBar,
    private _TransformationdefinationService: TransformService
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    this.GetAllTransformationAdapterView();
  }

  GetAllTransformationAdapterView(): void {
    this._TransformationdefinationService.GetAllTransformationAdapterView().subscribe(
      (data) => {
        this.AllTransformationAdapterView = data as TransformationAdapterView[];
        if (this.AllTransformationAdapterView && this.AllTransformationAdapterView.length
          && this.SelectedTransformationAdapterView && this.SelectedTransformationAdapterView.trfID) {
          const r = this.AllTransformationAdapterView.filter(x => x.trfID === this.SelectedTransformationAdapterView.trfID)[0];
          if (r) {
            this.SelectedTransformationAdapterView.AdapterID = r.AdapterID;
          }
          this.onChangeChk(this.SelectedTransformationAdapterView);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onChangeChk(data: TransformationAdapterView): void {
    this.SelectedTransformationAdapterView = data;
    this.SelectedTransformationID = data.trfID;
    // const SelectedItem = this.RFQ.RFQResponseItems.filter(x => x.ItemID === data.ItemID)[0];
    // if (SelectedItem) {
    //   if ($event.checked) {
    //     SelectedItem.IsResponded = true;
    //   } else {
    //     SelectedItem.IsResponded = false;
    //   }
    // }
  }

  YesClicked(): void {
    if (this.SelectedTransformationAdapterView) {
      this.matDialogRef.close(this.SelectedTransformationAdapterView);
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select Transformation', SnackBarStatus.danger);
    }
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
}
