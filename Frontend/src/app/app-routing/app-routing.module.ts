import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { UserComponent } from '../user/user.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AppRoutingModule { }
export const routes:Routes=[
  {
    path:'login',
    component:LoginComponent,
  },
  {
    path:'user',
    component:UserComponent,
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  }
]

