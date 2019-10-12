import { Component, OnInit } from "@angular/core";
import { SearchModel, StayPeriod } from "../models/searchModel";
import { HotelSearchService } from "../services/searchService";
import { error } from "@angular/compiler/src/util";

@Component({
  selector: "app-hotel-search",
  templateUrl: "./hotel-search.component.html",
  styleUrls: ["./hotel-search.component.scss"]
})
export class HotelSearchComponent implements OnInit {
  public searchModel: SearchModel = new SearchModel();
  private stayPeriod: StayPeriod = new StayPeriod();
  private guest: number = 0;
  private location = "";
  private pageNumber = 1;
  private pageSize = 25;
  private hotelsData;
  private submitClicked = false;

  constructor(private _hotelSearchService: HotelSearchService) {
    this.searchModel.stayPeriod = this.stayPeriod;
  }

  ngOnInit() {}

  searchHotels() {
  
    let dateValid = true;
    this.hotelsData=  null;
    if (
      this.searchModel.stayPeriod.start == "" ||
      this.searchModel.stayPeriod.start == undefined ||
      this.searchModel.stayPeriod.end == "" ||
      this.searchModel.stayPeriod.end == undefined
    ) {
      dateValid = false;
      alert("Please enter valid start and end  date");
    }else{
      if( this.searchModel.stayPeriod.start < new Date().toISOString()){
        dateValid = false;
        alert("start date should be grater than current date")
      }
      if(this.searchModel.stayPeriod.end < this.searchModel.stayPeriod.start){
        dateValid = false;
        alert("End date should be grater than start date")
      }

    }


    
    if (dateValid ) {
      this.submitClicked = true;
      let startOriginal =  this.searchModel.stayPeriod.start;
      let endOriginal =  this.searchModel.stayPeriod.end;
      let start = this.searchModel.stayPeriod.start.split("-");
      this.searchModel.stayPeriod.start =
        start[1] + "-" + start[2] + "-" + start[0];
      let end = this.searchModel.stayPeriod.end.split("-");
      this.searchModel.stayPeriod.end = end[1] + "-" + end[2] + "-" + end[0];
   
       let occupants = [];
      for(let i = 0 ;i < this.guest;i++){
        let obj = {
            type: "Adult",
            age: 25
          }
          occupants.push(obj);
      }
      
      this.searchModel.roomOccupancies = [
        {
          occupants: [ {
            type: "Adult",
            age: 25
          }]
        }
      ];

      this.searchModel.bounds = {
        circle: {
          center: {
            lat: 49.0097, // Selected location lat long
            long: 2.5479
          },
          radiusKm: 50.5
        }
      };

      this._hotelSearchService.searchForHotels(this.searchModel).subscribe(
        data => {
          this.searchModel.stayPeriod.start = startOriginal;
          this.searchModel.stayPeriod.end = endOriginal;
          if (data != undefined && data != null) {
            this.checkAPIStatus(data.sessionId);
          } else {
            alert("Failed to retrive session id");
          }
        },
        error => {
          alert("Failed to retrive Search Init response");
        }
      );
    }
  }

  checkAPIStatus(sessionId) {
    let obj = {
      "sessionId":sessionId
    }
    this._hotelSearchService.getSearchAPIStatus(obj).subscribe(
      data => {
        if (data != undefined && data != null) {
          if(data.status.toLowerCase() === "complete"){
            this.getSearchList(sessionId);
          }else{
            setTimeout(()=>{
              this.checkAPIStatus(sessionId);
            },5000);
            // alert("Search Api status is not completed");
          }
        } else {
          alert("Failed to retrive Api status");
        }
      },
      error => {
        alert("Failed to retrive Api status response");
      }
    );
  }


  getSearchList(sessionId){
    let obj = {
      "sessionId": sessionId,
      "paging": {
         "pageNo": this.pageNumber,
         "pageSize": this.pageSize,
         "orderBy": "price asc, rating desc"
      },
      "optionalDataPrefs": [
         "All"
      ],
      "currency": "USD",
      "contentPrefs": [
         "Basic",
         "Activities",
         "Amenities",
         "Policies",
         "AreaAttractions",
         "Descriptions",
         "Images",
         "CheckinCheckoutPolicy",
         "All"
      ],
      "filters": {
         "minHotelPrice": 1,
         "maxHotelPrice": 10000,
         "minHotelRating": 1,
         "maxHotelRating": 5,
         "hotelChains": [
            "Novotel",
            "Marriott",
            "Hilton",
            "Accor"
         ],
         "allowedCountry": "FR"
      }
   }
   
   this._hotelSearchService.getSearchList(obj).subscribe(
    data => {
      this.submitClicked = false;
      if (data != undefined && data != null) {
        this.hotelsData=  data;
        for(let i =0 ; i< this.hotelsData.hotels.length;i++){
         let data = [];
          for(let j =0;j<parseInt(this.hotelsData.hotels[i].rating );j++){
            data.push(j);
          }
          this.hotelsData.hotels[i].ratingData = data;
        }
      } else {
        alert("No Hotels Found");
      }
    },
    error => {
      alert("Failed to retrive Search list response");
    }
  );
   
  }

}
