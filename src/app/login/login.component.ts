import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Globals } from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user_mail:string;
  user_password:string;
  success:boolean=false;
  error:boolean=false;
  constructor(private router: Router,public globals: Globals) { }

  ngOnInit() {
  }

  login(){
    this.error=false;
    this.success=false;
    //alert("Checking user");
    if (this.user_mail in this.globals.users){
      if (this.globals.users[this.user_mail].password==this.user_password){
        this.success=true;
        this.globals.actual_user=this.globals.users[this.user_mail];
        setTimeout(() => {
          this.router.navigate(['/main']);
        },
        1000);
      }
      else{
        this.error=true;
      }
    }
    else{
      this.error=true;
    }
    
  }

}
