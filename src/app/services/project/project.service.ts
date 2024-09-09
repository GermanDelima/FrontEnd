import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../models/project';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiServerURL = environment.urlHost;

  constructor(private http: HttpClient) { }

  public getProject(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiServerURL}/api/proyecto/traer/proyecto`);
  }

  public addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiServerURL}/api/proyecto/crear/proyecto`, project);
  }

  public updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiServerURL}/api/proyecto/editar/proyecto/${project.id}`, project);
  }

  public deleteProject(projectId: number): Observable<Project> {
    return this.http.delete<Project>(`${this.apiServerURL}/api/proyecto/eliminar/proyecto/${projectId}`);
  }
}
