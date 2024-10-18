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
  isAdmin: boolean = true;
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }
  
  // logout() {
  //   localStorage.setItem('isLoggedin', 'false');
  //   localStorage.removeItem('element');
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('userdata');
  //   this.router.navigate(['/auth/login'])
  // }

}
