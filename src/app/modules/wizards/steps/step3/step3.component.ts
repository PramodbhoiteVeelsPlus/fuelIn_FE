import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { Modal2Component } from 'src/app/_metronic/partials/layout/modals/modal2/modal2.component';
import { ModalConfig } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @Input() defaultValues: Partial<ICreateAccount>;

  private unsubscribe: Subscription[] = [];

  @ViewChild('modal') private modal2Component: Modal2Component;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      businessName: [this.defaultValues.businessName, [Validators.required]],
      businessDescriptor: [
        this.defaultValues.businessDescriptor,
        [Validators.required],
      ],
      businessType: [this.defaultValues.businessType, [Validators.required]],
      businessDescription: [this.defaultValues.businessDescription],
      businessEmail: [
        this.defaultValues.businessEmail,
        [Validators.required, Validators.email],
      ],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('businessName')?.hasError('required') ||
      this.form.get('businessDescriptor')?.hasError('required') ||
      this.form.get('businessType')?.hasError('required') ||
      this.form.get('businessEmail')?.hasError('required') ||
      this.form.get('businessEmail')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  async openModal() {
    return await this.modal2Component.open();
  }
}
