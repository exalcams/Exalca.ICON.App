import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChangePasswordDialogComponent } from 'app/allModules/authentication/change-password-dialog/change-password-dialog.component';
import { CustomValidator } from 'app/shared/custom-validator';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { BOTH } from 'app/models/icon.models';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ScheduleDialogComponent implements OnInit {
  scheduleForm: FormGroup;
  // both: BOTH;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  FrequencyList: string[] = [];
  DayList: string[] = [];
  DateList: string[] = [];
  constructor(
    public matDialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public both: BOTH,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private _datePipe: DatePipe,
  ) {
    this.scheduleForm = this._formBuilder.group({
      Freq: ['', Validators.required],
      Interval1: [''],
      Interval2: [''],
      DatePart1: [''],
      DatePart2: [''],
      StartDate: ['', Validators.required],
      InstancesCount: ['', Validators.required],
      UntilWhen: ['', Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.FrequencyList = ['Repeat', 'Daily', 'Weekly', 'Monthly'];
    this.DayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.DateList = [];
    for (let i = 1; i < 31; i++) {
      this.DateList.push(i.toString());
    }
  }

  FrequencySelected(event): void {
    this.AddValidatorByFrequecy(event.value);
  }

  AddValidatorByFrequecy(value: string): void {
    if (value === 'Repeat') {
      this.SetInterval1Validator();
      this.ClearInterval2Validator();
      this.ClearDatePart1Validator();
      this.ClearDatePart2Validator();
    }
    if (value === 'Daily') {
      this.SetInterval2Validator();
      this.ClearInterval1Validator();
      this.ClearDatePart1Validator();
      this.ClearDatePart2Validator();
    }
    if (value === 'Weekly') {
      this.SetInterval2Validator();
      this.ClearInterval1Validator();
      this.SetDatePart1Validator();
      this.ClearDatePart2Validator();
    }
    if (value === 'Monthly') {
      this.SetInterval2Validator();
      this.ClearInterval1Validator();
      this.ClearDatePart1Validator();
      this.SetDatePart2Validator();
    }
  }

  SetInterval1Validator(): void {
    this.scheduleForm.get('Interval1').setValidators([Validators.required, Validators.pattern('[1-9][0-9]*')]);
    this.scheduleForm.get('Interval1').updateValueAndValidity();
  }
  SetInterval2Validator(): void {
    this.scheduleForm.get('Interval2').setValidators(Validators.required);
    this.scheduleForm.get('Interval2').updateValueAndValidity();
  }
  SetDatePart1Validator(): void {
    this.scheduleForm.get('DatePart1').setValidators(Validators.required);
    this.scheduleForm.get('DatePart1').updateValueAndValidity();
  }

  SetDatePart2Validator(): void {
    this.scheduleForm.get('DatePart2').setValidators(Validators.required);
    this.scheduleForm.get('DatePart2').updateValueAndValidity();
  }

  ClearInterval1Validator(): void {
    this.scheduleForm.get('Interval1').clearValidators();
    this.scheduleForm.get('Interval1').updateValueAndValidity();
  }
  ClearInterval2Validator(): void {
    this.scheduleForm.get('Interval2').clearValidators();
    this.scheduleForm.get('Interval2').updateValueAndValidity();
  }
  ClearDatePart1Validator(): void {
    this.scheduleForm.get('DatePart1').clearValidators();
    this.scheduleForm.get('DatePart1').updateValueAndValidity();
  }

  ClearDatePart2Validator(): void {
    this.scheduleForm.get('DatePart2').clearValidators();
    this.scheduleForm.get('DatePart2').updateValueAndValidity();
  }

  ngOnInit(): void {
    if (this.both) {
      this.AddValidatorByFrequecy(this.both.Freq);
      this.scheduleForm.patchValue({
        Freq: this.both.Freq,
        StartDate: this.both.StartDate,
        InstancesCount: this.both.InstancesCount,
        UntilWhen: this.both.UntilWhen
      });
      this.SetValueBasedOnFrequency();
    } else {
      this.both = new BOTH();
    }
  }

  YesClicked(): void {
    if (this.scheduleForm.valid) {
      this.both.Freq = this.scheduleForm.get('Freq').value;
      this.GetValuesBasedOnFrequency();
      this.both.StartDate = this.scheduleForm.get('StartDate').value;
      this.both.InstancesCount = this.scheduleForm.get('InstancesCount').value;
      this.both.UntilWhen = this.scheduleForm.get('UntilWhen').value;
      this.matDialogRef.close(this.both);
    } else {
      Object.keys(this.scheduleForm.controls).forEach(key => {
        this.scheduleForm.get(key).markAsTouched();
        this.scheduleForm.get(key).markAsDirty();
      });

    }
  }

  SetValueBasedOnFrequency(): void {
    const value = this.both.Freq;
    if (value === 'Repeat') {
      this.scheduleForm.get('Interval1').patchValue(this.both.Interval);
    }
    if (value === 'Daily') {
      this.scheduleForm.get('Interval2').patchValue(this.both.Interval);
    }
    if (value === 'Weekly') {
      this.scheduleForm.get('Interval2').patchValue(this.both.Interval);
      this.scheduleForm.get('DatePart1').patchValue(this.both.DatePart);
    }
    if (value === 'Monthly') {
      this.scheduleForm.get('Interval2').patchValue(this.both.Interval);
      this.scheduleForm.get('DatePart2').patchValue(this.both.DatePart);
    }
  }

  GetValuesBasedOnFrequency(): void {
    const value = this.both.Freq;
    if (value === 'Repeat') {
      this.both.Interval = this.scheduleForm.get('Interval1').value;
    }
    if (value === 'Daily') {
      this.both.Interval = this.scheduleForm.get('Interval2').value;
    }
    if (value === 'Weekly') {
      this.both.Interval = this.scheduleForm.get('Interval2').value;
      this.both.DatePart = this.scheduleForm.get('DatePart1').value;
    }
    if (value === 'Monthly') {
      this.both.Interval = this.scheduleForm.get('Interval2').value;
      // const DatePart2Value = this.scheduleForm.get('DatePart2').value;
      // const DatePart2ValueStr = this._datePipe.transform(DatePart2Value, 'yyyy-MM-dd');
      this.both.DatePart = this.scheduleForm.get('DatePart2').value;
    }
  }

  CloseClicked(): void {
    // console.log('Called');
    this.matDialogRef.close(null);
  }

}
