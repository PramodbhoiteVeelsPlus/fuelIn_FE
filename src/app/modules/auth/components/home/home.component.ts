import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  sendMessageForm = new FormGroup({
    personName: new FormControl('', Validators.required),
    personEmail: new FormControl('', [Validators.email, Validators.required]),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  })

  constructor(
    private post: AuthService,) {
    this.loadScript('../../assets/vendor/aos/aos.js');
    this.loadScript('../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js');
    this.loadScript('../../assets/vendor/glightbox/js/glightbox.min.js');
    this.loadScript('../../assets/vendor/isotope-layout/isotope.pkgd.min.js');
    this.loadScript('../../assets/vendor/php-email-form/validate.js');
    this.loadScript('../../assets/vendor/swiper/swiper-bundle.min.js');
    this.loadScript('../../assets/js/main.js');
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  sendMessage() {
    if (this.sendMessageForm.value.personName) {
      if (this.sendMessageForm.value.personEmail) {
        if (this.sendMessageForm.value.subject) {
          if (this.sendMessageForm.value.message) {
            let data = {
              personName: this.sendMessageForm.value.personName,
              personEmail: this.sendMessageForm.value.personEmail,
              personSubject: this.sendMessageForm.value.subject,
              personMessage: this.sendMessageForm.value.message,
            }
            this.post.contactUsSendMessagePOST(data)
              .subscribe(res => {
                if (res.status = "OK") {
                  this.clearSendMessageForm()
                  alert("Your message has been sent. Thank you!")
                  //    console.log("Res", res.data)
                } else {
                  // alert("error to sent message")
                }
              });

          } else {
            alert("Please enter message")
          }
        } else {
          alert("Please enter subject")
        }
      } else {
        alert("Please enter your email")
      }
    } else {
      alert("Please enter your name")
    }

  }

  
  clearSendMessageForm() {
    this.sendMessageForm.reset();
}
}
