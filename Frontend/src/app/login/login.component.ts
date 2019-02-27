import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
public account;
public canshow:boolean;
public invalid_error:boolean;
public verification_error:boolean;
  constructor(private token:TokenService,private route:Router) { }

  fetch_account(private_key)
 {
   let instance=this;
   instance.invalid_error=false;
   if(private_key.length == 64)
   {
     instance.token.set_private_key(private_key).then(is_valid => {       
       if(is_valid){
           instance.account = instance.token.account_address;
           instance.canshow=true;
       }
     });
   }
   else
   {
    instance.invalid_error=true;
  }
 }

 validate()
 {
   let instance=this;
   instance.verification_error=false;
   if((document.getElementById('verify') as HTMLInputElement).checked != false )
   {
    instance.route.navigate(['user']);
   }
   else
   {
    instance.verification_error=true;
   }
 }
  ngOnInit() {
  }

}
