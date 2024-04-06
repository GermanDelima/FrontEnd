import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { error } from 'console';
import { Usuario } from 'src/app/models/usuario';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-hacerca-de',
  templateUrl: './hacerca-de.component.html',
  styleUrls: ['./hacerca-de.component.css']
})
export class HacercaDeComponent implements OnInit {
  
  public usuario: Usuario | undefined; //creamos un usuario q tenga o venga vacio
  public editUsuario: Usuario | undefined; //editamos un user

  constructor(private headerService: HeaderService ) { } //instancionamos el service
  
  ngOnInit(): void {
    this.getUser();//oro metodo
    //this.editUsuario();//edit con modal
  }

  public getUser(): void{
    this.headerService.getUser().subscribe({
      next: (response: Usuario) =>{
        this.usuario=response;
      },
      error:(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }

}
