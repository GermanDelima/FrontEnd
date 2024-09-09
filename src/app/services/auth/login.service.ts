import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LoginRequest } from './LoginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
      this.currentUserData = new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost + "/auth/login", credentials).pipe(
      tap((userData) => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem("token", userData.token);
        }
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem("token");
    }
    this.currentUserLoginOn.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error ', error.error);
    } else {
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente'));
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): String {
    return this.currentUserData.value;
  }
}
