import { Component, OnDestroy, OnInit } from '@angular/core';
import { Education } from '../../models/education';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from '../../services/auth/login.service';
import { EducationService } from '../../services/education/education.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  educations: Education[] = [];
  education: Education | null = null;

  editEducationForm = this.formBuilder.group({
    instituto: ['', Validators.required],
    titEdu: ['', Validators.required],
    fechaInic: ['', Validators.required],
    fechaFin: ['', Validators.required],
    descEduc: ['', Validators.required],
    logoCertificado: ['', Validators.required]
  });

  addEducationForm = this.formBuilder.group({
    instituto: ['', Validators.required],
    titEdu: ['', Validators.required],
    fechaInic: ['', Validators.required],
    fechaFin: ['', Validators.required],
    descEduc: ['', Validators.required],
    logoCertificado: ['', Validators.required]
  });

  editMode = false;
  errorMessage = '';
  loggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private educationService: EducationService,
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
        console.log('User login status:', loggedIn);
      }
    );

    this.fetchEducationData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Envía una señal para completar el Subject
    this.destroy$.complete(); // Completa el Subject
  }

  fetchEducationData(): void {
    this.educationService.getEducation().subscribe({
      next: (educationArray: Education[]) => {
        this.educations = educationArray;
        if (educationArray.length > 0) {
          this.education = educationArray[0]; // Establecer el primer objeto educativo como la educación actual
        }
      },
      error: (errorData) => {
        console.error('Error al obtener datos de Education:', errorData);
        this.errorMessage = 'Error al cargar los datos de Education.';
      }
    });
  }

  saveSobreMiDetailsData(): void {
    if (this.editEducationForm.valid) {
      const updateEducation: Education = {
        id: this.education!.id,
        instituto: this.editEducationForm.value.instituto ?? '',
        titEdu: this.editEducationForm.value.titEdu ?? '',
        fechaInic: this.editEducationForm.value.fechaInic ?? '',
        fechaFin: this.editEducationForm.value.fechaFin ?? '',
        descEduc: this.editEducationForm.value.descEduc ?? '',
        logoCertificado: this.editEducationForm.value.logoCertificado ?? ''
      };

      this.educationService.updateEducation(updateEducation).subscribe({
        next: () => {
          console.log('Datos de Education actualizados con éxito');
          this.editMode = false;
          this.fetchEducationData();
        },
        error: (errorData) => {
          console.error('Error al actualizar los datos de Education:', errorData);
          this.errorMessage = errorData?.status === 403
            ? 'No tiene permisos para realizar esta acción.'
            : `Error: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  get educationLoginOn(): boolean {
    return this.loggedIn;
  }

  addEducation(): void {
    if (this.addEducationForm.valid) {
      const newEducation: Education = {
        id: 0, // El ID se generará en el servidor
        instituto: this.addEducationForm.value.instituto ?? '',
        titEdu: this.addEducationForm.value.titEdu ?? '',
        fechaInic: this.addEducationForm.value.fechaInic ?? '',
        fechaFin: this.addEducationForm.value.fechaFin ?? '',
        descEduc: this.addEducationForm.value.descEduc ?? '',
        logoCertificado: this.addEducationForm.value.logoCertificado ?? ''
      };

      this.educationService.addEducation(newEducation).subscribe({
        next: () => {
          console.log('Nueva educación agregada con éxito');
          this.fetchEducationData(); // Actualiza la lista de educaciones
          this.addEducationForm.reset(); // Restablece los valores del formulario
        },
        error: (errorData) => {
          console.error('Error al agregar una nueva educación:', errorData);
          this.errorMessage = `Error al agregar una nueva educación: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  deleteEducation(educationId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta educación?');

    if (confirmDelete) {
      this.educationService.deleteEducation(educationId).subscribe({
        next: () => {
          console.log('Educación eliminada con éxito');
          this.fetchEducationData(); // Actualiza la lista de educaciones
        },
        error: (errorData) => {
          console.error('Error al eliminar la educación:', errorData);
          this.errorMessage = `Error al eliminar la educación: ${errorData.message}`;
        }
      });
    }
  }

  editEducation(education: Education): void {
    this.education = education;
    this.editEducationForm.patchValue({
      instituto: education.instituto,
      titEdu: education.titEdu,
      fechaInic: education.fechaInic,
      fechaFin: education.fechaFin,
      descEduc: education.descEduc,
      logoCertificado: education.logoCertificado
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.fetchEducationData();
  }

  private scrollToSection(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
