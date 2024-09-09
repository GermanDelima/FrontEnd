import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Education } from '../../models/education';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiServerURL = environment.urlHost;

  constructor(private http: HttpClient) { }

  public getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiServerURL}/api/education/traer/educations`);
  }

  public addEducation(education: Education): Observable<Education> {
    return this.http.post<Education>(`${this.apiServerURL}/api/education/crear/education`, education);
  }

  public updateEducation(education: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiServerURL}/api/education/editar/education/${education.id}`, education);
  }

  public deleteEducation(educationId: number): Observable<Education> {
    return this.http.delete<Education>(`${this.apiServerURL}/api/education/eliminar/education/${educationId}`);
  }
}
