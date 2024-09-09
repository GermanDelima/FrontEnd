import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
//import { environment } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit   {
  errorMessage: string = '';
  user?: User;
  userLoginOn: boolean = false;

  private loginSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private elementRef: ElementRef,
    
    
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#111827';
  }

  ngOnInit(): void {
    
    this.loginSubscription = this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn: boolean) => {
        this.userLoginOn = userLoginOn;
      }
    });

    this.userSubscription = this.userService.user$.subscribe({
      next: (userData: User | null) => {
        if (userData) {
          this.user = userData;
        }
      },
      error: (errorData: any) => {
        console.error('Error al recuperar los datos del usuario:', errorData);
        this.errorMessage = 'Error al cargar los datos del usuario.';
      }
    });

    this.userService.fetchUser(environment.userId); // Fetch initial user data

  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
