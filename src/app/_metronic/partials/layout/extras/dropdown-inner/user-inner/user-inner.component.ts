import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { Router } from '@angular/router';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  user: boolean = true;
  private unsubscribe: Subscription[] = [];
  veelsplusCorporate: any;
  customerId: any;

  constructor(
    private auth: AuthService,
    private post: StatsService,
    private translationService: TranslationService,private router: Router,
  ) {}

  ngOnInit(): void {
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsplusCorporate = element.veelsPlusCorporateID;
    this.getCorporateById(this.veelsplusCorporate)
  }

  logout() {
    // this.auth.logout();
    // document.location.reload();
    localStorage.setItem('isLoggedin', 'false');
    localStorage.removeItem('element');
    localStorage.removeItem('username');
    localStorage.removeItem('userdata');
    this.router.navigate(['/auth/login'])
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }
  
  getCorporateById(veelsplusCorporate: any) {
    let data = {
        veelsplusCorporateId: veelsplusCorporate,
    };

    this.post.getBranchVeelsplusId(data).subscribe((res) => {
        if (res.status == "OK") {
            this.customerId = res.data[0].customerId;
        } else {
          alert("Seesion TimeOut Please Login Again..!")
          this.router.navigate(['/auth/login'])
        }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
