import { Component, OnDestroy, OnInit } from '@angular/core';
import { Diploma } from '../../models/diploma';
import { FormBuilder, Validators } from '@angular/forms';
import { DiplomaService } from '../../services/diploma/diploma.service';
import { LoginService } from '../../services/auth/login.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.css']
})
export class DiplomaComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  diplomas: Diploma[] = [];
  diploma: Diploma | null = null;
  
  editDiplomaForm = this.formBuilder.group({
    logo: ['', Validators.required]
  });

  addDiplomaForm = this.formBuilder.group({
    logo: ['', Validators.required]
  });

  editMode = false;
  errorMessage = '';
  loggedIn = false; // Variable para almacenar el estado de login

  constructor(
    private formBuilder: FormBuilder, 
    private diplomaService: DiplomaService, 
    private loginService: LoginService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        this.scrollToSection(fragment);
      }
    });

    this.loginService.userLoginOn.pipe(takeUntil(this.destroy$)).subscribe(
      (loggedIn) => {
        this.loggedIn = loggedIn;
      }
    );

    this.fetchDiplomaData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Envía una señal para completar el Subject
    this.destroy$.complete(); // Completa el Subject
  }

  fetchDiplomaData(): void {
    this.diplomaService.getDiploma().pipe(takeUntil(this.destroy$)).subscribe({
      next: (diplomaArray: Diploma[]) => {
        this.diplomas = diplomaArray;
        if (diplomaArray.length > 0) {
          this.diploma = diplomaArray[0]; // Establecer el primer objeto diploma como el actual
        }
      },
      error: (errorData) => {
        console.error('Error al obtener datos de Diploma:', errorData);
        this.errorMessage = 'Error al cargar los datos de Diploma.';
      }
    });
  }

  saveDiplomaData(): void {
    if (this.editDiplomaForm.valid) {
      const updateDiploma: Diploma = {
        id: this.diploma!.id,
        logo: this.editDiplomaForm.value.logo ?? ''
      };

      this.diplomaService.updateDiploma(updateDiploma).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Datos de Diploma actualizados con éxito');
          this.editMode = false;
          this.fetchDiplomaData();
        },
        error: (errorData) => {
          console.error('Error al actualizar los datos del diploma:', errorData);
          this.errorMessage = errorData.status === 403
            ? 'No tiene permisos para realizar esta acción.'
            : `Error: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  get diplomaLoginOn(): boolean {
    return this.loggedIn;
  }

  addDiploma(): void {
    if (this.addDiplomaForm.valid) {
      const newDiploma: Diploma = {
        id: 0, // El ID se generará en el servidor
        logo: this.addDiplomaForm.value.logo ?? ''
      };

      this.diplomaService.addDiploma(newDiploma).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Nuevo diploma agregado con éxito');
          this.fetchDiplomaData(); // Actualiza la lista de diplomas
          this.addDiplomaForm.reset(); // Restablece los valores del formulario
        },
        error: (errorData) => {
          console.error('Error al agregar el diploma:', errorData);
          this.errorMessage = `Error al agregar el diploma: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  deleteDiploma(diplomaId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este diploma?');

    if (confirmDelete) {
      this.diplomaService.deleteDiploma(diplomaId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Diploma eliminada con éxito');
          this.fetchDiplomaData(); // Actualiza la lista de diplomas
        },
        error: (errorData) => {
          console.error('Error al eliminar el diploma:', errorData);
          this.errorMessage = `Error al eliminar el diploma: ${errorData.message}`;
        }
      });
    }
  }

  editDiploma(diploma: Diploma): void {
    this.diploma = diploma;
    this.editDiplomaForm.patchValue({
      logo: diploma.logo
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.fetchDiplomaData();
  }

  private scrollToSection(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
