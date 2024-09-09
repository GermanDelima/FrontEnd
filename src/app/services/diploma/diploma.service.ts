import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diploma } from '../../models/diploma';


@Injectable({
  providedIn: 'root'
})
export class DiplomaService {
  private apiServerURL = environment.urlHost;

  constructor(private http: HttpClient) { }

  public getDiploma(): Observable<Diploma[]> {
    return this.http.get<Diploma[]>(`${this.apiServerURL}/api/diploma/traer/diploma`);
  }

  public addDiploma(diploma: Diploma): Observable<Diploma> {
    return this.http.post<Diploma>(`${this.apiServerURL}/api/diploma/crear/diploma`, diploma);
  }

  public updateDiploma(diploma: Diploma): Observable<Diploma> { 
    return this.http.put<Diploma>(`${this.apiServerURL}/api/diploma/editar/diploma/${diploma.id}`, diploma);
  }

  public deleteDiploma(diplomaId: number): Observable<Diploma> {
    return this.http.delete<Diploma>(`${this.apiServerURL}/api/diploma/eliminar/diploma/${diplomaId}`);
  }
}
