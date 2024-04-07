import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  public editEducation: Education  | undefined;
  public deleteEducation: Education  | undefined;

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



  public onOpenModal(mode: String, education?: Education):void{
    const container=document.getElementById('main-container');
    const button=document.createElement('button');
    button.style.display='none';
    button.setAttribute('data-toggle', 'modal');
    if(mode==='add'){
      button.setAttribute('data-target', '#addEducationModal');
    }else if(mode==='delete'){
      this.deleteEducation=education;
      button.setAttribute('data-target','#deleteEducationModal')
    }else if(mode==='edit'){
      this.editEducation=education;
      button.setAttribute('data-target','#editEducationModal')
    }

    container?.appendChild(button);
    button.click();
  }
  public onAddEducation(addFomr: NgForm){
    document.getElementById('add-education-form')?.click();
    this.educationService.addEducation(addFomr.value).subscribe({
      next: (response:Education) =>{
        console.log(response);
        this.getEducation();
        addFomr.resetForm();
      },
      error:(error:HttpErrorResponse)=>{
        alert(error.message);
        addFomr.reset();
      }
    })
  }
  public onUpdateEducation(education: Education){
    this.editEducation=education;
    document.getElementById('add-education-form')?.click();
    this.educationService.updateEducation(education).subscribe({
      next: (response:Education) =>{
        console.log(response);
        this.getEducation();
        
      },
      error:(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }

  public onDeleteEducation(id: number):void{
    
    this.educationService.deleteEducation(id).subscribe({
      next: (response:void) =>{
        console.log(response);
        this.getEducation();
        
      },
      error:(error:HttpErrorResponse)=>{
        alert(error.message);
      }
    })
  }
}
