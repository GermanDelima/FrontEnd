import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { error } from 'console';
import { Education } from 'src/app/models/education';
import { EducationService } from 'src/app/services/education.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  
  public educations: Education[] = [];//array que rrecorre el fronend
  
  constructor(private educationService: EducationService) { }

  ngOnInit(): void {
    this.getEducation();
  }

  public getEducation():void{
    this.educationService.getEducation().subscribe({
      next:(Response: Education[]) =>{
        this.educations= Response;
      },
      error:(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }
}
