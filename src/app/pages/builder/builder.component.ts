import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
})
export class BuilderComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  accessGroupId: any;
  constructor() { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.accessGroupId = element.accessGroupId;
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
