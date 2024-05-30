import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Education } from 'src/app/models/education';
import { EducationService } from 'src/app/services/education.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  @ViewChild('editEducationModal') editEducationModal!: ElementRef;
  public educations: Education[] = [];
  public editEducation: Education = { id: 0, titEdu: '', fechaInic: 0, fechaFin: 0, descEduc: '', logoEduc: '', logoCertificado: '', instituto: '' };
  public deleteEducation: Education | undefined;
  public newEducation: Education = { id: 0, titEdu: '', fechaInic: 0, fechaFin: 0, descEduc: '', logoEduc: '', logoCertificado: '', instituto: ''};
  public indices: number[] = [];
  
  // Inyecta el servicio en tu constructor
  constructor( private educationService: EducationService, private modalService: NgbModal, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.getEducation();
  }

  public getEducation(): void {
    this.educationService.getEducation().subscribe({
      next: (response: Education[]) => {
        this.educations = response;
        this.indices = Array.from(Array(response.length).keys());
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onOpenModal(mode: string, education?: Education): void {
    if (mode === 'add') {
      this.newEducation = { id: 0, titEdu: '', fechaInic: 0, fechaFin: 0, descEduc: '', logoEduc: '', logoCertificado: '', instituto: '' };
    } else if (mode === 'edit') {
      this.editEducation = education ? { ...education } : { id: 0, titEdu: '', fechaInic: 0, fechaFin: 0, descEduc: '', logoEduc: '', logoCertificado: '', instituto: '' };
    } else if (mode === 'delete') {
      this.deleteEducation = education;
    }
  }

 

  public onAddEducation(addForm: NgForm): void {
    this.educationService.addEducation(this.newEducation).subscribe({
      next: (response: Education) => {
        console.log(response);
        this.getEducation(); //me añade al toque la educacion me trae lo que se añadio sin recargar la pa
        addForm.reset(); //resetea los campos
        
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }

      
    });
  }
  

  public onDeleteEducation(educationId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que quieres borrar la educación?');
    if (confirmDelete) {
      this.educationService.deleteEducation(educationId).subscribe({
        next: () => {
          console.log('Educación eliminada correctamente');
          this.getEducation();
          
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);

        }
        
      });
      
    }
  }

  public onEditEducation(education: Education): void {
    this.editEducation = education;
  }

  public onUpdateEducation(editForm: NgForm): void {
    if (editForm.valid) {
      this.educationService.updateEducation(this.editEducation).subscribe({
        next: (response: Education) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);

        }
      });
    }
  }
}


