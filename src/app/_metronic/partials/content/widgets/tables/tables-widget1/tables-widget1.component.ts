import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';

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
  selector: 'app-tables-widget1',
  templateUrl: './tables-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget1Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  dealerLoginVPId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  productsList: any = [];
  allProductPriceList: any = [];
  isProduct2: boolean = false;
  isProduct3: boolean = false;
  isProduct6: boolean = false;
  isProduct5: boolean = false;
  isProduct4: boolean = false;
  product111: any;
  product11: any;
  product22: any;
  product33: any;
  product1Id: any;
  product2Id: any;
  product3Id: any;
  product444: any;
  product44: any;
  product55: any;
  product66: any;
  product4Id: any;
  product5Id: any;
  product6Id: any;
  todayDate = new Date();
  isNoRate: boolean = false;
  rate1Details: any = [];
  product1: any;
  product2: any;
  product1Rate1: any;
  product2Rate1: any;
  product3: any;
  product3Rate1: any;
  product4: any;
  product4Rate1: any;
  product5: any;
  product5Rate1: any;
  product6: any;
  product6Rate1: any;
  product1Rate2: any;
  product2Rate2: any;
  product3Rate2: any;
  product4Rate2: any;
  product5Rate2: any;
  product6Rate2: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  dealerCorporateId: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = dealerData.fuelDealerId;
    this.dealerCorporateId = dealerData.corporateId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    this.getProductsByDealerId(this.fuelDealerId);
    this.getFuelPriceByProductDateDealer(this.fuelDealerId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  refreshData() {
    this.getProductsByDealerId(this.fuelDealerId);
    this.getFuelPriceByProductDateDealer(this.fuelDealerId);    
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.productsList = res.data;

        if (res.data.length == 3) {
          this.isProduct3 = true;
          this.isProduct2 = true;
          this.product111 = res.data[0].productName;
          this.product11 = res.data[0].productName;
          this.product22 = res.data[1].productName;
          this.product33 = res.data[2].productName;
          this.product1Id = res.data[0].fuelProductsId;
          this.product2Id = res.data[1].fuelProductsId;
          this.product3Id = res.data[2].fuelProductsId;
        } else {
          if (res.data.length == 1) {
            this.product111 = res.data[0].productName;
            this.product11 = res.data[0].productName;
            this.product1Id = res.data[0].fuelProductsId;
          } else {
            if (res.data.length == 2) {
              this.isProduct2 = true;
              this.product111 = res.data[0].productName;
              this.product11 = res.data[0].productName;
              this.product22 = res.data[1].productName;
              this.product1Id = res.data[0].fuelProductsId;
              this.product2Id = res.data[1].fuelProductsId;
            } else {
              if (res.data.length == 6) {
                this.isProduct6 = true;
                this.isProduct5 = true;
                this.isProduct4 = true;
                this.product444 = res.data[3].productName;
                this.product44 = res.data[3].productName;
                this.product55 = res.data[4].productName;
                this.product66 = res.data[5].productName;
                this.product4Id = res.data[3].fuelProductsId;
                this.product5Id = res.data[4].fuelProductsId;
                this.product6Id = res.data[5].fuelProductsId;
                this.isProduct3 = true;
                this.isProduct2 = true;
                this.product111 = res.data[0].productName;
                this.product11 = res.data[0].productName;
                this.product22 = res.data[1].productName;
                this.product33 = res.data[2].productName;
                this.product1Id = res.data[0].fuelProductsId;
                this.product2Id = res.data[1].fuelProductsId;
                this.product3Id = res.data[2].fuelProductsId;
              } else {
                if (res.data.length == 4) {
                  this.isProduct4 = true;
                  this.product444 = res.data[3].productName;
                  this.product44 = res.data[3].productName;
                  this.product4Id =
                    res.data[3].fuelProductsId;
                  this.isProduct3 = true;
                  this.isProduct2 = true;
                  this.product111 = res.data[0].productName;
                  this.product11 = res.data[0].productName;
                  this.product22 = res.data[1].productName;
                  this.product33 = res.data[2].productName;
                  this.product1Id =
                    res.data[0].fuelProductsId;
                  this.product2Id =
                    res.data[1].fuelProductsId;
                  this.product3Id =
                    res.data[2].fuelProductsId;
                } else {
                  if (res.data.length == 5) {
                    this.isProduct5 = true;
                    this.isProduct4 = true;
                    this.product444 =
                      res.data[3].productName;
                    this.product44 =
                      res.data[3].productName;
                    this.product55 =
                      res.data[4].productName;
                    this.product4Id =
                      res.data[3].fuelProductsId;
                    this.product5Id =
                      res.data[4].fuelProductsId;
                    this.isProduct3 = true;
                    this.isProduct2 = true;
                    this.product111 =
                      res.data[0].productName;
                    this.product11 =
                      res.data[0].productName;
                    this.product22 =
                      res.data[1].productName;
                    this.product33 =
                      res.data[2].productName;
                    this.product1Id =
                      res.data[0].fuelProductsId;
                    this.product2Id =
                      res.data[1].fuelProductsId;
                    this.product3Id =
                      res.data[2].fuelProductsId;
                  }
                }
              }
            }
          }
        }

        this.allProductPriceList = res.data;
        // this.getProductDetails(res.data);
        this.cd.detectChanges()
      }
    });
  }


  getFuelPriceByProductDateDealer(fuelDealerId: any) {
    let data = {
      sellingSetBy: fuelDealerId,
      productPriceDate: moment(this.todayDate).format("YYYY-MM-DD"),
    };
    this.post.getFuelPriceByProductDateDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.isNoRate = false;
        this.rate1Details = res.data;
        if (res.data.length == 3) {
          if (
            this.product1Id == res.data[0].productId &&
            this.product2Id == res.data[1].productId
          ) {
            this.isProduct2 = true;

            this.product1 = res.data[0].productName;
            this.product2 = res.data[1].productName;
            this.product1Rate1 = res.data[0].productSellingPrice;
            this.product2Rate1 = res.data[1].productSellingPrice;
            if (this.product3Id == res.data[2].productId) {
              this.isProduct3 = true;
              this.product3 = res.data[2].productName;
              this.product3Rate1 =
                res.data[2].productSellingPrice;
            } else {
              if (this.product4Id == res.data[2].productId) {
                this.isProduct4 = true;
                this.product4 = res.data[2].productName;
                this.product4Rate1 =
                  res.data[2].productSellingPrice;
              } else {
                if (this.product5Id == res.data[2].productId) {
                  this.isProduct5 = true;
                  this.product5 = res.data[2].productName;
                  this.product5Rate1 =
                    res.data[2].productSellingPrice;
                } else {
                  if (
                    this.product6Id == res.data[2].productId
                  ) {
                    this.isProduct6 = true;
                    this.product6 = res.data[2].productName;
                    this.product6Rate1 =
                      res.data[2].productSellingPrice;
                  } else {
                  }
                }
              }
            }
          } else {
            if (
              this.product1Id == res.data[0].productId &&
              this.product3Id == res.data[1].productId
            ) {
              this.isProduct3 = true;
              this.product1 = res.data[0].productName;
              this.product3 = res.data[1].productName;
              this.product1Rate1 =
                res.data[0].productSellingPrice;
              this.product3Rate1 =
                res.data[1].productSellingPrice;

              if (this.product4Id == res.data[2].productId) {
                this.isProduct4 = true;
                this.product4 = res.data[2].productName;
                this.product4Rate1 =
                  res.data[2].productSellingPrice;
              } else {
                if (this.product5Id == res.data[2].productId) {
                  this.isProduct5 = true;
                  this.product5 = res.data[2].productName;
                  this.product5Rate1 =
                    res.data[2].productSellingPrice;
                } else {
                  if (
                    this.product6Id == res.data[2].productId
                  ) {
                    this.isProduct6 = true;
                    this.product6 = res.data[2].productName;
                    this.product6Rate1 =
                      res.data[2].productSellingPrice;
                  } else {
                  }
                }
              }
            } else {
              if (
                this.product1Id == res.data[0].productId &&
                this.product4Id == res.data[1].productId
              ) {
                this.isProduct4 = true;
                this.product1 = res.data[0].productName;
                this.product4 = res.data[1].productName;
                this.product1Rate1 =
                  res.data[0].productSellingPrice;
                this.product4Rate1 =
                  res.data[1].productSellingPrice;

                if (this.product5Id == res.data[2].productId) {
                  this.isProduct5 = true;
                  this.product5 = res.data[2].productName;
                  this.product5Rate1 =
                    res.data[2].productSellingPrice;
                } else {
                  if (
                    this.product6Id == res.data[2].productId
                  ) {
                    this.isProduct6 = true;
                    this.product6 = res.data[2].productName;
                    this.product6Rate1 =
                      res.data[2].productSellingPrice;
                  } else {
                  }
                }
              } else {
                if (
                  this.product1Id == res.data[0].productId &&
                  this.product5Id == res.data[1].productId
                ) {
                  this.isProduct5 = true;
                  this.product1 = res.data[0].productName;
                  this.product5 = res.data[1].productName;
                  this.product1Rate1 =
                    res.data[0].productSellingPrice;
                  this.product5Rate1 =
                    res.data[1].productSellingPrice;

                  if (
                    this.product6Id == res.data[2].productId
                  ) {
                    this.isProduct6 = true;
                    this.product6 = res.data[2].productName;
                    this.product6Rate1 =
                      res.data[2].productSellingPrice;
                  } else {
                  }
                } else {
                  if (
                    this.product2Id ==
                    res.data[0].productId &&
                    this.product3Id == res.data[1].productId
                  ) {
                    this.isProduct2 = true;
                    this.isProduct3 = true;
                    this.product2 = res.data[0].productName;
                    this.product3 = res.data[1].productName;
                    this.product2Rate1 =
                      res.data[0].productSellingPrice;
                    this.product3Rate1 =
                      res.data[1].productSellingPrice;

                    if (
                      this.product4Id ==
                      res.data[2].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data[2].productName;
                      this.product4Rate1 =
                        res.data[2].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data[2].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[2].productName;
                        this.product5Rate1 =
                          res.data[2].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[2].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[2].productName;
                          this.product6Rate1 =
                            res.data[2].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  } else {
                    if (
                      this.product2Id ==
                      res.data[0].productId &&
                      this.product4Id ==
                      res.data[1].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct4 = true;
                      this.product2 =
                        res.data[0].productName;
                      this.product4 =
                        res.data[1].productName;
                      this.product2Rate1 =
                        res.data[0].productSellingPrice;
                      this.product4Rate1 =
                        res.data[1].productSellingPrice;

                      if (
                        this.product5Id ==
                        res.data[2].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[2].productName;
                        this.product5Rate1 =
                          res.data[2].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[2].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[2].productName;
                          this.product6Rate1 =
                            res.data[2].productSellingPrice;
                        } else {
                        }
                      }
                    } else {
                      if (
                        this.product2Id ==
                        res.data[0].productId &&
                        this.product5Id ==
                        res.data[1].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct5 = true;
                        this.product2 =
                          res.data[0].productName;
                        this.product5 =
                          res.data[1].productName;
                        this.product2Rate1 =
                          res.data[0].productSellingPrice;
                        this.product5Rate1 =
                          res.data[1].productSellingPrice;

                        if (
                          this.product6Id ==
                          res.data[2].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[2].productName;
                          this.product6Rate1 =
                            res.data[2].productSellingPrice;
                        } else {
                        }
                      } else {
                        if (
                          this.product3Id ==
                          res.data[0].productId &&
                          this.product4Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct3 = true;
                          this.isProduct4 = true;
                          this.product3 =
                            res.data[0].productName;
                          this.product4 =
                            res.data[1].productName;
                          this.product3Rate1 =
                            res.data[0].productSellingPrice;
                          this.product4Rate1 =
                            res.data[1].productSellingPrice;

                          if (
                            this.product5Id ==
                            res.data[2].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data[2].productName;
                            this.product5Rate1 =
                              res.data[2].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data[2]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data[2].productName;
                              this.product6Rate1 =
                                res.data[2].productSellingPrice;
                            } else {
                            }
                          }
                        } else {
                          if (
                            this.product3Id ==
                            res.data[0]
                              .productId &&
                            this.product5Id ==
                            res.data[1]
                              .productId
                          ) {
                            this.isProduct3 = true;
                            this.isProduct5 = true;
                            this.product3 =
                              res.data[0].productName;
                            this.product5 =
                              res.data[1].productName;
                            this.product3Rate1 =
                              res.data[0].productSellingPrice;
                            this.product5Rate1 =
                              res.data[1].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data[2]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data[2].productName;
                              this.product6Rate1 =
                                res.data[2].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product4Id ==
                              res.data[0]
                                .productId &&
                              this.product5Id ==
                              res.data[1]
                                .productId
                            ) {
                              this.isProduct4 = true;
                              this.isProduct5 = true;
                              this.product4 =
                                res.data[0].productName;
                              this.product5 =
                                res.data[1].productName;
                              this.product4Rate1 =
                                res.data[0].productSellingPrice;
                              this.product5Rate1 =
                                res.data[1].productSellingPrice;

                              if (
                                this
                                  .product6Id ==
                                res.data[2]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data[2].productName;
                                this.product6Rate1 =
                                  res.data[2].productSellingPrice;
                              } else {
                              }
                            } else {
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (res.data.length == 1) {
            if (this.product1Id == res.data[0].productId) {
              this.product1 = res.data[0].productName;
              this.product1Rate1 =
                res.data[0].productSellingPrice;
            } else {
              if (this.product2Id == res.data[0].productId) {
                this.isProduct2 = true;
                this.product2 = res.data[0].productName;
                this.product2Rate1 =
                  res.data[0].productSellingPrice;
              } else {
                if (this.product3Id == res.data[0].productId) {
                  this.isProduct3 = true;
                  this.product3 = res.data[0].productName;
                  this.product3Rate1 =
                    res.data[0].productSellingPrice;
                } else {
                  if (
                    this.product4Id == res.data[0].productId
                  ) {
                    this.isProduct4 = true;
                    this.product4 = res.data[0].productName;
                    this.product4Rate1 =
                      res.data[0].productSellingPrice;
                  } else {
                    if (
                      this.product5Id ==
                      res.data[0].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data[0].productName;
                      this.product5Rate1 =
                        res.data[0].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data[0].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[0].productName;
                        this.product6Rate1 =
                          res.data[0].productSellingPrice;
                      } else {
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (res.data.length == 2) {
              if (this.product1Id == res.data[0].productId) {
                this.product1 = res.data[0].productName;
                this.product1Rate1 =
                  res.data[0].productSellingPrice;

                if (this.product2Id == res.data[1].productId) {
                  this.isProduct2 = true;
                  this.product2 = res.data[1].productName;
                  this.product2Rate1 =
                    res.data[1].productSellingPrice;
                } else {
                  if (
                    this.product3Id == res.data[1].productId
                  ) {
                    this.isProduct3 = true;
                    this.product3 = res.data[1].productName;
                    this.product3Rate1 =
                      res.data[0].productSellingPrice;
                  } else {
                    if (
                      this.product4Id ==
                      res.data[1].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data[1].productName;
                      this.product4Rate1 =
                        res.data[1].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data[1].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[1].productName;
                        this.product5Rate1 =
                          res.data[1].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[1].productName;
                          this.product6Rate1 =
                            res.data[1].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  }
                }
              } else {
                if (this.product2Id == res.data[0].productId) {
                  this.isProduct2 = true;
                  this.product2 = res.data[0].productName;
                  this.product2Rate1 =
                    res.data[0].productSellingPrice;

                  if (
                    this.product3Id == res.data[1].productId
                  ) {
                    this.isProduct3 = true;
                    this.product3 = res.data[1].productName;
                    this.product3Rate1 =
                      res.data[1].productSellingPrice;
                  } else {
                    if (
                      this.product4Id ==
                      res.data[1].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data[1].productName;
                      this.product4Rate1 =
                        res.data[1].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data[1].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[1].productName;
                        this.product5Rate1 =
                          res.data[1].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[1].productName;
                          this.product6Rate1 =
                            res.data[1].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  }
                } else {
                  if (
                    this.product3Id == res.data[0].productId
                  ) {
                    this.isProduct3 = true;
                    this.product3 = res.data[0].productName;
                    this.product3Rate1 =
                      res.data[0].productSellingPrice;

                    if (
                      this.product4Id ==
                      res.data[1].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data[1].productName;
                      this.product4Rate1 =
                        res.data[1].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data[1].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[1].productName;
                        this.product5Rate1 =
                          res.data[1].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[1].productName;
                          this.product6Rate1 =
                            res.data[1].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  } else {
                    if (
                      this.product4Id ==
                      res.data[0].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data[0].productName;
                      this.product4Rate1 =
                        res.data[0].productSellingPrice;
                      if (
                        this.product5Id ==
                        res.data[1].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[1].productName;
                        this.product5Rate1 =
                          res.data[1].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[1].productName;
                          this.product6Rate1 =
                            res.data[1].productSellingPrice;
                        } else {
                        }
                      }
                    } else {
                      if (
                        this.product5Id ==
                        res.data[0].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data[0].productName;
                        this.product5Rate1 =
                          res.data[0].productSellingPrice;
                        if (
                          this.product6Id ==
                          res.data[1].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[1].productName;
                          this.product6Rate1 =
                            res.data[1].productSellingPrice;
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (res.data.length == 4) {
                if (
                  this.product1Id == res.data[0].productId &&
                  this.product2Id == res.data[1].productId &&
                  this.product3Id == res.data[2].productId
                ) {
                  this.isProduct2 = true;
                  this.isProduct3 = true;
                  this.product1 = res.data[0].productName;
                  this.product2 = res.data[1].productName;
                  this.product3 = res.data[2].productName;
                  this.product1Rate1 =
                    res.data[0].productSellingPrice;
                  this.product2Rate1 =
                    res.data[1].productSellingPrice;
                  this.product3Rate1 =
                    res.data[2].productSellingPrice;

                  if (
                    this.product4Id == res.data[3].productId
                  ) {
                    this.isProduct4 = true;
                    this.product4 = res.data[3].productName;
                    this.product4Rate1 =
                      res.data[3].productSellingPrice;
                  } else {
                    if (
                      this.product5Id ==
                      res.data[3].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data[3].productName;
                      this.product5Rate1 =
                        res.data[3].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data[3].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[3].productName;
                        this.product6Rate1 =
                          res.data[3].productSellingPrice;
                      } else {
                      }
                    }
                  }
                } else {
                  if (
                    this.product1Id ==
                    res.data[0].productId &&
                    this.product2Id ==
                    res.data[1].productId &&
                    this.product4Id == res.data[2].productId
                  ) {
                    this.isProduct2 = true;
                    this.isProduct4 = true;
                    this.product1 = res.data[0].productName;
                    this.product2 = res.data[1].productName;
                    this.product4 = res.data[2].productName;
                    this.product1Rate1 =
                      res.data[0].productSellingPrice;
                    this.product2Rate1 =
                      res.data[1].productSellingPrice;
                    this.product4Rate1 =
                      res.data[2].productSellingPrice;

                    if (
                      this.product5Id ==
                      res.data[3].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data[3].productName;
                      this.product5Rate1 =
                        res.data[3].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data[3].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[3].productName;
                        this.product6Rate1 =
                          res.data[3].productSellingPrice;
                      } else {
                      }
                    }
                  } else {
                    if (
                      this.product1Id ==
                      res.data[0].productId &&
                      this.product2Id ==
                      res.data[1].productId &&
                      this.product5Id ==
                      res.data[2].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct5 = true;
                      this.product1 =
                        res.data[0].productName;
                      this.product2 =
                        res.data[1].productName;
                      this.product5 =
                        res.data[2].productName;
                      this.product1Rate1 =
                        res.data[0].productSellingPrice;
                      this.product2Rate1 =
                        res.data[1].productSellingPrice;
                      this.product5Rate1 =
                        res.data[2].productSellingPrice;

                      if (
                        this.product6Id ==
                        res.data[3].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[3].productName;
                        this.product6Rate1 =
                          res.data[3].productSellingPrice;
                      } else {
                      }
                    } else {
                      if (
                        this.product1Id ==
                        res.data[0].productId &&
                        this.product3Id ==
                        res.data[1].productId &&
                        this.product4Id ==
                        res.data[2].productId
                      ) {
                        this.isProduct3 = true;
                        this.isProduct4 = true;
                        this.product1 =
                          res.data[0].productName;
                        this.product3 =
                          res.data[1].productName;
                        this.product4 =
                          res.data[2].productName;
                        this.product1Rate1 =
                          res.data[0].productSellingPrice;
                        this.product3Rate1 =
                          res.data[1].productSellingPrice;
                        this.product4Rate1 =
                          res.data[2].productSellingPrice;

                        if (
                          this.product5Id ==
                          res.data[3].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data[3].productName;
                          this.product5Rate1 =
                            res.data[3].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data[3].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data[3].productName;
                            this.product6Rate1 =
                              res.data[3].productSellingPrice;
                          } else {
                          }
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data[0].productId &&
                          this.product3Id ==
                          res.data[1].productId &&
                          this.product5Id ==
                          res.data[2].productId
                        ) {
                          this.isProduct3 = true;
                          this.isProduct5 = true;
                          this.product1 =
                            res.data[0].productName;
                          this.product3 =
                            res.data[1].productName;
                          this.product5 =
                            res.data[2].productName;
                          this.product1Rate1 =
                            res.data[0].productSellingPrice;
                          this.product3Rate1 =
                            res.data[1].productSellingPrice;
                          this.product5Rate1 =
                            res.data[2].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data[3].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data[3].productName;
                            this.product6Rate1 =
                              res.data[3].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product1Id ==
                            res.data[0]
                              .productId &&
                            this.product4Id ==
                            res.data[1]
                              .productId &&
                            this.product5Id ==
                            res.data[2]
                              .productId
                          ) {
                            this.isProduct4 = true;
                            this.isProduct5 = true;
                            this.product1 =
                              res.data[0].productName;
                            this.product4 =
                              res.data[1].productName;
                            this.product5 =
                              res.data[2].productName;
                            this.product1Rate1 =
                              res.data[0].productSellingPrice;
                            this.product4Rate1 =
                              res.data[1].productSellingPrice;
                            this.product5Rate1 =
                              res.data[2].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data[3]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data[3].productName;
                              this.product6Rate1 =
                                res.data[3].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product2Id ==
                              res.data[0]
                                .productId &&
                              this.product3Id ==
                              res.data[1]
                                .productId &&
                              this.product5Id ==
                              res.data[2]
                                .productId
                            ) {
                              this.isProduct3 = true;
                              this.isProduct2 = true;
                              this.isProduct5 = true;
                              this.product2 =
                                res.data[0].productName;
                              this.product3 =
                                res.data[1].productName;
                              this.product5 =
                                res.data[2].productName;
                              this.product2Rate1 =
                                res.data[0].productSellingPrice;
                              this.product3Rate1 =
                                res.data[1].productSellingPrice;
                              this.product5Rate1 =
                                res.data[2].productSellingPrice;

                              if (
                                this
                                  .product6Id ==
                                res.data[3]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data[3].productName;
                                this.product6Rate1 =
                                  res.data[3].productSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                this
                                  .product2Id ==
                                res.data[0]
                                  .productId &&
                                this
                                  .product4Id ==
                                res.data[1]
                                  .productId &&
                                this
                                  .product5Id ==
                                res.data[2]
                                  .productId
                              ) {
                                this.isProduct4 = true;
                                this.isProduct2 = true;
                                this.isProduct5 = true;
                                this.product2 =
                                  res.data[0].productName;
                                this.product4 =
                                  res.data[1].productName;
                                this.product5 =
                                  res.data[2].productName;
                                this.product2Rate1 =
                                  res.data[0].productSellingPrice;
                                this.product4Rate1 =
                                  res.data[1].productSellingPrice;
                                this.product5Rate1 =
                                  res.data[2].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data[3]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data[3].productName;
                                  this.product6Rate1 =
                                    res.data[3].productSellingPrice;
                                } else {
                                }
                              } else {
                                if (
                                  this
                                    .product3Id ==
                                  res
                                    .data[0]
                                    .productId &&
                                  this
                                    .product4Id ==
                                  res
                                    .data[1]
                                    .productId &&
                                  this
                                    .product5Id ==
                                  res
                                    .data[2]
                                    .productId
                                ) {
                                  this.isProduct4 = true;
                                  this.isProduct3 = true;
                                  this.isProduct5 = true;
                                  this.product3 =
                                    res.data[0].productName;
                                  this.product4 =
                                    res.data[1].productName;
                                  this.product5 =
                                    res.data[2].productName;
                                  this.product3Rate1 =
                                    res.data[0].productSellingPrice;
                                  this.product4Rate1 =
                                    res.data[1].productSellingPrice;
                                  this.product5Rate1 =
                                    res.data[2].productSellingPrice;

                                  if (
                                    this
                                      .product6Id ==
                                    res
                                      .data[3]
                                      .productId
                                  ) {
                                    this.isProduct6 = true;
                                    this.product6 =
                                      res.data[3].productName;
                                    this.product6Rate1 =
                                      res.data[3].productSellingPrice;
                                  } else {
                                  }
                                } else {
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                if (res.data.length == 5) {
                  if (
                    this.product1Id ==
                    res.data[0].productId &&
                    this.product2Id ==
                    res.data[1].productId &&
                    this.product3Id ==
                    res.data[2].productId &&
                    this.product4Id == res.data[3].productId
                  ) {
                    this.isProduct2 = true;
                    this.isProduct3 = true;
                    this.isProduct4 = true;
                    this.product1 = res.data[0].productName;
                    this.product2 = res.data[1].productName;
                    this.product3 = res.data[2].productName;
                    this.product4 = res.data[3].productName;
                    this.product1Rate1 =
                      res.data[0].productSellingPrice;
                    this.product2Rate1 =
                      res.data[1].productSellingPrice;
                    this.product3Rate1 =
                      res.data[2].productSellingPrice;
                    this.product4Rate1 =
                      res.data[3].productSellingPrice;

                    if (
                      this.product5Id ==
                      res.data[4].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data[4].productName;
                      this.product5Rate1 =
                        res.data[4].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data[4].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[4].productName;
                        this.product6Rate1 =
                          res.data[4].productSellingPrice;
                      } else {
                      }
                    }
                  } else {
                    if (
                      this.product1Id ==
                      res.data[0].productId &&
                      this.product2Id ==
                      res.data[1].productId &&
                      this.product3Id ==
                      res.data[2].productId &&
                      this.product5Id ==
                      res.data[3].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct3 = true;
                      this.isProduct5 = true;
                      this.product1 =
                        res.data[0].productName;
                      this.product2 =
                        res.data[1].productName;
                      this.product3 =
                        res.data[2].productName;
                      this.product5 =
                        res.data[3].productName;
                      this.product1Rate1 =
                        res.data[0].productSellingPrice;
                      this.product2Rate1 =
                        res.data[1].productSellingPrice;
                      this.product3Rate1 =
                        res.data[2].productSellingPrice;
                      this.product5Rate1 =
                        res.data[3].productSellingPrice;

                      if (
                        this.product6Id ==
                        res.data[4].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[4].productName;
                        this.product6Rate1 =
                          res.data[4].productSellingPrice;
                      } else {
                      }
                    } else {
                      if (
                        this.product1Id ==
                        res.data[0].productId &&
                        this.product2Id ==
                        res.data[1].productId &&
                        this.product4Id ==
                        res.data[2].productId &&
                        this.product5Id ==
                        res.data[3].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct4 = true;
                        this.isProduct5 = true;
                        this.product1 =
                          res.data[0].productName;
                        this.product2 =
                          res.data[1].productName;
                        this.product4 =
                          res.data[2].productName;
                        this.product5 =
                          res.data[3].productName;
                        this.product1Rate1 =
                          res.data[0].productSellingPrice;
                        this.product2Rate1 =
                          res.data[1].productSellingPrice;
                        this.product4Rate1 =
                          res.data[2].productSellingPrice;
                        this.product5Rate1 =
                          res.data[3].productSellingPrice;

                        if (
                          this.product6Id ==
                          res.data[4].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data[4].productName;
                          this.product6Rate1 =
                            res.data[4].productSellingPrice;
                        } else {
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data[0].productId &&
                          this.product3Id ==
                          res.data[1].productId &&
                          this.product4Id ==
                          res.data[2].productId &&
                          this.product5Id ==
                          res.data[3].productId
                        ) {
                          this.isProduct3 = true;
                          this.isProduct4 = true;
                          this.isProduct5 = true;
                          this.product1 =
                            res.data[0].productName;
                          this.product3 =
                            res.data[1].productName;
                          this.product4 =
                            res.data[2].productName;
                          this.product5 =
                            res.data[3].productName;
                          this.product1Rate1 =
                            res.data[0].productSellingPrice;
                          this.product3Rate1 =
                            res.data[1].productSellingPrice;
                          this.product4Rate1 =
                            res.data[2].productSellingPrice;
                          this.product5Rate1 =
                            res.data[3].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data[4].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data[4].productName;
                            this.product6Rate1 =
                              res.data[4].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product2Id ==
                            res.data[0]
                              .productId &&
                            this.product3Id ==
                            res.data[1]
                              .productId &&
                            this.product4Id ==
                            res.data[2]
                              .productId &&
                            this.product5Id ==
                            res.data[3]
                              .productId
                          ) {
                            this.isProduct2 = true;
                            this.isProduct3 = true;
                            this.isProduct4 = true;
                            this.isProduct5 = true;
                            this.product2 =
                              res.data[0].productName;
                            this.product3 =
                              res.data[1].productName;
                            this.product4 =
                              res.data[2].productName;
                            this.product5 =
                              res.data[3].productName;
                            this.product2Rate1 =
                              res.data[0].productSellingPrice;
                            this.product3Rate1 =
                              res.data[1].productSellingPrice;
                            this.product4Rate1 =
                              res.data[2].productSellingPrice;
                            this.product5Rate1 =
                              res.data[3].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data[4]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data[4].productName;
                              this.product6Rate1 =
                                res.data[4].productSellingPrice;
                            } else {
                            }
                          } else {
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (res.data.length == 6) {
                    if (
                      this.product1Id ==
                      res.data[0].productId &&
                      this.product2Id ==
                      res.data[1].productId &&
                      this.product3Id ==
                      res.data[2].productId &&
                      this.product4Id ==
                      res.data[3].productId &&
                      this.product5Id ==
                      res.data[4].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct3 = true;
                      this.isProduct4 = true;
                      this.product1 =
                        res.data[0].productName;
                      this.product2 =
                        res.data[1].productName;
                      this.product3 =
                        res.data[2].productName;
                      this.product4 =
                        res.data[3].productName;
                      this.product1Rate1 =
                        res.data[0].productSellingPrice;
                      this.product2Rate1 =
                        res.data[1].productSellingPrice;
                      this.product3Rate1 =
                        res.data[2].productSellingPrice;
                      this.product4Rate1 =
                        res.data[3].productSellingPrice;
                      this.isProduct5 = true;
                      this.product5 =
                        res.data[4].productName;
                      this.product5Rate1 =
                        res.data[4].productSellingPrice;

                      if (
                        this.product6Id ==
                        res.data[5].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data[5].productName;
                        this.product6Rate1 =
                          res.data[5].productSellingPrice;
                      } else {
                      }
                    } else {

                    }
                  } else {

                  }
                }
              }
            }
          }
        }
        if (res.data1.length) {
          if (res.data1.length == 3) {
            if (
              this.product1Id == res.data1[0].productId &&
              this.product2Id == res.data1[1].productId
            ) {
              this.isProduct2 = true;

              this.product1 = res.data1[0].productName;
              this.product2 = res.data1[1].productName;
              this.product1Rate2 =
                res.data1[0].productSellingPrice;
              this.product2Rate2 =
                res.data1[1].productSellingPrice;
              if (this.product3Id == res.data1[2].productId) {
                this.isProduct3 = true;
                this.product3 = res.data1[2].productName;
                this.product3Rate2 =
                  res.data1[2].productSellingPrice;
              } else {
                if (this.product4Id == res.data1[2].productId) {
                  this.isProduct4 = true;
                  this.product4 = res.data1[2].productName;
                  this.product4Rate2 =
                    res.data1[2].productSellingPrice;
                } else {
                  if (
                    this.product5Id ==
                    res.data1[2].productId
                  ) {
                    this.isProduct5 = true;
                    this.product5 =
                      res.data1[2].productName;
                    this.product5Rate2 =
                      res.data1[2].productSellingPrice;
                  } else {
                    if (
                      this.product6Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct6 = true;
                      this.product6 =
                        res.data1[2].productName;
                      this.product6Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                    }
                  }
                }
              }
            } else {
              if (
                this.product1Id == res.data1[0].productId &&
                this.product3Id == res.data1[1].productId
              ) {
                this.isProduct3 = true;
                this.product1 = res.data1[0].productName;
                this.product3 = res.data1[1].productName;
                this.product1Rate2 =
                  res.data1[0].productSellingPrice;
                this.product3Rate2 =
                  res.data1[1].productSellingPrice;

                if (this.product4Id == res.data1[2].productId) {
                  this.isProduct4 = true;
                  this.product4 = res.data1[2].productName;
                  this.product4Rate2 =
                    res.data1[2].productSellingPrice;
                } else {
                  if (
                    this.product5Id ==
                    res.data1[2].productId
                  ) {
                    this.isProduct5 = true;
                    this.product5 =
                      res.data1[2].productName;
                    this.product5Rate2 =
                      res.data1[2].productSellingPrice;
                  } else {
                    if (
                      this.product6Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct6 = true;
                      this.product6 =
                        res.data1[2].productName;
                      this.product6Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                    }
                  }
                }
              } else {
                if (
                  this.product1Id == res.data1[0].productId &&
                  this.product4Id == res.data1[1].productId
                ) {
                  this.isProduct4 = true;
                  this.product1 = res.data1[0].productName;
                  this.product4 = res.data1[1].productName;
                  this.product1Rate2 =
                    res.data1[0].productSellingPrice;
                  this.product4Rate2 =
                    res.data1[1].productSellingPrice;

                  if (
                    this.product5Id ==
                    res.data1[2].productId
                  ) {
                    this.isProduct5 = true;
                    this.product5 =
                      res.data1[2].productName;
                    this.product5Rate2 =
                      res.data1[2].productSellingPrice;
                  } else {
                    if (
                      this.product6Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct6 = true;
                      this.product6 =
                        res.data1[2].productName;
                      this.product6Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                    }
                  }
                } else {
                  if (
                    this.product1Id ==
                    res.data1[0].productId &&
                    this.product5Id ==
                    res.data1[1].productId
                  ) {
                    this.isProduct5 = true;
                    this.product1 =
                      res.data1[0].productName;
                    this.product5 =
                      res.data1[1].productName;
                    this.product1Rate2 =
                      res.data1[0].productSellingPrice;
                    this.product5Rate2 =
                      res.data1[1].productSellingPrice;

                    if (
                      this.product6Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct6 = true;
                      this.product6 =
                        res.data1[2].productName;
                      this.product6Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                    }
                  } else {
                    if (
                      this.product2Id ==
                      res.data1[0].productId &&
                      this.product3Id ==
                      res.data1[1].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct3 = true;
                      this.product2 =
                        res.data1[0].productName;
                      this.product3 =
                        res.data1[1].productName;
                      this.product2Rate2 =
                        res.data1[0].productSellingPrice;
                      this.product3Rate2 =
                        res.data1[1].productSellingPrice;

                      if (
                        this.product4Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[2].productName;
                        this.product4Rate2 =
                          res.data1[2].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[2].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[2].productName;
                          this.product5Rate2 =
                            res.data1[2].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[2].productName;
                            this.product6Rate2 =
                              res.data1[2].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    } else {
                      if (
                        this.product2Id ==
                        res.data1[0].productId &&
                        this.product4Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct4 = true;
                        this.product2 =
                          res.data1[0].productName;
                        this.product4 =
                          res.data1[1].productName;
                        this.product2Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product4Rate2 =
                          res.data1[1].productSellingPrice;

                        if (
                          this.product5Id ==
                          res.data1[2].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[2].productName;
                          this.product5Rate2 =
                            res.data1[2].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[2].productName;
                            this.product6Rate2 =
                              res.data1[2].productSellingPrice;
                          } else {
                          }
                        }
                      } else {
                        if (
                          this.product2Id ==
                          res.data1[0]
                            .productId &&
                          this.product5Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct5 = true;
                          this.product2 =
                            res.data1[0].productName;
                          this.product5 =
                            res.data1[1].productName;
                          this.product2Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product5Rate2 =
                            res.data1[1].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[2].productName;
                            this.product6Rate2 =
                              res.data1[2].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product3Id ==
                            res.data1[0]
                              .productId &&
                            this.product4Id ==
                            res.data1[1]
                              .productId
                          ) {
                            this.isProduct3 = true;
                            this.isProduct4 = true;
                            this.product3 =
                              res.data1[0].productName;
                            this.product4 =
                              res.data1[1].productName;
                            this.product3Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product4Rate2 =
                              res.data1[1].productSellingPrice;

                            if (
                              this.product5Id ==
                              res.data1[2]
                                .productId
                            ) {
                              this.isProduct5 = true;
                              this.product5 =
                                res.data1[2].productName;
                              this.product5Rate2 =
                                res.data1[2].productSellingPrice;
                            } else {
                              if (
                                this
                                  .product6Id ==
                                res.data1[2]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[2].productName;
                                this.product6Rate2 =
                                  res.data1[2].productSellingPrice;
                              } else {
                              }
                            }
                          } else {
                            if (
                              this.product3Id ==
                              res.data1[0]
                                .productId &&
                              this.product5Id ==
                              res.data1[1]
                                .productId
                            ) {
                              this.isProduct3 = true;
                              this.isProduct5 = true;
                              this.product3 =
                                res.data1[0].productName;
                              this.product5 =
                                res.data1[1].productName;
                              this.product3Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product5Rate2 =
                                res.data1[1].productSellingPrice;

                              if (
                                this
                                  .product6Id ==
                                res.data1[2]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[2].productName;
                                this.product6Rate2 =
                                  res.data1[2].productSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                this
                                  .product4Id ==
                                res.data1[0]
                                  .productId &&
                                this
                                  .product5Id ==
                                res.data1[1]
                                  .productId
                              ) {
                                this.isProduct4 = true;
                                this.isProduct5 = true;
                                this.product4 =
                                  res.data1[0].productName;
                                this.product5 =
                                  res.data1[1].productName;
                                this.product4Rate2 =
                                  res.data1[0].productSellingPrice;
                                this.product5Rate2 =
                                  res.data1[1].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data1[2]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[2].productName;
                                  this.product6Rate2 =
                                    res.data1[2].productSellingPrice;
                                } else {
                                }
                              } else {
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (res.data1.length == 1) {
              if (this.product1Id == res.data1[0].productId) {
                this.product1 = res.data1[0].productName;
                this.product1Rate2 =
                  res.data1[0].productSellingPrice;
              } else {
                if (this.product2Id == res.data1[0].productId) {
                  this.isProduct2 = true;
                  this.product2 = res.data1[0].productName;
                  this.product2Rate2 =
                    res.data1[0].productSellingPrice;
                } else {
                  if (
                    this.product3Id ==
                    res.data1[0].productId
                  ) {
                    this.isProduct3 = true;
                    this.product3 =
                      res.data1[0].productName;
                    this.product3Rate2 =
                      res.data1[0].productSellingPrice;
                  } else {
                    if (
                      this.product4Id ==
                      res.data1[0].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data1[0].productName;
                      this.product4Rate2 =
                        res.data1[0].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data1[0].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data1[0].productName;
                        this.product5Rate2 =
                          res.data1[0].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data1[0].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[0].productName;
                          this.product6Rate2 =
                            res.data1[0].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (res.data1.length == 2) {
                if (this.product1Id == res.data1[0].productId) {
                  this.product1 = res.data1[0].productName;
                  this.product1Rate2 =
                    res.data1[0].productSellingPrice;

                  if (
                    this.product2Id ==
                    res.data1[1].productId
                  ) {
                    this.isProduct2 = true;
                    this.product2 =
                      res.data1[1].productName;
                    this.product2Rate2 =
                      res.data1[1].productSellingPrice;
                  } else {
                    if (
                      this.product3Id ==
                      res.data1[1].productId
                    ) {
                      this.isProduct3 = true;
                      this.product3 =
                        res.data1[1].productName;
                      this.product3Rate2 =
                        res.data1[0].productSellingPrice;
                    } else {
                      if (
                        this.product4Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[1].productName;
                        this.product4Rate2 =
                          res.data1[1].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[1].productName;
                          this.product5Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[1].productName;
                            this.product6Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (
                    this.product2Id ==
                    res.data1[0].productId
                  ) {
                    this.isProduct2 = true;
                    this.product2 =
                      res.data1[0].productName;
                    this.product2Rate2 =
                      res.data1[0].productSellingPrice;

                    if (
                      this.product3Id ==
                      res.data1[1].productId
                    ) {
                      this.isProduct3 = true;
                      this.product3 =
                        res.data1[1].productName;
                      this.product3Rate2 =
                        res.data1[1].productSellingPrice;
                    } else {
                      if (
                        this.product4Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[1].productName;
                        this.product4Rate2 =
                          res.data1[1].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[1].productName;
                          this.product5Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[1].productName;
                            this.product6Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    }
                  } else {
                    if (
                      this.product3Id ==
                      res.data1[0].productId
                    ) {
                      this.isProduct3 = true;
                      this.product3 =
                        res.data1[0].productName;
                      this.product3Rate2 =
                        res.data1[0].productSellingPrice;

                      if (
                        this.product4Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[1].productName;
                        this.product4Rate2 =
                          res.data1[1].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[1].productName;
                          this.product5Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[1].productName;
                            this.product6Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    } else {
                      if (
                        this.product4Id ==
                        res.data1[0].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[0].productName;
                        this.product4Rate2 =
                          res.data1[0].productSellingPrice;
                        if (
                          this.product5Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[1].productName;
                          this.product5Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[1].productName;
                            this.product6Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                          }
                        }
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[0].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[0].productName;
                          this.product5Rate2 =
                            res.data1[0].productSellingPrice;
                          if (
                            this.product6Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[1].productName;
                            this.product6Rate2 =
                              res.data1[1].productSellingPrice;
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                if (res.data1.length == 4) {
                  if (
                    this.product1Id ==
                    res.data1[0].productId &&
                    this.product2Id ==
                    res.data1[1].productId &&
                    this.product3Id ==
                    res.data1[2].productId
                  ) {
                    this.isProduct2 = true;
                    this.isProduct3 = true;
                    this.product1 =
                      res.data1[0].productName;
                    this.product2 =
                      res.data1[1].productName;
                    this.product3 =
                      res.data1[2].productName;
                    this.product1Rate2 =
                      res.data1[0].productSellingPrice;
                    this.product2Rate2 =
                      res.data1[1].productSellingPrice;
                    this.product3Rate2 =
                      res.data1[2].productSellingPrice;

                    if (
                      this.product4Id ==
                      res.data1[3].productId
                    ) {
                      this.isProduct4 = true;
                      this.product4 =
                        res.data1[3].productName;
                      this.product4Rate2 =
                        res.data1[3].productSellingPrice;
                    } else {
                      if (
                        this.product5Id ==
                        res.data1[3].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data1[3].productName;
                        this.product5Rate2 =
                          res.data1[3].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[3].productName;
                          this.product6Rate2 =
                            res.data1[3].productSellingPrice;
                        } else {
                        }
                      }
                    }
                  } else {
                    if (
                      this.product1Id ==
                      res.data1[0].productId &&
                      this.product2Id ==
                      res.data1[1].productId &&
                      this.product4Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct4 = true;
                      this.product1 =
                        res.data1[0].productName;
                      this.product2 =
                        res.data1[1].productName;
                      this.product4 =
                        res.data1[2].productName;
                      this.product1Rate2 =
                        res.data1[0].productSellingPrice;
                      this.product2Rate2 =
                        res.data1[1].productSellingPrice;
                      this.product4Rate2 =
                        res.data1[2].productSellingPrice;

                      if (
                        this.product5Id ==
                        res.data1[3].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data1[3].productName;
                        this.product5Rate2 =
                          res.data1[3].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[3].productName;
                          this.product6Rate2 =
                            res.data1[3].productSellingPrice;
                        } else {
                        }
                      }
                    } else {
                      if (
                        this.product1Id ==
                        res.data1[0].productId &&
                        this.product2Id ==
                        res.data1[1].productId &&
                        this.product5Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct5 = true;
                        this.product1 =
                          res.data1[0].productName;
                        this.product2 =
                          res.data1[1].productName;
                        this.product5 =
                          res.data1[2].productName;
                        this.product1Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product2Rate2 =
                          res.data1[1].productSellingPrice;
                        this.product5Rate2 =
                          res.data1[2].productSellingPrice;

                        if (
                          this.product6Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[3].productName;
                          this.product6Rate2 =
                            res.data1[3].productSellingPrice;
                        } else {
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data1[0]
                            .productId &&
                          this.product3Id ==
                          res.data1[1]
                            .productId &&
                          this.product4Id ==
                          res.data1[2].productId
                        ) {
                          this.isProduct3 = true;
                          this.isProduct4 = true;
                          this.product1 =
                            res.data1[0].productName;
                          this.product3 =
                            res.data1[1].productName;
                          this.product4 =
                            res.data1[2].productName;
                          this.product1Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product3Rate2 =
                            res.data1[1].productSellingPrice;
                          this.product4Rate2 =
                            res.data1[2].productSellingPrice;

                          if (
                            this.product5Id ==
                            res.data1[3].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[3].productName;
                            this.product5Rate2 =
                              res.data1[3].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[3]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[3].productName;
                              this.product6Rate2 =
                                res.data1[3].productSellingPrice;
                            } else {
                            }
                          }
                        } else {
                          if (
                            this.product1Id ==
                            res.data1[0]
                              .productId &&
                            this.product3Id ==
                            res.data1[1]
                              .productId &&
                            this.product5Id ==
                            res.data1[2]
                              .productId
                          ) {
                            this.isProduct3 = true;
                            this.isProduct5 = true;
                            this.product1 =
                              res.data1[0].productName;
                            this.product3 =
                              res.data1[1].productName;
                            this.product5 =
                              res.data1[2].productName;
                            this.product1Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product3Rate2 =
                              res.data1[1].productSellingPrice;
                            this.product5Rate2 =
                              res.data1[2].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data1[3]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[3].productName;
                              this.product6Rate2 =
                                res.data1[3].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product1Id ==
                              res.data1[0]
                                .productId &&
                              this.product4Id ==
                              res.data1[1]
                                .productId &&
                              this.product5Id ==
                              res.data1[2]
                                .productId
                            ) {
                              this.isProduct4 = true;
                              this.isProduct5 = true;
                              this.product1 =
                                res.data1[0].productName;
                              this.product4 =
                                res.data1[1].productName;
                              this.product5 =
                                res.data1[2].productName;
                              this.product1Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product4Rate2 =
                                res.data1[1].productSellingPrice;
                              this.product5Rate2 =
                                res.data1[2].productSellingPrice;

                              if (
                                this
                                  .product6Id ==
                                res.data1[3]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[3].productName;
                                this.product6Rate2 =
                                  res.data1[3].productSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                this
                                  .product2Id ==
                                res.data1[0]
                                  .productId &&
                                this
                                  .product3Id ==
                                res.data1[1]
                                  .productId &&
                                this
                                  .product5Id ==
                                res.data1[2]
                                  .productId
                              ) {
                                this.isProduct3 = true;
                                this.isProduct2 = true;
                                this.isProduct5 = true;
                                this.product2 =
                                  res.data1[0].productName;
                                this.product3 =
                                  res.data1[1].productName;
                                this.product5 =
                                  res.data1[2].productName;
                                this.product2Rate2 =
                                  res.data1[0].productSellingPrice;
                                this.product3Rate2 =
                                  res.data1[1].productSellingPrice;
                                this.product5Rate2 =
                                  res.data1[2].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data1[3]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[3].productName;
                                  this.product6Rate2 =
                                    res.data1[3].productSellingPrice;
                                } else {
                                }
                              } else {
                                if (
                                  this
                                    .product2Id ==
                                  res
                                    .data1[0]
                                    .productId &&
                                  this
                                    .product4Id ==
                                  res
                                    .data1[1]
                                    .productId &&
                                  this
                                    .product5Id ==
                                  res
                                    .data1[2]
                                    .productId
                                ) {
                                  this.isProduct4 = true;
                                  this.isProduct2 = true;
                                  this.isProduct5 = true;
                                  this.product2 =
                                    res.data1[0].productName;
                                  this.product4 =
                                    res.data1[1].productName;
                                  this.product5 =
                                    res.data1[2].productName;
                                  this.product2Rate2 =
                                    res.data1[0].productSellingPrice;
                                  this.product4Rate2 =
                                    res.data1[1].productSellingPrice;
                                  this.product5Rate2 =
                                    res.data1[2].productSellingPrice;

                                  if (
                                    this
                                      .product6Id ==
                                    res
                                      .data1[3]
                                      .productId
                                  ) {
                                    this.isProduct6 = true;
                                    this.product6 =
                                      res.data1[3].productName;
                                    this.product6Rate2 =
                                      res.data1[3].productSellingPrice;
                                  } else {
                                  }
                                } else {
                                  if (
                                    this
                                      .product3Id ==
                                    res
                                      .data1[0]
                                      .productId &&
                                    this
                                      .product4Id ==
                                    res
                                      .data1[1]
                                      .productId &&
                                    this
                                      .product5Id ==
                                    res
                                      .data1[2]
                                      .productId
                                  ) {
                                    this.isProduct4 = true;
                                    this.isProduct3 = true;
                                    this.isProduct5 = true;
                                    this.product3 =
                                      res.data1[0].productName;
                                    this.product4 =
                                      res.data1[1].productName;
                                    this.product5 =
                                      res.data1[2].productName;
                                    this.product3Rate2 =
                                      res.data1[0].productSellingPrice;
                                    this.product4Rate2 =
                                      res.data1[1].productSellingPrice;
                                    this.product5Rate2 =
                                      res.data1[2].productSellingPrice;

                                    if (
                                      this
                                        .product6Id ==
                                      res
                                        .data1[3]
                                        .productId
                                    ) {
                                      this.isProduct6 = true;
                                      this.product6 =
                                        res.data1[3].productName;
                                      this.product6Rate2 =
                                        res.data1[3].productSellingPrice;
                                    } else {
                                    }
                                  } else {
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (res.data1.length == 5) {
                    if (
                      this.product1Id ==
                      res.data1[0].productId &&
                      this.product2Id ==
                      res.data1[1].productId &&
                      this.product3Id ==
                      res.data1[2].productId &&
                      this.product4Id ==
                      res.data1[3].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct3 = true;
                      this.isProduct4 = true;
                      this.product1 =
                        res.data1[0].productName;
                      this.product2 =
                        res.data1[1].productName;
                      this.product3 =
                        res.data1[2].productName;
                      this.product4 =
                        res.data1[3].productName;
                      this.product1Rate2 =
                        res.data1[0].productSellingPrice;
                      this.product2Rate2 =
                        res.data1[1].productSellingPrice;
                      this.product3Rate2 =
                        res.data1[2].productSellingPrice;
                      this.product4Rate2 =
                        res.data1[3].productSellingPrice;

                      if (
                        this.product5Id ==
                        res.data1[4].productId
                      ) {
                        this.isProduct5 = true;
                        this.product5 =
                          res.data1[4].productName;
                        this.product5Rate2 =
                          res.data1[4].productSellingPrice;
                      } else {
                        if (
                          this.product6Id ==
                          res.data1[4].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[4].productName;
                          this.product6Rate2 =
                            res.data1[4].productSellingPrice;
                        } else {
                        }
                      }
                    } else {
                      if (
                        this.product1Id ==
                        res.data1[0].productId &&
                        this.product2Id ==
                        res.data1[1].productId &&
                        this.product3Id ==
                        res.data1[2].productId &&
                        this.product5Id ==
                        res.data1[3].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct3 = true;
                        this.isProduct5 = true;
                        this.product1 =
                          res.data1[0].productName;
                        this.product2 =
                          res.data1[1].productName;
                        this.product3 =
                          res.data1[2].productName;
                        this.product5 =
                          res.data1[3].productName;
                        this.product1Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product2Rate2 =
                          res.data1[1].productSellingPrice;
                        this.product3Rate2 =
                          res.data1[2].productSellingPrice;
                        this.product5Rate2 =
                          res.data1[3].productSellingPrice;

                        if (
                          this.product6Id ==
                          res.data1[4].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[4].productName;
                          this.product6Rate2 =
                            res.data1[4].productSellingPrice;
                        } else {
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data1[0]
                            .productId &&
                          this.product2Id ==
                          res.data1[1]
                            .productId &&
                          this.product4Id ==
                          res.data1[2]
                            .productId &&
                          this.product5Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct4 = true;
                          this.isProduct5 = true;
                          this.product1 =
                            res.data1[0].productName;
                          this.product2 =
                            res.data1[1].productName;
                          this.product4 =
                            res.data1[2].productName;
                          this.product5 =
                            res.data1[3].productName;
                          this.product1Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product2Rate2 =
                            res.data1[1].productSellingPrice;
                          this.product4Rate2 =
                            res.data1[2].productSellingPrice;
                          this.product5Rate2 =
                            res.data1[3].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data1[4].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[4].productName;
                            this.product6Rate2 =
                              res.data1[4].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product1Id ==
                            res.data1[0]
                              .productId &&
                            this.product3Id ==
                            res.data1[1]
                              .productId &&
                            this.product4Id ==
                            res.data1[2]
                              .productId &&
                            this.product5Id ==
                            res.data1[3]
                              .productId
                          ) {
                            this.isProduct3 = true;
                            this.isProduct4 = true;
                            this.isProduct5 = true;
                            this.product1 =
                              res.data1[0].productName;
                            this.product3 =
                              res.data1[1].productName;
                            this.product4 =
                              res.data1[2].productName;
                            this.product5 =
                              res.data1[3].productName;
                            this.product1Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product3Rate2 =
                              res.data1[1].productSellingPrice;
                            this.product4Rate2 =
                              res.data1[2].productSellingPrice;
                            this.product5Rate2 =
                              res.data1[3].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data1[4]
                                .productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[4].productName;
                              this.product6Rate2 =
                                res.data1[4].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product2Id ==
                              res.data1[0]
                                .productId &&
                              this.product3Id ==
                              res.data1[1]
                                .productId &&
                              this.product4Id ==
                              res.data1[2]
                                .productId &&
                              this.product5Id ==
                              res.data1[3]
                                .productId
                            ) {
                              this.isProduct2 = true;
                              this.isProduct3 = true;
                              this.isProduct4 = true;
                              this.isProduct5 = true;
                              this.product2 =
                                res.data1[0].productName;
                              this.product3 =
                                res.data1[1].productName;
                              this.product4 =
                                res.data1[2].productName;
                              this.product5 =
                                res.data1[3].productName;
                              this.product2Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product3Rate2 =
                                res.data1[1].productSellingPrice;
                              this.product4Rate2 =
                                res.data1[2].productSellingPrice;
                              this.product5Rate2 =
                                res.data1[3].productSellingPrice;

                              if (
                                this
                                  .product6Id ==
                                res.data1[4]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[4].productName;
                                this.product6Rate2 =
                                  res.data1[4].productSellingPrice;
                              } else {
                              }
                            } else {
                            }
                          }
                        }
                      }
                    }
                  } else {
                    if (res.data1.length == 6) {
                      if (
                        this.product1Id ==
                        res.data1[0].productId &&
                        this.product2Id ==
                        res.data1[1].productId &&
                        this.product3Id ==
                        res.data1[2].productId &&
                        this.product4Id ==
                        res.data1[3].productId &&
                        this.product5Id ==
                        res.data1[4].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct3 = true;
                        this.isProduct4 = true;
                        this.product1 =
                          res.data1[0].productName;
                        this.product2 =
                          res.data1[1].productName;
                        this.product3 =
                          res.data1[2].productName;
                        this.product4 =
                          res.data1[3].productName;
                        this.product1Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product2Rate2 =
                          res.data1[1].productSellingPrice;
                        this.product3Rate2 =
                          res.data1[2].productSellingPrice;
                        this.product4Rate2 =
                          res.data1[3].productSellingPrice;
                        this.isProduct5 = true;
                        this.product5 =
                          res.data1[4].productName;
                        this.product5Rate2 =
                          res.data1[4].productSellingPrice;

                        if (
                          this.product6Id ==
                          res.data1[5].productId
                        ) {
                          this.isProduct6 = true;
                          this.product6 =
                            res.data1[5].productName;
                          this.product6Rate2 =
                            res.data1[5].productSellingPrice;
                        } else {
                        }
                      } else {

                      }
                    } else {

                    }
                  }
                }
              }
            }
          }
        } else {
          this.product1Rate2 = "please set rate";
          this.product2Rate2 = "please set rate";
          this.product3Rate2 = "please set rate";
          this.product4Rate2 = "please set rate";
          this.product5Rate2 = "please set rate";
          this.product6Rate2 = "please set rate";
        }

        this.cd.detectChanges()
      } else {
        if (res.data1.length) {
          this.product1Rate1 = "";
          this.product2Rate1 = "";
          this.product3Rate1 = "";
          this.product4Rate1 = "";
          this.product5Rate1 = "";
          this.product6Rate1 = "";
          this.isNoRate = false;
          if (res.data1.length) {
            if (res.data1.length == 3) {
              if (
                this.product1Id == res.data1[0].productId &&
                this.product2Id == res.data1[1].productId
              ) {
                this.isProduct2 = true;

                this.product1 = res.data1[0].productName;
                this.product2 = res.data1[1].productName;
                this.product1Rate2 =
                  res.data1[0].productSellingPrice;
                this.product2Rate2 =
                  res.data1[1].productSellingPrice;
                if (this.product3Id == res.data1[2].productId) {
                  this.isProduct3 = true;
                  this.product3 = res.data1[2].productName;
                  this.product3Rate2 =
                    res.data1[2].productSellingPrice;
                } else {
                  if (this.product4Id == res.data1[2].productId) {
                    this.isProduct4 = true;
                    this.product4 = res.data1[2].productName;
                    this.product4Rate2 =
                      res.data1[2].productSellingPrice;
                  } else {
                    if (
                      this.product5Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data1[2].productName;
                      this.product5Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data1[2].productName;
                        this.product6Rate2 =
                          res.data1[2].productSellingPrice;
                      } else {
                      }
                    }
                  }
                }
              } else {
                if (
                  this.product1Id == res.data1[0].productId &&
                  this.product3Id == res.data1[1].productId
                ) {
                  this.isProduct3 = true;
                  this.product1 = res.data1[0].productName;
                  this.product3 = res.data1[1].productName;
                  this.product1Rate2 =
                    res.data1[0].productSellingPrice;
                  this.product3Rate2 =
                    res.data1[1].productSellingPrice;

                  if (this.product4Id == res.data1[2].productId) {
                    this.isProduct4 = true;
                    this.product4 = res.data1[2].productName;
                    this.product4Rate2 =
                      res.data1[2].productSellingPrice;
                  } else {
                    if (
                      this.product5Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data1[2].productName;
                      this.product5Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data1[2].productName;
                        this.product6Rate2 =
                          res.data1[2].productSellingPrice;
                      } else {
                      }
                    }
                  }
                } else {
                  if (
                    this.product1Id == res.data1[0].productId &&
                    this.product4Id == res.data1[1].productId
                  ) {
                    this.isProduct4 = true;
                    this.product1 = res.data1[0].productName;
                    this.product4 = res.data1[1].productName;
                    this.product1Rate2 =
                      res.data1[0].productSellingPrice;
                    this.product4Rate2 =
                      res.data1[1].productSellingPrice;

                    if (
                      this.product5Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct5 = true;
                      this.product5 =
                        res.data1[2].productName;
                      this.product5Rate2 =
                        res.data1[2].productSellingPrice;
                    } else {
                      if (
                        this.product6Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data1[2].productName;
                        this.product6Rate2 =
                          res.data1[2].productSellingPrice;
                      } else {
                      }
                    }
                  } else {
                    if (
                      this.product1Id ==
                      res.data1[0].productId &&
                      this.product5Id ==
                      res.data1[1].productId
                    ) {
                      this.isProduct5 = true;
                      this.product1 =
                        res.data1[0].productName;
                      this.product5 =
                        res.data1[1].productName;
                      this.product1Rate2 =
                        res.data1[0].productSellingPrice;
                      this.product5Rate2 =
                        res.data1[1].productSellingPrice;

                      if (
                        this.product6Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct6 = true;
                        this.product6 =
                          res.data1[2].productName;
                        this.product6Rate2 =
                          res.data1[2].productSellingPrice;
                      } else {
                      }
                    } else {
                      if (
                        this.product2Id ==
                        res.data1[0].productId &&
                        this.product3Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct3 = true;
                        this.product2 =
                          res.data1[0].productName;
                        this.product3 =
                          res.data1[1].productName;
                        this.product2Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product3Rate2 =
                          res.data1[1].productSellingPrice;

                        if (
                          this.product4Id ==
                          res.data1[2].productId
                        ) {
                          this.isProduct4 = true;
                          this.product4 =
                            res.data1[2].productName;
                          this.product4Rate2 =
                            res.data1[2].productSellingPrice;
                        } else {
                          if (
                            this.product5Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[2].productName;
                            this.product5Rate2 =
                              res.data1[2].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[2].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[2].productName;
                              this.product6Rate2 =
                                res.data1[2].productSellingPrice;
                            } else {
                            }
                          }
                        }
                      } else {
                        if (
                          this.product2Id ==
                          res.data1[0].productId &&
                          this.product4Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct4 = true;
                          this.product2 =
                            res.data1[0].productName;
                          this.product4 =
                            res.data1[1].productName;
                          this.product2Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product4Rate2 =
                            res.data1[1].productSellingPrice;

                          if (
                            this.product5Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[2].productName;
                            this.product5Rate2 =
                              res.data1[2].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[2].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[2].productName;
                              this.product6Rate2 =
                                res.data1[2].productSellingPrice;
                            } else {
                            }
                          }
                        } else {
                          if (
                            this.product2Id ==
                            res.data1[0]
                              .productId &&
                            this.product5Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct2 = true;
                            this.isProduct5 = true;
                            this.product2 =
                              res.data1[0].productName;
                            this.product5 =
                              res.data1[1].productName;
                            this.product2Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product5Rate2 =
                              res.data1[1].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data1[2].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[2].productName;
                              this.product6Rate2 =
                                res.data1[2].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product3Id ==
                              res.data1[0]
                                .productId &&
                              this.product4Id ==
                              res.data1[1]
                                .productId
                            ) {
                              this.isProduct3 = true;
                              this.isProduct4 = true;
                              this.product3 =
                                res.data1[0].productName;
                              this.product4 =
                                res.data1[1].productName;
                              this.product3Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product4Rate2 =
                                res.data1[1].productSellingPrice;

                              if (
                                this.product5Id ==
                                res.data1[2]
                                  .productId
                              ) {
                                this.isProduct5 = true;
                                this.product5 =
                                  res.data1[2].productName;
                                this.product5Rate2 =
                                  res.data1[2].productSellingPrice;
                              } else {
                                if (
                                  this
                                    .product6Id ==
                                  res.data1[2]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[2].productName;
                                  this.product6Rate2 =
                                    res.data1[2].productSellingPrice;
                                } else {
                                }
                              }
                            } else {
                              if (
                                this.product3Id ==
                                res.data1[0]
                                  .productId &&
                                this.product5Id ==
                                res.data1[1]
                                  .productId
                              ) {
                                this.isProduct3 = true;
                                this.isProduct5 = true;
                                this.product3 =
                                  res.data1[0].productName;
                                this.product5 =
                                  res.data1[1].productName;
                                this.product3Rate2 =
                                  res.data1[0].productSellingPrice;
                                this.product5Rate2 =
                                  res.data1[1].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data1[2]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[2].productName;
                                  this.product6Rate2 =
                                    res.data1[2].productSellingPrice;
                                } else {
                                }
                              } else {
                                if (
                                  this
                                    .product4Id ==
                                  res.data1[0]
                                    .productId &&
                                  this
                                    .product5Id ==
                                  res.data1[1]
                                    .productId
                                ) {
                                  this.isProduct4 = true;
                                  this.isProduct5 = true;
                                  this.product4 =
                                    res.data1[0].productName;
                                  this.product5 =
                                    res.data1[1].productName;
                                  this.product4Rate2 =
                                    res.data1[0].productSellingPrice;
                                  this.product5Rate2 =
                                    res.data1[1].productSellingPrice;

                                  if (
                                    this
                                      .product6Id ==
                                    res.data1[2]
                                      .productId
                                  ) {
                                    this.isProduct6 = true;
                                    this.product6 =
                                      res.data1[2].productName;
                                    this.product6Rate2 =
                                      res.data1[2].productSellingPrice;
                                  } else {
                                  }
                                } else {
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              if (res.data1.length == 1) {
                if (this.product1Id == res.data1[0].productId) {
                  this.product1 = res.data1[0].productName;
                  this.product1Rate2 =
                    res.data1[0].productSellingPrice;
                } else {
                  if (this.product2Id == res.data1[0].productId) {
                    this.isProduct2 = true;
                    this.product2 = res.data1[0].productName;
                    this.product2Rate2 =
                      res.data1[0].productSellingPrice;
                  } else {
                    if (
                      this.product3Id ==
                      res.data1[0].productId
                    ) {
                      this.isProduct3 = true;
                      this.product3 =
                        res.data1[0].productName;
                      this.product3Rate2 =
                        res.data1[0].productSellingPrice;
                    } else {
                      if (
                        this.product4Id ==
                        res.data1[0].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[0].productName;
                        this.product4Rate2 =
                          res.data1[0].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[0].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[0].productName;
                          this.product5Rate2 =
                            res.data1[0].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[0].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[0].productName;
                            this.product6Rate2 =
                              res.data1[0].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                if (res.data1.length == 2) {
                  if (this.product1Id == res.data1[0].productId) {
                    this.product1 = res.data1[0].productName;
                    this.product1Rate2 =
                      res.data1[0].productSellingPrice;

                    if (
                      this.product2Id ==
                      res.data1[1].productId
                    ) {
                      this.isProduct2 = true;
                      this.product2 =
                        res.data1[1].productName;
                      this.product2Rate2 =
                        res.data1[1].productSellingPrice;
                    } else {
                      if (
                        this.product3Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct3 = true;
                        this.product3 =
                          res.data1[1].productName;
                        this.product3Rate2 =
                          res.data1[0].productSellingPrice;
                      } else {
                        if (
                          this.product4Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct4 = true;
                          this.product4 =
                            res.data1[1].productName;
                          this.product4Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product5Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[1].productName;
                            this.product5Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[1].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[1].productName;
                              this.product6Rate2 =
                                res.data1[1].productSellingPrice;
                            } else {
                            }
                          }
                        }
                      }
                    }
                  } else {
                    if (
                      this.product2Id ==
                      res.data1[0].productId
                    ) {
                      this.isProduct2 = true;
                      this.product2 =
                        res.data1[0].productName;
                      this.product2Rate2 =
                        res.data1[0].productSellingPrice;

                      if (
                        this.product3Id ==
                        res.data1[1].productId
                      ) {
                        this.isProduct3 = true;
                        this.product3 =
                          res.data1[1].productName;
                        this.product3Rate2 =
                          res.data1[1].productSellingPrice;
                      } else {
                        if (
                          this.product4Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct4 = true;
                          this.product4 =
                            res.data1[1].productName;
                          this.product4Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product5Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[1].productName;
                            this.product5Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[1].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[1].productName;
                              this.product6Rate2 =
                                res.data1[1].productSellingPrice;
                            } else {
                            }
                          }
                        }
                      }
                    } else {
                      if (
                        this.product3Id ==
                        res.data1[0].productId
                      ) {
                        this.isProduct3 = true;
                        this.product3 =
                          res.data1[0].productName;
                        this.product3Rate2 =
                          res.data1[0].productSellingPrice;

                        if (
                          this.product4Id ==
                          res.data1[1].productId
                        ) {
                          this.isProduct4 = true;
                          this.product4 =
                            res.data1[1].productName;
                          this.product4Rate2 =
                            res.data1[1].productSellingPrice;
                        } else {
                          if (
                            this.product5Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[1].productName;
                            this.product5Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[1].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[1].productName;
                              this.product6Rate2 =
                                res.data1[1].productSellingPrice;
                            } else {
                            }
                          }
                        }
                      } else {
                        if (
                          this.product4Id ==
                          res.data1[0].productId
                        ) {
                          this.isProduct4 = true;
                          this.product4 =
                            res.data1[0].productName;
                          this.product4Rate2 =
                            res.data1[0].productSellingPrice;
                          if (
                            this.product5Id ==
                            res.data1[1].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[1].productName;
                            this.product5Rate2 =
                              res.data1[1].productSellingPrice;
                          } else {
                            if (
                              this.product6Id ==
                              res.data1[1].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[1].productName;
                              this.product6Rate2 =
                                res.data1[1].productSellingPrice;
                            } else {
                            }
                          }
                        } else {
                          if (
                            this.product5Id ==
                            res.data1[0].productId
                          ) {
                            this.isProduct5 = true;
                            this.product5 =
                              res.data1[0].productName;
                            this.product5Rate2 =
                              res.data1[0].productSellingPrice;
                            if (
                              this.product6Id ==
                              res.data1[1].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[1].productName;
                              this.product6Rate2 =
                                res.data1[1].productSellingPrice;
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  if (res.data1.length == 4) {
                    if (
                      this.product1Id ==
                      res.data1[0].productId &&
                      this.product2Id ==
                      res.data1[1].productId &&
                      this.product3Id ==
                      res.data1[2].productId
                    ) {
                      this.isProduct2 = true;
                      this.isProduct3 = true;
                      this.product1 =
                        res.data1[0].productName;
                      this.product2 =
                        res.data1[1].productName;
                      this.product3 =
                        res.data1[2].productName;
                      this.product1Rate2 =
                        res.data1[0].productSellingPrice;
                      this.product2Rate2 =
                        res.data1[1].productSellingPrice;
                      this.product3Rate2 =
                        res.data1[2].productSellingPrice;

                      if (
                        this.product4Id ==
                        res.data1[3].productId
                      ) {
                        this.isProduct4 = true;
                        this.product4 =
                          res.data1[3].productName;
                        this.product4Rate2 =
                          res.data1[3].productSellingPrice;
                      } else {
                        if (
                          this.product5Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[3].productName;
                          this.product5Rate2 =
                            res.data1[3].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[3].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[3].productName;
                            this.product6Rate2 =
                              res.data1[3].productSellingPrice;
                          } else {
                          }
                        }
                      }
                    } else {
                      if (
                        this.product1Id ==
                        res.data1[0].productId &&
                        this.product2Id ==
                        res.data1[1].productId &&
                        this.product4Id ==
                        res.data1[2].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct4 = true;
                        this.product1 =
                          res.data1[0].productName;
                        this.product2 =
                          res.data1[1].productName;
                        this.product4 =
                          res.data1[2].productName;
                        this.product1Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product2Rate2 =
                          res.data1[1].productSellingPrice;
                        this.product4Rate2 =
                          res.data1[2].productSellingPrice;

                        if (
                          this.product5Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[3].productName;
                          this.product5Rate2 =
                            res.data1[3].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[3].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[3].productName;
                            this.product6Rate2 =
                              res.data1[3].productSellingPrice;
                          } else {
                          }
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data1[0].productId &&
                          this.product2Id ==
                          res.data1[1].productId &&
                          this.product5Id ==
                          res.data1[2].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct5 = true;
                          this.product1 =
                            res.data1[0].productName;
                          this.product2 =
                            res.data1[1].productName;
                          this.product5 =
                            res.data1[2].productName;
                          this.product1Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product2Rate2 =
                            res.data1[1].productSellingPrice;
                          this.product5Rate2 =
                            res.data1[2].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data1[3].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[3].productName;
                            this.product6Rate2 =
                              res.data1[3].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product1Id ==
                            res.data1[0]
                              .productId &&
                            this.product3Id ==
                            res.data1[1]
                              .productId &&
                            this.product4Id ==
                            res.data1[2].productId
                          ) {
                            this.isProduct3 = true;
                            this.isProduct4 = true;
                            this.product1 =
                              res.data1[0].productName;
                            this.product3 =
                              res.data1[1].productName;
                            this.product4 =
                              res.data1[2].productName;
                            this.product1Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product3Rate2 =
                              res.data1[1].productSellingPrice;
                            this.product4Rate2 =
                              res.data1[2].productSellingPrice;

                            if (
                              this.product5Id ==
                              res.data1[3].productId
                            ) {
                              this.isProduct5 = true;
                              this.product5 =
                                res.data1[3].productName;
                              this.product5Rate2 =
                                res.data1[3].productSellingPrice;
                            } else {
                              if (
                                this.product6Id ==
                                res.data1[3]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[3].productName;
                                this.product6Rate2 =
                                  res.data1[3].productSellingPrice;
                              } else {
                              }
                            }
                          } else {
                            if (
                              this.product1Id ==
                              res.data1[0]
                                .productId &&
                              this.product3Id ==
                              res.data1[1]
                                .productId &&
                              this.product5Id ==
                              res.data1[2]
                                .productId
                            ) {
                              this.isProduct3 = true;
                              this.isProduct5 = true;
                              this.product1 =
                                res.data1[0].productName;
                              this.product3 =
                                res.data1[1].productName;
                              this.product5 =
                                res.data1[2].productName;
                              this.product1Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product3Rate2 =
                                res.data1[1].productSellingPrice;
                              this.product5Rate2 =
                                res.data1[2].productSellingPrice;

                              if (
                                this.product6Id ==
                                res.data1[3]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[3].productName;
                                this.product6Rate2 =
                                  res.data1[3].productSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                this.product1Id ==
                                res.data1[0]
                                  .productId &&
                                this.product4Id ==
                                res.data1[1]
                                  .productId &&
                                this.product5Id ==
                                res.data1[2]
                                  .productId
                              ) {
                                this.isProduct4 = true;
                                this.isProduct5 = true;
                                this.product1 =
                                  res.data1[0].productName;
                                this.product4 =
                                  res.data1[1].productName;
                                this.product5 =
                                  res.data1[2].productName;
                                this.product1Rate2 =
                                  res.data1[0].productSellingPrice;
                                this.product4Rate2 =
                                  res.data1[1].productSellingPrice;
                                this.product5Rate2 =
                                  res.data1[2].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data1[3]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[3].productName;
                                  this.product6Rate2 =
                                    res.data1[3].productSellingPrice;
                                } else {
                                }
                              } else {
                                if (
                                  this
                                    .product2Id ==
                                  res.data1[0]
                                    .productId &&
                                  this
                                    .product3Id ==
                                  res.data1[1]
                                    .productId &&
                                  this
                                    .product5Id ==
                                  res.data1[2]
                                    .productId
                                ) {
                                  this.isProduct3 = true;
                                  this.isProduct2 = true;
                                  this.isProduct5 = true;
                                  this.product2 =
                                    res.data1[0].productName;
                                  this.product3 =
                                    res.data1[1].productName;
                                  this.product5 =
                                    res.data1[2].productName;
                                  this.product2Rate2 =
                                    res.data1[0].productSellingPrice;
                                  this.product3Rate2 =
                                    res.data1[1].productSellingPrice;
                                  this.product5Rate2 =
                                    res.data1[2].productSellingPrice;

                                  if (
                                    this
                                      .product6Id ==
                                    res.data1[3]
                                      .productId
                                  ) {
                                    this.isProduct6 = true;
                                    this.product6 =
                                      res.data1[3].productName;
                                    this.product6Rate2 =
                                      res.data1[3].productSellingPrice;
                                  } else {
                                  }
                                } else {
                                  if (
                                    this
                                      .product2Id ==
                                    res
                                      .data1[0]
                                      .productId &&
                                    this
                                      .product4Id ==
                                    res
                                      .data1[1]
                                      .productId &&
                                    this
                                      .product5Id ==
                                    res
                                      .data1[2]
                                      .productId
                                  ) {
                                    this.isProduct4 = true;
                                    this.isProduct2 = true;
                                    this.isProduct5 = true;
                                    this.product2 =
                                      res.data1[0].productName;
                                    this.product4 =
                                      res.data1[1].productName;
                                    this.product5 =
                                      res.data1[2].productName;
                                    this.product2Rate2 =
                                      res.data1[0].productSellingPrice;
                                    this.product4Rate2 =
                                      res.data1[1].productSellingPrice;
                                    this.product5Rate2 =
                                      res.data1[2].productSellingPrice;

                                    if (
                                      this
                                        .product6Id ==
                                      res
                                        .data1[3]
                                        .productId
                                    ) {
                                      this.isProduct6 = true;
                                      this.product6 =
                                        res.data1[3].productName;
                                      this.product6Rate2 =
                                        res.data1[3].productSellingPrice;
                                    } else {
                                    }
                                  } else {
                                    if (
                                      this
                                        .product3Id ==
                                      res
                                        .data1[0]
                                        .productId &&
                                      this
                                        .product4Id ==
                                      res
                                        .data1[1]
                                        .productId &&
                                      this
                                        .product5Id ==
                                      res
                                        .data1[2]
                                        .productId
                                    ) {
                                      this.isProduct4 = true;
                                      this.isProduct3 = true;
                                      this.isProduct5 = true;
                                      this.product3 =
                                        res.data1[0].productName;
                                      this.product4 =
                                        res.data1[1].productName;
                                      this.product5 =
                                        res.data1[2].productName;
                                      this.product3Rate2 =
                                        res.data1[0].productSellingPrice;
                                      this.product4Rate2 =
                                        res.data1[1].productSellingPrice;
                                      this.product5Rate2 =
                                        res.data1[2].productSellingPrice;

                                      if (
                                        this
                                          .product6Id ==
                                        res
                                          .data1[3]
                                          .productId
                                      ) {
                                        this.isProduct6 = true;
                                        this.product6 =
                                          res.data1[3].productName;
                                        this.product6Rate2 =
                                          res.data1[3].productSellingPrice;
                                      } else {
                                      }
                                    } else {
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    if (res.data1.length == 5) {
                      if (
                        this.product1Id ==
                        res.data1[0].productId &&
                        this.product2Id ==
                        res.data1[1].productId &&
                        this.product3Id ==
                        res.data1[2].productId &&
                        this.product4Id ==
                        res.data1[3].productId
                      ) {
                        this.isProduct2 = true;
                        this.isProduct3 = true;
                        this.isProduct4 = true;
                        this.product1 =
                          res.data1[0].productName;
                        this.product2 =
                          res.data1[1].productName;
                        this.product3 =
                          res.data1[2].productName;
                        this.product4 =
                          res.data1[3].productName;
                        this.product1Rate2 =
                          res.data1[0].productSellingPrice;
                        this.product2Rate2 =
                          res.data1[1].productSellingPrice;
                        this.product3Rate2 =
                          res.data1[2].productSellingPrice;
                        this.product4Rate2 =
                          res.data1[3].productSellingPrice;

                        if (
                          this.product5Id ==
                          res.data1[4].productId
                        ) {
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[4].productName;
                          this.product5Rate2 =
                            res.data1[4].productSellingPrice;
                        } else {
                          if (
                            this.product6Id ==
                            res.data1[4].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[4].productName;
                            this.product6Rate2 =
                              res.data1[4].productSellingPrice;
                          } else {
                          }
                        }
                      } else {
                        if (
                          this.product1Id ==
                          res.data1[0].productId &&
                          this.product2Id ==
                          res.data1[1].productId &&
                          this.product3Id ==
                          res.data1[2].productId &&
                          this.product5Id ==
                          res.data1[3].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct3 = true;
                          this.isProduct5 = true;
                          this.product1 =
                            res.data1[0].productName;
                          this.product2 =
                            res.data1[1].productName;
                          this.product3 =
                            res.data1[2].productName;
                          this.product5 =
                            res.data1[3].productName;
                          this.product1Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product2Rate2 =
                            res.data1[1].productSellingPrice;
                          this.product3Rate2 =
                            res.data1[2].productSellingPrice;
                          this.product5Rate2 =
                            res.data1[3].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data1[4].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[4].productName;
                            this.product6Rate2 =
                              res.data1[4].productSellingPrice;
                          } else {
                          }
                        } else {
                          if (
                            this.product1Id ==
                            res.data1[0]
                              .productId &&
                            this.product2Id ==
                            res.data1[1]
                              .productId &&
                            this.product4Id ==
                            res.data1[2]
                              .productId &&
                            this.product5Id ==
                            res.data1[3].productId
                          ) {
                            this.isProduct2 = true;
                            this.isProduct4 = true;
                            this.isProduct5 = true;
                            this.product1 =
                              res.data1[0].productName;
                            this.product2 =
                              res.data1[1].productName;
                            this.product4 =
                              res.data1[2].productName;
                            this.product5 =
                              res.data1[3].productName;
                            this.product1Rate2 =
                              res.data1[0].productSellingPrice;
                            this.product2Rate2 =
                              res.data1[1].productSellingPrice;
                            this.product4Rate2 =
                              res.data1[2].productSellingPrice;
                            this.product5Rate2 =
                              res.data1[3].productSellingPrice;

                            if (
                              this.product6Id ==
                              res.data1[4].productId
                            ) {
                              this.isProduct6 = true;
                              this.product6 =
                                res.data1[4].productName;
                              this.product6Rate2 =
                                res.data1[4].productSellingPrice;
                            } else {
                            }
                          } else {
                            if (
                              this.product1Id ==
                              res.data1[0]
                                .productId &&
                              this.product3Id ==
                              res.data1[1]
                                .productId &&
                              this.product4Id ==
                              res.data1[2]
                                .productId &&
                              this.product5Id ==
                              res.data1[3]
                                .productId
                            ) {
                              this.isProduct3 = true;
                              this.isProduct4 = true;
                              this.isProduct5 = true;
                              this.product1 =
                                res.data1[0].productName;
                              this.product3 =
                                res.data1[1].productName;
                              this.product4 =
                                res.data1[2].productName;
                              this.product5 =
                                res.data1[3].productName;
                              this.product1Rate2 =
                                res.data1[0].productSellingPrice;
                              this.product3Rate2 =
                                res.data1[1].productSellingPrice;
                              this.product4Rate2 =
                                res.data1[2].productSellingPrice;
                              this.product5Rate2 =
                                res.data1[3].productSellingPrice;

                              if (
                                this.product6Id ==
                                res.data1[4]
                                  .productId
                              ) {
                                this.isProduct6 = true;
                                this.product6 =
                                  res.data1[4].productName;
                                this.product6Rate2 =
                                  res.data1[4].productSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                this.product2Id ==
                                res.data1[0]
                                  .productId &&
                                this.product3Id ==
                                res.data1[1]
                                  .productId &&
                                this.product4Id ==
                                res.data1[2]
                                  .productId &&
                                this.product5Id ==
                                res.data1[3]
                                  .productId
                              ) {
                                this.isProduct2 = true;
                                this.isProduct3 = true;
                                this.isProduct4 = true;
                                this.isProduct5 = true;
                                this.product2 =
                                  res.data1[0].productName;
                                this.product3 =
                                  res.data1[1].productName;
                                this.product4 =
                                  res.data1[2].productName;
                                this.product5 =
                                  res.data1[3].productName;
                                this.product2Rate2 =
                                  res.data1[0].productSellingPrice;
                                this.product3Rate2 =
                                  res.data1[1].productSellingPrice;
                                this.product4Rate2 =
                                  res.data1[2].productSellingPrice;
                                this.product5Rate2 =
                                  res.data1[3].productSellingPrice;

                                if (
                                  this
                                    .product6Id ==
                                  res.data1[4]
                                    .productId
                                ) {
                                  this.isProduct6 = true;
                                  this.product6 =
                                    res.data1[4].productName;
                                  this.product6Rate2 =
                                    res.data1[4].productSellingPrice;
                                } else {
                                }
                              } else {
                              }
                            }
                          }
                        }
                      }
                    } else {
                      if (res.data1.length == 6) {
                        if (
                          this.product1Id ==
                          res.data1[0].productId &&
                          this.product2Id ==
                          res.data1[1].productId &&
                          this.product3Id ==
                          res.data1[2].productId &&
                          this.product4Id ==
                          res.data1[3].productId &&
                          this.product5Id ==
                          res.data1[4].productId
                        ) {
                          this.isProduct2 = true;
                          this.isProduct3 = true;
                          this.isProduct4 = true;
                          this.product1 =
                            res.data1[0].productName;
                          this.product2 =
                            res.data1[1].productName;
                          this.product3 =
                            res.data1[2].productName;
                          this.product4 =
                            res.data1[3].productName;
                          this.product1Rate2 =
                            res.data1[0].productSellingPrice;
                          this.product2Rate2 =
                            res.data1[1].productSellingPrice;
                          this.product3Rate2 =
                            res.data1[2].productSellingPrice;
                          this.product4Rate2 =
                            res.data1[3].productSellingPrice;
                          this.isProduct5 = true;
                          this.product5 =
                            res.data1[4].productName;
                          this.product5Rate2 =
                            res.data1[4].productSellingPrice;

                          if (
                            this.product6Id ==
                            res.data1[5].productId
                          ) {
                            this.isProduct6 = true;
                            this.product6 =
                              res.data1[5].productName;
                            this.product6Rate2 =
                              res.data1[5].productSellingPrice;
                          } else {
                          }
                        } else {

                        }
                      } else {

                      }
                    }
                  }
                }
              }
            }
          } else {
            this.product1Rate2 = "please set rate";
            this.product2Rate2 = "please set rate";
            this.product3Rate2 = "please set rate";
            this.product4Rate2 = "please set rate";
            this.product5Rate2 = "please set rate";
            this.product6Rate2 = "please set rate";
          }
        } else {
          this.isNoRate = true;
        }
        this.cd.detectChanges()
      }
    });
  }
}
