import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new Headers({ "Content-Type": "application/json" })
};

@Injectable({ providedIn: 'root' })
export class UserService {

    public static BaseUrl = "http://localhost:6565/";

    constructor(private http: Http) { }


    postfitnessdata(data){
      return this.http.post(UserService.BaseUrl+'allfriends',data,httpOptions).pipe(map((response: Response) => response.json()));
    }

    //to get single appointment data
    getappointmentdetails(id:number){
      return this.http.get(UserService.BaseUrl+'allfriends/'+id,httpOptions).pipe(map((response: Response) => response.json()));
    }

    //get all the appointments details
    getfitnessdata() {
      return this.http.get(UserService.BaseUrl+'allfriends',httpOptions).pipe(map((response: Response) => response.json()));
    }

    // delete an appointment based on id number
    deletefitnessdata(id:number){
      return this.http.delete(UserService.BaseUrl+'allfriends/'+id);
    }

    //update single appointment
    updatefitnessdata(id,data){
      //todo uodate it
      return this.http.put(UserService.BaseUrl+'allfriends/'+id,data,httpOptions);
    }

    //post contactt us data in server
    postcontactusdata(data){
     return this.http.post(UserService.BaseUrl+'contactus',data,httpOptions).pipe(map((response: Response) => response.json()));
    }
}