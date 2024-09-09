import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Sobremi } from '../../models/sobremi';
import { SobremiService } from '../../services/sobremi/sobremi.service';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-sobremi',
  templateUrl: './sobremi.component.html',
  styleUrls: ['./sobremi.component.css']
})
export class SobremiComponent implements OnInit, OnDestroy {
  sobremi: Sobremi | null = null;
  registerForm = this.formBuilder.group({
    fotoDelPerfil: ['', Validators.required],
    fotoDePortada: ['', Validators.required],
    presentacion: ['', Validators.required]
  });
  editMode = false;
  errorMessage = '';
  loggedIn = false;
  private loginSubscription: Subscription = new Subscription();
  private sobremiSubscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private sobremiService: SobremiService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.subscribeToSobremiData();
    this.subscribeToLogin();
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
    this.sobremiSubscription.unsubscribe();
  }

  private subscribeToLogin(): void {
    this.loginSubscription = this.loginService.userLoginOn.subscribe(
      (loggedIn) => {
        this.loggedIn = loggedIn;
      }
    );
  }

  private subscribeToSobremiData(): void {
    this.sobremiSubscription = this.sobremiService.sobremi$.subscribe({
      next: (sobremiData) => {
        this.sobremi = sobremiData;
        this.registerForm.patchValue({
          fotoDelPerfil: sobremiData?.fotoDelPerfil || '',
          fotoDePortada: sobremiData?.fotoDePortada || '',
          presentacion: sobremiData?.presentacion || ''
        });
      },
      error: (errorData) => {
        this.handleError(errorData);
      }
    });

    // Recuperación inicial para cargar datos
    this.sobremiService.fetchSobremi();
  }

  private handleError(errorData: any): void {
    console.error('Error:', errorData);
    this.errorMessage = errorData.status === 403
      ? 'No tiene permisos para realizar esta acción.'
      : `Error: ${errorData.message}`;
  }

  get sobremiLoginOn(): boolean {
    return this.loggedIn;
  }
  
  saveSobreMiDetailsData(): void {
    if (this.registerForm.valid) {
      if (this.sobremi && this.sobremi.id) {
        const updatedSobremi: Sobremi = {
          id: this.sobremi.id,
          fotoDelPerfil: this.registerForm.value.fotoDelPerfil ?? '',
          fotoDePortada: this.registerForm.value.fotoDePortada ?? '',
          presentacion: this.registerForm.value.presentacion ?? ''
        };

        this.sobremiService.updateSobremi(updatedSobremi).subscribe({
          next: () => {
            console.log('Datos de Sobremi actualizados con éxito');
            this.editMode = false;
          },
          error: (errorData) => {
            this.handleError(errorData);
          }
        });
      } else {
        this.errorMessage = 'Los datos de Sobremi no están inicializados correctamente.';
      }
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }
  
  cancelEdit(): void {
    this.editMode = false;
    this.sobremiService.fetchSobremi();
  }
}
