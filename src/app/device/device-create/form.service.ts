import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FormService {
  private stepOneSource: Subject<FormGroup> = new Subject();
  stepOne: Observable<FormGroup> = this.stepOneSource.asObservable();

  private stepTwoSource: Subject<FormGroup> = new Subject();
  stepTwo: Observable<FormGroup> = this.stepTwoSource.asObservable();
  // TODO: Implement the new steps
  mainForm: FormGroup = this.formBuilder.group({
    firstName: '',
    lastName: '',
    extraName: '',
    address: ''
  });

  constructor(private formBuilder: FormBuilder) {
    this.stepOne.subscribe(form =>
      form.valueChanges.subscribe(val => {
        // devName: this.device.devName,
        // tranLayer: this.device.tranLayer,
        // devPrice: this.device.devPrice,
        // devImgUrl: this.device.devImgUrl
        this.mainForm.value.firstName = val.firstName;
        this.mainForm.value.lastName = val.lastName;
        this.mainForm.value.extraName = val.extraName;
      })
    );
    this.stepTwo.subscribe(form =>
      form.valueChanges.subscribe(val => {
        // console.log(val)
        this.mainForm.value.address = val.address;
      })
    );
  }

  stepReady(form: FormGroup, part) {
    switch (part) {
      case 'one':
        {
          this.stepOneSource.next(form);
        }
        break;
      case 'two':
        {
          this.stepTwoSource.next(form);
        }
        break;
      case 'three': {
        this.stepTwoSource.next(form);
      }
    }
  }
  stepReadyForms(forms: FormGroup[], part) {
    switch (part) {
      case 'one':
        {
          forms.forEach(form => {
            this.stepOneSource.next(form);
          });
        }
        break;
      case 'two': {
        forms.forEach(form => {
          this.stepTwoSource.next(form);
        });
      }
    }
  }
}
