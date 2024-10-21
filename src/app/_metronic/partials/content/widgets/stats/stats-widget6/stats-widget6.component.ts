import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../stats.services';

@Component({
  selector: 'app-stats-widget6',
  templateUrl: './stats-widget6.component.html',
})
export class StatsWidget6Component {

  acceesGroup: any;
  gstDetails: any;

  gstForm = new FormGroup({
    gst: new FormControl('', Validators.required),
    gstInfo: new FormControl('', Validators.required),
    gstDetailsId: new FormControl('', Validators.required),
  });

  isUpdate: boolean = false;

  constructor(
    private post: StatsService, private spinner: NgxSpinnerService, private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.acceesGroup = element.accessGroupId;
    this.gstForm.controls["gstInfo"].setValue('');
    this.getGSTDetails();
  }

  getGSTDetails() {
    let data = {
    }
    this.post.getGSTDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.gstDetails = res.data;
            this.cd.detectChanges();
          } else {
            this.gstDetails = [];
            this.cd.detectChanges();
          }
        }
        else {
        }
      })
  }

  getGSTDetailsById(gstDetailsId: any) {
    let data = {
      gstDetailsId: gstDetailsId,
    }
    this.post.getGSTDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data1.length) {
            this.isUpdate = true
            this.gstForm.controls["gstDetailsId"].setValue(gstDetailsId);
            this.gstForm.controls["gst"].setValue(res.data1[0].gst);
            if (res.data1[0].gstDetailsInfo) {
              if (res.data1[0].gstDetailsInfo != 'undefined' || res.data1[0].gstDetailsInfo != 'null') {
                this.gstForm.controls["gstInfo"].setValue(res.data1[0].gstDetailsInfo);
              } else {
                this.gstForm.controls["gstInfo"].setValue('');
              }
            } else {
              this.gstForm.controls["gstInfo"].setValue('');
            }
            this.cd.detectChanges();
          } else {
            this.isUpdate = false
            this.gstForm.controls["gstDetailsId"].setValue('');
            this.gstForm.controls["gst"].setValue('');
            this.gstForm.controls["gstInfo"].setValue('');
            this.cd.detectChanges();
          }
        } else {
          this.isUpdate = false
          this.gstForm.controls["gstDetailsId"].setValue('');
          this.gstForm.controls["gst"].setValue('');
          this.gstForm.controls["gstInfo"].setValue('');
          this.cd.detectChanges();
        }
      })
  }

  addGSTDetails() {
    if (this.gstForm.value.gst) {
      let data = {
        gstDetails: this.gstForm.value.gstInfo,
        gst: this.gstForm.value.gst,
      }
      this.post.addGSTDataPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("GST Added successfully..")
            this.gstForm.reset();
            this.getGSTDetails();
          }
          else {
            alert("Error to add GST..")
          }
        })
    } else {
      alert("please enter GST %")
    }
  }

  updateGSTDetails() {
    let data = {
      gstDetailsId: this.gstForm.value.gstDetailsId,
      gstDetails: this.gstForm.value.gstInfo,
      gst: this.gstForm.value.gst,
    }
    this.post.updateGSTDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("GST updated successfully..")
          this.getGSTDetails();
          this.gstForm.reset();
          this.isUpdate = false
        }
        else {
          alert("Error to update GST..")
        }
      })
  }

  deleteGSTDetails(gstDetailsId: any) {
    this.spinner.show()
    let data = {
      gstDetailsId: gstDetailsId,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteGSTDataPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("GST deleted successfully..")
            this.getGSTDetails();
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    }
    else {
      this.spinner.hide()
    }
  }

  clearGSTDetails() {
    this.gstForm.reset();
    this.isUpdate = false
    this.cd.detectChanges();
  }



}
