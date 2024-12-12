import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-customerDetails',
  templateUrl: './customerDetails.component.html',
})
export class CustomerDetailsComponent {
    isDealer: boolean = false;
    isTransporter: boolean = false;
    isAdmin: boolean = true;

    modalConfig: ModalConfig = {
        modalTitle: 'Modal title',
        dismissButtonLabel: 'Submit',
        closeButtonLabel: 'Cancel'
      };
      @ViewChild('modal') private modalComponent: ModalComponent;
      constructor(private router: Router,) { }
    
      async openModal() {
        return await this.modalComponent.open();
      }
    
      ngOnInit() {
        if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
          var element = JSON.parse(localStorage.getItem("element") || '{}');
          if (element.accessGroupId == '7') {
            this.isAdmin = true;
            this.isDealer = false;
            this.isTransporter = false;
          }else if (element.accessGroupId == '2') {
            this.isTransporter = true;
            this.isAdmin = false;
            this.isDealer = false;
          }else if (element.accessGroupId == '12' || element.accessGroupId == '14' || element.accessGroupId == '19') {
            this.isDealer = true;
            this.isAdmin = false;
            this.isTransporter = false;
          }else{
            this.isAdmin = false;
            this.isDealer = false;
            this.isTransporter = false;
            this.router.navigate(['/auth/login']);
          }
        } else {
          this.router.navigate(['/auth/login'])
        }
      }
    
}
