import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  // Tooltip
  tooltipText: string = '';
  tooltipVisible: boolean = false;

  showTooltip(event: MouseEvent, text: string): void {
    this.tooltipText = text;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  userLoginOn: boolean = false;
  private loginSubscription: Subscription | null = null;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    // Código que se ejecuta cuando el componente se inicializa
    this.loginSubscription = this.loginService.currentUserLoginOn.subscribe(
      {
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      }
    );
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/inicio']);
  }

  ngOnDestroy(): void {
    // Desuscribirse de la suscripción para evitar fugas de memoria
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
