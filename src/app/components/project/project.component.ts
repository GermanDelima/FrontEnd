import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../models/project';
import { ProjectService } from '../../services/project/project.service';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  projects: Project[] = [];
  project: Project | null = null;

  editProjectForm: FormGroup;
  addProjectForm: FormGroup;
  editMode = false;
  errorMessage = '';
  loggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private loginService: LoginService
  ) {
    this.editProjectForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInic: ['', Validators.required],
      fechaFin: ['', Validators.required],
      img: ['', Validators.required],
      evidencia: ['', Validators.required]
    });

    this.addProjectForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInic: ['', Validators.required],
      fechaFin: ['', Validators.required],
      img: ['', Validators.required],
      evidencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProjectData();
    this.subscribeToLogin();
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Envía una señal para completar el Subject
    this.destroy$.complete(); // Completa el Subject
  }

  private subscribeToLogin(): void {
    this.loginService.userLoginOn.pipe(takeUntil(this.destroy$)).subscribe(
      (loggedIn) => {
        this.loggedIn = loggedIn;
      }
    );
  }

  private fetchProjectData(): void {
    this.projectService.getProject().pipe(takeUntil(this.destroy$)).subscribe({
      next: (projectArray: Project[]) => {
        this.projects = projectArray;
        if (projectArray.length > 0) {
          this.project = projectArray[0];
        }
      },
      error: (errorData) => {
        console.error('Error al obtener datos de proyectos:', errorData);
        this.errorMessage = 'Error al cargar los datos de proyectos.';
      }
    });
  }

  saveProjectDetailsData(): void {
    if (this.editProjectForm.valid) {
      const updateProject: Project = {
        id: this.project!.id,
        nombre: this.editProjectForm.value.nombre ?? '',
        descripcion: this.editProjectForm.value.descripcion ?? '',
        fechaInic: this.editProjectForm.value.fechaInic ?? '',
        fechaFin: this.editProjectForm.value.fechaFin ?? '',
        img: this.editProjectForm.value.img ?? '',
        evidencia: this.editProjectForm.value.evidencia ?? ''
      };

      this.projectService.updateProject(updateProject).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Datos de Proyecto actualizados con éxito');
          this.editMode = false;
          this.fetchProjectData();
        },
        error: (errorData) => {
          console.error('Error al actualizar los datos de Proyecto:', errorData);
          this.errorMessage = errorData.status === 403
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

  addProject(): void {
    if (this.addProjectForm.valid) {
      const newProject: Project = {
        id: 0, // El ID se generará en el servidor
        nombre: this.addProjectForm.value.nombre ?? '',
        descripcion: this.addProjectForm.value.descripcion ?? '',
        fechaInic: this.addProjectForm.value.fechaInic ?? '',
        fechaFin: this.addProjectForm.value.fechaFin ?? '',
        img: this.addProjectForm.value.img ?? '',
        evidencia: this.addProjectForm.value.evidencia ?? ''
      };

      this.projectService.addProject(newProject).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Nuevo proyecto agregado con éxito');
          this.fetchProjectData(); // Actualiza la lista de proyectos
          this.addProjectForm.reset(); // Restablece los valores del formulario
        },
        error: (errorData) => {
          console.error('Error al agregar un nuevo proyecto:', errorData);
          this.errorMessage = `Error al agregar un nuevo proyecto: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  deleteProject(projectId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este proyecto?');

    if (confirmDelete) {
      this.projectService.deleteProject(projectId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Proyecto eliminado con éxito');
          this.fetchProjectData(); // Actualiza la lista de proyectos
        },
        error: (errorData) => {
          console.error('Error al eliminar el proyecto:', errorData);
          this.errorMessage = errorData.status === 403
            ? 'No tiene permisos para eliminar este proyecto.'
            : `Error al eliminar el proyecto: ${errorData.message}`;
        }
      });
    }
  }

  editProject(project: Project): void {
    this.project = project;
    this.editProjectForm.patchValue({
      nombre: project.nombre,
      descripcion: project.descripcion,
      fechaInic: project.fechaInic,
      fechaFin: project.fechaFin,
      img: project.img,
      evidencia: project.evidencia
    });
    this.editMode = false;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.fetchProjectData();
  }
}
