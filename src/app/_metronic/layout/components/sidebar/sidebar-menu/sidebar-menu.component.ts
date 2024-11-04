import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = false;
  veelsplusCorporate: any;
  constructor(private router: Router,) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
      // this.getCorporateById(this.veelsplusCorporate)
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      }else if (element.accessGroupId == '2') {
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
      }else if (element.accessGroupId == '12' || element.accessGroupId == '14') {
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
  
  // logout() {
  //   localStorage.setItem('isLoggedin', 'false');
  //   localStorage.removeItem('element');
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('userdata');
  //   this.router.navigate(['/auth/login'])
  // }

}
