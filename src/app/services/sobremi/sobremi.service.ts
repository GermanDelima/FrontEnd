import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sobremi } from '../../models/sobremi';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SobremiService {
  private apiServerURL = environment.urlHost;
  private sobremiSubject = new BehaviorSubject<Sobremi | null>(null);
  sobremi$ = this.sobremiSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getSobremi(): Observable<Sobremi> {
    return this.http.get<Sobremi>(`${this.apiServerURL}/api/sobremi/traer/sobremi/1`).pipe(
      tap((sobremi: Sobremi) => this.sobremiSubject.next(sobremi))
    );
  }

  public updateSobremi(sobremi: Sobremi): Observable<Sobremi> {
    return this.http.put<Sobremi>(`${this.apiServerURL}/api/sobremi/editar/sobremi/1`, sobremi).pipe(
      tap((updatedSobremi: Sobremi) => this.sobremiSubject.next(updatedSobremi))
    );
  }
  
  public fetchSobremi(): void {
    this.getSobremi().subscribe();
  }
}
