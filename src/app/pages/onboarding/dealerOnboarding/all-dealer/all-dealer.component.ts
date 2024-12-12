import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-dealer',
  templateUrl: './all-dealer.component.html',
  styleUrl: './all-dealer.component.scss'
})
export class AllDealerComponent {
  isAdmin: boolean = false;
  isDealer: boolean = false;
  isTransporter: boolean = false;
  constructor(private router: Router,
    public cd: ChangeDetectorRef,) { }


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
    this.cd.detectChanges();
  }
}
