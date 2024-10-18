import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  constructor(private authService: AuthService, private router: Router,) {
    // this.authService.logout();
  }

  ngOnInit(): void {
    
  }

  login(){
    this.router.navigate(['/auth/login'])
  }

}
