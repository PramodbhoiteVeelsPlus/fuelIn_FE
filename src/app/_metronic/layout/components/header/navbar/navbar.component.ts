import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';

  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,) {}

  ngOnInit(): void {
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
