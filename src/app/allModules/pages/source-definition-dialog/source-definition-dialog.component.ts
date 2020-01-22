import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChangePasswordDialogComponent } from 'app/allModules/authentication/change-password-dialog/change-password-dialog.component';
import { CustomValidator } from 'app/shared/custom-validator';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { SourceAdapterView } from 'app/models/SRC_H';
import { SourcedefinationService } from 'app/services/sourcedefination.service';

@Component({
  selector: 'app-source-definition-dialog',
  templateUrl: './source-definition-dialog.component.html',
  styleUrls: ['./source-definition-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SourceDefinitionDialogComponent implements OnInit {
  notificationSnackBarComponent: NotificationSnackBarComponent;
  AllSourceAdapterView: SourceAdapterView[] = [];
  SelectedSourceID = 0;
  constructor(
    public matDialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public SelectedSourceAdapterView: SourceAdapterView,
    public snackBar: MatSnackBar,
    private _sourcedefinationService: SourcedefinationService
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }

  ngOnInit(): void {
    this.GetAllSourceAdapterView();
  }

  GetAllSourceAdapterView(): void {
    this._sourcedefinationService.GetAllSourceAdapterView().subscribe(
      (data) => {
        this.AllSourceAdapterView = data as SourceAdapterView[];
        if (this.AllSourceAdapterView && this.AllSourceAdapterView.length && this.SelectedSourceAdapterView && this.SelectedSourceAdapterView.srcID) {
          const r = this.AllSourceAdapterView.filter(x => x.srcID === this.SelectedSourceAdapterView.srcID)[0];
          if (r) {
            this.SelectedSourceAdapterView.AdapterID = r.AdapterID;
          }
          this.onChangeChk(this.SelectedSourceAdapterView);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onChangeChk(data: SourceAdapterView): void {
    this.SelectedSourceAdapterView = data;
    this.SelectedSourceID = data.srcID;
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
    if (this.SelectedSourceAdapterView) {
      this.matDialogRef.close(this.SelectedSourceAdapterView);
    } else {
      this.notificationSnackBarComponent.openSnackBar('Please select source', SnackBarStatus.danger);
    }
  }
  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
}



