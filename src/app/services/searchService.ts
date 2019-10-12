import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { API_CONSTANTS } from "../constants/api.constants";

@Injectable({
  providedIn: "root"
})
export class HotelSearchService {
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "oski-tenantId": "Demo"
    })
  };

  constructor(private http: HttpClient) {}

  searchForHotels(body: any) {
    return this.http
      .post<any>(API_CONSTANTS.SEARCH_INIT, body, this.httpOptions)
      .pipe();
  }

  getSearchAPIStatus(body: any) {
    return this.http
      .post<any>(API_CONSTANTS.SEARCH_STATUS, body, this.httpOptions)
      .pipe();
  }

  getSearchList(body: any) {
    return this.http
      .post<any>(API_CONSTANTS.SEARCH_LIST, body, this.httpOptions)
      .pipe();
  }
}
