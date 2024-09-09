import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/LoginRequest';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError:string = "";
  loginForm=this.formBuilder.group({
    username:['', [Validators.required,Validators.email]],
    password:['',[Validators.required]],
  })

constructor(private formBuilder:FormBuilder, private router:Router, private loginService:LoginService) { }

  ngOnInit(): void{

  }

//pertenece al mensaje de error que queremos mostrar email 
get email(){
  return this.loginForm.controls.username;
}
//pertenece al mensaje de error que queremos mostrar password
get password(){
  return this.loginForm.controls.password;
}


login(){
  if(this.loginForm.valid){
      //llama al servicio de login
    this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
      next: (userData) => {
        //console.log(userData);
      },
      error: (errorData) => {
        console.error(errorData);
        this.loginError=errorData;
      },
      complete: () => {
        console.info("Login completo");
        //una vez que llama al servicio inicia sesion
        this.router.navigateByUrl('/inicio');
        this.loginForm.reset();
      }
    });
  }else{   
    this.loginForm.markAllAsTouched();
  }
}

  //Tooltip
  tooltipText: string = '';
  tooltipVisible: boolean = false;

  showTooltip(event: MouseEvent, text: string): void {
    this.tooltipText = text;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

}


