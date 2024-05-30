import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Experiencia } from 'src/app/models/experiencia';
import { ExperienciaService } from 'src/app/services/experiencia.service';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.css'
})
export class ExperienciaComponent implements OnInit{
 
  @ViewChild('editExperienciaModal') editExperienciaModal!: ElementRef;
  public experiencia: Experiencia[] = [];
  public editExperiencia: Experiencia = { id: 0, empresa: '',  puesto: '', logo: '', fechaInic: 0, fechaFin: 0, descActi: ''};
  public deleteExperiencia: Experiencia | undefined;
  public newExperiencia: Experiencia = { id: 0, empresa: '', puesto: '', logo: '',fechaInic: 0, fechaFin: 0, descActi: ''};
  public indices: number[] = [];

   // Inyecta el servicio en tu constructor
   constructor( private experienciaService: ExperienciaService, private modalService: NgbModal, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.getExperiencia();
  }


  public getExperiencia(): void {
    this.experienciaService.getExperiencia().subscribe({
      next: (response: Experiencia[]) => {
        this.experiencia = response;
        this.indices = Array.from(Array(response.length).keys());
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onOpenModal(mode: string, experiencia?: Experiencia): void {
    if (mode === 'add') {
      this.newExperiencia = { id: 0, empresa: '',  puesto: '', logo: '', fechaInic: 0, fechaFin: 0, descActi: '' };
    } else if (mode === 'edit') {
      this.editExperiencia = experiencia ? { ...experiencia } : { id: 0, empresa: '',  puesto: '', logo: '', fechaInic: 0, fechaFin: 0, descActi: '' };
    } else if (mode === 'delete') {
      this.deleteExperiencia = experiencia;
    }
  }



  public onAddExperiencia(addForm: NgForm): void {
    this.experienciaService.addExperiencia(this.newExperiencia).subscribe({
      next: (response: Experiencia) => {
        console.log(response);
        this.getExperiencia(); //me añade al toque la experiencia me trae lo que se añadio sin recargar la pa
        addForm.reset(); //resetea los campos
        
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }

      
    });
  }  


  public onDeleteExperiencia(experienciaId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que quieres borrar la experiencia?');
    if (confirmDelete) {
      this.experienciaService.deleteExperiencia(experienciaId).subscribe({
        next: () => {
          console.log('Experiencia eliminada correctamente');
          this.getExperiencia();
          
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);

        }
        
      });
      
    }
  }  

  public onEditExperiencia(experiencia: Experiencia): void {
    this.editExperiencia = experiencia;
  }


  public onUpdateExperiencia(editForm: NgForm): void {
    if (editForm.valid) {
      this.experienciaService.updateExperiencia(this.editExperiencia).subscribe({
        next: (response: Experiencia) => {
          console.log(response);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);

        }
      });
    }
  }  


}
