import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.urlApi}user/${id}`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  public updateUser(userRequest: User): Observable<any> {
    return this.http.put(`${environment.urlApi}user`, userRequest).pipe(
      tap(() => this.userSubject.next(userRequest))
    );
  }

  public fetchUser(id: number): void {
    this.getUser(id).subscribe();
  }
}
