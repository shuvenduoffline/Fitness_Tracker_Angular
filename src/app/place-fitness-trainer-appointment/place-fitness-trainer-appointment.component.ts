import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from '../_services/index';
import { ActivatedRoute, Router } from '@angular/router';


export class Fitness {
  constructor(
    public inr: number,
    public paisa: number,
    public streetaddress: string,
    public city: string,
    public state: string,
    public country: string,
    public pincode: number,
    public phonenumber: number,
    public email: string,
    public firstname:string,
    public lastname: string,
    public age:number,
    public trainerpreference: string,
    public physiotherapist: string,
    public packages: string
  ) { }
}

@Component({
  selector: 'app-place-fitness-trainer-appointment',
  templateUrl: './place-fitness-trainer-appointment.component.html'
  
})
export class PlaceFitnessTrainerAppointmentComponent implements OnInit {

  

  fitnessForm: FormGroup;
  private formfeedback : string = "";
  private pageheading : string = "Place Appointment";

  //use for edit purpose
  private isedit : boolean = false;
  private id : number;
  
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }
  

  //for auto focus firstname page open
  @ViewChild("firstname",{static: false}) _el: ElementRef;

  setFocus() {
   this._el.nativeElement.focus();
  }
  ngAfterViewInit() {
    this._el.nativeElement.focus();
  }

  ngOnInit() {
    
    this.fitnessForm = this.fb.group({
  //first name last name only character allowe
    firstname: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
    lastname: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],

  //phone number is only digit and 10 digit length
    phonenumber: ["", [Validators.required, Validators.pattern('[0-9]{10}')]],
    email: ["", [Validators.required,Validators.pattern("[^ @]*@[^ @]*")]],

  //address
    streetaddress: ["",[Validators.required]],
    city: ["",[Validators.required]],
    state: ["",[Validators.required]],
    country: ["",[Validators.required]],

  //pin code 6 digit strat with 1-9
    pincode: ["",[Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],

  //age allowed (18-60)
    age:["",[Validators.required, Validators.min(19),Validators.max(59)]],

    //radio button are set to some deafult values
    trainerpreference: ["No Preference",[Validators.required]],
    physiotherapist: ["no",[Validators.required]],
    packages: ["500",[Validators.required]],
    inr: ["",[Validators.required]],
    paisa : ["",[Validators.required]]
  });

  //check if its edit now
  this.activatedRoute.params.subscribe(params => {
    
    //if param present then its in edit mode now
    if(params['id']){
        this.id = params['id'];
        //feth data and fill the form
        this.getappointmentdetails();

        //change header
        this.pageheading = "Edit Appointment";

        //make the form edit from
        this.isedit = true;
    }
    });

  }

  getappointmentdetails() {
    this.userService.getappointmentdetails(this.id).subscribe(responce => {
        //remove the id field
        delete responce['id'];
       
        //set values in the form
        this.fitnessForm.setValue(responce);
    },
    error => {
     // console.log(error);
     this.pageheading = "Someting went wrong!!";

     //navigate to view appointment page
     this.router.navigateByUrl('view-appointment');

    }
    );
    
  }

  onSubmit() {

    //set the inr  and paisa data 
    this.setInrPrice();

    //if from is valid post the data
    if(this.fitnessForm.valid){
      //todo post data to server
      //post data to rest api
      //if its now in edit mode then update data with rest api
      if(this.isedit){
          this.formfeedback = "Updating appointment..";
          this.userService.updatefitnessdata(this.id,this.fitnessForm.value)
          .toPromise()
          .then(responce => {

            //console.log(responce);
            this.formfeedback = "Updated Successfully!!";

            //navigate to view appoinments page
            this.router.navigateByUrl("view-appointment");
          })
          .catch(error => {

           // console.log(error);
            this.formfeedback = "Something went wrong!!";
          });

      }else{
        this.formfeedback = "Submitting appointment ...";
        this.userService.postfitnessdata(this.fitnessForm.value)
        .toPromise()
        .then(responce => {
         // console.log(responce);
          this.formfeedback = "Submitted Successfully!!";
  
          //rset the from state
          this.fitnessForm.reset();
          

          //reset the radio buttons
          this.fitnessForm.controls.trainerpreference.setValue("No Preference");
          this.fitnessForm.controls.physiotherapist.setValue("no");
          this.fitnessForm.controls.packages.setValue("500");
          
        })
        .catch(err =>{
          //console.log(err);
          this.formfeedback = "Something went wrong!!";
        });

      }
   
    }else
      {
        this.formfeedback = "Invalid Inputs !";
      }

        //reset the feedback form massage after 3sec
        setTimeout(() => {
          this.formfeedback = "";
         }, 3000);    
    
  }

  //func to set inr and paisa based on the selected packages
  setInrPrice(){
    let inr = 0;
    let paisa = 0;

    //set price value based on the package
    if(this.fitnessForm.value.packages === '500')
    {
      inr = inr + 500;
    }else if(this.fitnessForm.value.packages === '1000'){
      inr = inr + 1000;
    }else{
      inr = inr + 2000;
    }

    //add 500 inr if physiotherapist choosen yes
    if(this.fitnessForm.value.physiotherapist === 'yes')
    {
      inr = inr + 500;
      paisa = 50;
    }

    //set thoses values in form
    this.fitnessForm.controls.inr.setValue(inr);
    this.fitnessForm.controls.paisa.setValue(paisa);

  }
    
}
