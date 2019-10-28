import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// COMPONENTS
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// MODULES
import { AngularMaterialModule } from './../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
