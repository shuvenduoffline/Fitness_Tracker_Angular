import { Component, ViewChild, ElementRef, OnInit, AfterViewInit ,Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from '../_services/index';

export class Contact {
  constructor(
    public firstname: string,
    public lastname: string,
    public phonenumber: number,
    public email: string,
    public message: string
  ) { }
}
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent implements OnInit {
  @Output() contactdata = new EventEmitter<Contact>();
  contactForm: FormGroup;
  public obj: any = {};
  private formfeedback:string = "";

  constructor(private fb: FormBuilder, private userService: UserService) { }

   //for auto focus firstname input field on page load 
   @ViewChild("firstname",{static: false}) _el: ElementRef;

   setFocus() {
    this._el.nativeElement.focus();
   }
   ngAfterViewInit() {
     this._el.nativeElement.focus();
   }

  ngOnInit() {
    this.contactForm = this.fb.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      phonenumber: ["", [Validators.required]],
      email: ["", [Validators.required,Validators.pattern("[^ @]*@[^ @]*")]],
      message:["",[Validators.required]]
    });
  }

  onSubmit() {
    this.obj = { ...this.contactForm.value, ...this.obj };

    if (this.contactForm.valid) {
      this.contactdata.emit(
        new Contact(
          this.contactForm.value.firstname,
          this.contactForm.value.lastname,
          this.contactForm.value.phonenumber,
          this.contactForm.value.email,
          this.contactForm.value.message
        )
      );

      this.formfeedback = "Submitting...";
      //post data to rest api
          this.userService.postcontactusdata(this.contactForm.value)
          .toPromise()
          .then(responce => {
            this.formfeedback = "Submitted Successfully!!";

            //rset the from state
            this.contactForm.reset();
          })
          .catch(err =>{
           // console.log(err);
            this.formfeedback = "Something went wrong!!";
          });
    }else{
      this.formfeedback = "Invalid Inputs !";
    }
    
    //reset the feedback form massage after 3sec
    setTimeout(() => {
        this.formfeedback = "";
      }, 3000);

  }

}
