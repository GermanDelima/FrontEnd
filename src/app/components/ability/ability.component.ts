import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ability } from '../../models/ability';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbilityService } from '../../services/ability/ability.service';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-ability',
  templateUrl: './ability.component.html',
  styleUrls: ['./ability.component.css']
})
export class AbilityComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  tooltipVisible = false;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;

  toggleTooltip() {
    this.tooltipVisible = !this.tooltipVisible;
  }

  abilitys: Ability[] = [];
  ability: Ability | null = null;

  editAbilityForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    imageUrl: ['', Validators.required] // Agregar validación para URL de imagen
  });

  addAbilityForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    imageUrl: ['', Validators.required] // Agregar validación para URL de imagen
  });

  editMode = false;
  errorMessage = '';
  loggedIn = false;

  constructor(
    private formBuilder: FormBuilder,
    private abilityService: AbilityService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.fetchAbilityData();
    this.loginService.userLoginOn.pipe(takeUntil(this.destroy$)).subscribe(
      (loggedIn) => {
        this.loggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Envía una señal para completar el Subject
    this.destroy$.complete(); // Completa el Subject
  }

  fetchAbilityData(): void {
    this.abilityService.getAbility().pipe(takeUntil(this.destroy$)).subscribe({
      next: (abilityArray: Ability[]) => {
        this.abilitys = abilityArray;
        if (abilityArray.length > 0) {
          this.ability = abilityArray[0];
        }
      },
      error: (errorData) => {
        console.error('Error al obtener datos de Habilidades:', errorData);
        this.errorMessage = 'Error al cargar los datos de Habilidades.';
      }
    });
  }

  saveAbilityData(): void {
    if (this.editAbilityForm.valid) {
      const updateAbility: Ability = {
        id: this.ability!.id,
        nombre: this.editAbilityForm.value.nombre ?? '',
        imageUrl: this.editAbilityForm.value.imageUrl ?? ''
      };
      this.abilityService.updateAbility(updateAbility).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Datos de Habilidad actualizados con éxito');
          this.editMode = false;
          this.fetchAbilityData();
        },
        error: (errorData) => {
          console.error('Error al actualizar los datos de Habilidad:', errorData);
          this.errorMessage = errorData.status === 403
            ? 'No tiene permisos para realizar esta acción.'
            : `Error: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  addAbility(): void {
    if (this.addAbilityForm.valid) {
      const newAbility: Ability = {
        id: 0,
        nombre: this.addAbilityForm.value.nombre ?? '',
        imageUrl: this.addAbilityForm.value.imageUrl ?? ''
      };
      this.abilityService.addAbility(newAbility).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Nueva habilidad agregada con éxito');
          this.fetchAbilityData();
          this.addAbilityForm.reset();
        },
        error: (errorData) => {
          console.error('Error al agregar una nueva habilidad:', errorData);
          this.errorMessage = `Error al agregar una nueva habilidad: ${errorData.message}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor complete el formulario correctamente.';
    }
  }

  deleteAbility(abilityId: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta habilidad?');
    if (confirmDelete) {
      this.abilityService.deleteAbility(abilityId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          console.log('Habilidad eliminada con éxito');
          this.fetchAbilityData();
        },
        error: (errorData) => {
          console.error('Error al eliminar la habilidad:', errorData);
          this.errorMessage = errorData.status === 403
            ? 'No tiene permisos para eliminar esta habilidad.'
            : `Error al eliminar la habilidad: ${errorData.message}`;
        }
      });
    }
  }

  editAbility(ability: Ability): void {
    this.ability = ability;
    this.editAbilityForm.patchValue({
      nombre: ability.nombre,
      imageUrl: ability.imageUrl
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.fetchAbilityData();
  }

  get abilityLoginOn(): boolean {
    return this.loggedIn;
  }


  
}
