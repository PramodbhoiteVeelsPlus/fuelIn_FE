import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(private authService: AuthService, private router: Router,) {
    // this.authService.logout();
  }

  ngOnInit(): void {
    
  }

  login(){
    this.router.navigate(['/auth/login'])
  }

}
