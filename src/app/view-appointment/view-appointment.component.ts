import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html'
})
export class ViewAppointmentComponent implements OnInit {

  private appointments =[];
  private isloaded: boolean = false;
  private pagemassage: string = "Loading ...";
  
  constructor(private userService : UserService,private router: Router) { }

  

  ngOnInit() {
    this.getfitness();
  }
  
  getfitness() {

    //fetch the data from rest api and display
    this.userService.getfitnessdata().subscribe(responce => {
      this.appointments = responce;
      this.isloaded = true;
    },
    error =>{
      // console.log(error);
      this.isloaded = false;
      this.pagemassage = "Unable to load data!";
    })
  }

  editAppointment(id:number){
    //navigate to edit page passs the id of the appoinment to be edited
    this.router.navigateByUrl(`place-fitness-trainer-appointment/edit/${id}`);
  }
  

  deleteAppointment(id:number,index:number){
    //delete data from rest api
    const objtodelete = this.appointments[index];

    //set all visiable attribute to deleted
    this.changeobjvalue(index,"Deleting..")

    //delete form the rest api
    this.userService.deletefitnessdata(id).subscribe(response => {
     // console.log("Responce : ", response);
     this.changeobjvalue(index,"Deleted");

     setTimeout(() => {
      this.appointments = this.appointments.filter(appointment => appointment.id !== id);
     }, 1000);
      
    },
    error => {
      //someting went wrong!
      console.log(error);
      this.changeobjvalue(index,"");
      this.appointments[index].packages = "Someting went wrong!";

      //restore the object after 1 second time

      setTimeout(() => {
        this.appointments[index] = objtodelete;
       }, 1000);
    }
    );
  }

  //change object values 
  changeobjvalue(index,massage){
    this.appointments[index].firstname = massage;
    this.appointments[index].lastname = "";
    this.appointments[index].streetaddress = massage;
    this.appointments[index].city = massage;
    this.appointments[index].phonenumber = massage;
    this.appointments[index].packages = massage;
    this.appointments[index].trainerpreference = massage;
  }

}
