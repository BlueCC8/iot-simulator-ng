import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormService } from '../form.service';

@Component({
  selector: 'app-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.css'],
  providers: [FormService]
})
export class DoneComponent {
  isLinear = false;
  myForm: Array<string>;

  constructor(public formService: FormService, private fb: FormBuilder) {
    this.myForm = this.formService.mainForm.value;
  }

  keys(): Array<string> {
    return Object.keys(this.myForm);
  }
}
