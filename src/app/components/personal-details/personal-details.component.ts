import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';
import { UserService } from '../../services/user/user.service';
import { environment } from '../../../environments/environment';
import { Sobremi } from '../../models/sobremi';
import { Subscription } from 'rxjs';
import { SobremiService } from '../../services/sobremi/sobremi.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})

export class PersonalDetailsComponent implements OnDestroy, OnInit {
  sobremi: Sobremi | null = null;
  private sobremiSubscription: Subscription | undefined;

  errorMessage: string = "";
  user?: User;
  userLoginOn: boolean = false;
  editMode: boolean = false;

  personalDetailsForm = this.formBuilder.group({
    id: [''],
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    profession: ['', Validators.required]
  });

  private getUserSubscription;
  private userLoginOnSubscription;

  constructor(
    private sobremiService: SobremiService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) 
  {
this.getUserSubscription = this.userService.user$.subscribe({
      next: (userData: User | null) => {
        if (userData) {
          this.user = userData;
          this.personalDetailsForm.controls.id.setValue(userData.id.toString());
          this.personalDetailsForm.controls.firstname.setValue(userData.firstname);
          this.personalDetailsForm.controls.lastname.setValue(userData.lastname);
          this.personalDetailsForm.controls.profession.setValue(userData.profession);
          
        }
      },
      error: (errorData: any) => {
        this.errorMessage = errorData;
      },
      complete: () => { console.info("User Data ok"); }
    });

    this.userLoginOnSubscription = this.loginService.userLoginOn.subscribe({
      next: (userLoginOn: boolean) => {
        this.userLoginOn = userLoginOn;
      }
    });

    this.userService.fetchUser(environment.userId); // Fetch initial user data
  }

  ngOnInit(): void {
    this.subscribeToSobremiData();
  }

  ngOnDestroy(): void {
    this.sobremiSubscription?.unsubscribe();
    this.getUserSubscription?.unsubscribe();
    this.userLoginOnSubscription?.unsubscribe();
  }

  private subscribeToSobremiData(): void {
    this.sobremiSubscription = this.sobremiService.sobremi$.subscribe({
      next: (sobremiData) => {
        this.sobremi = sobremiData;
      },
      error: (errorData) => {
        console.error('Error al obtener datos de Sobremi:', errorData);
      }
    });

    // Recuperación inicial para cargar datos
    this.sobremiService.fetchSobremi();
  }

  savePersonalDetailsData(): void {
    if (this.personalDetailsForm.valid) {
      const user: User = this.personalDetailsForm.value as unknown as User;
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.editMode = false;
          this.user = user;
        },
        error: (errorData: any) => console.error(errorData)
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.userService.fetchUser(environment.userId);
  }
}
