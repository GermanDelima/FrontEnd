import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
//import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Ability } from '../../models/ability';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AbilityService {
  private apiServerURL = environment.production;

  constructor(private http: HttpClient) { }

  public getAbility(): Observable<Ability[]> {
    return this.http.get<Ability[]>(`${this.apiServerURL}/api/habilidad/traer/habilidad`);
  }

  public addAbility(ability: Ability): Observable<Ability> {
    return this.http.post<Ability>(`${this.apiServerURL}/api/habilidad/crear/habilidad`, ability);
  }

  public updateAbility(ability: Ability): Observable<Ability> {
    return this.http.put<Ability>(`${this.apiServerURL}/api/habilidad/editar/habilidad/${ability.id}`, ability);
  }

  public deleteAbility(abilityId: number): Observable<Ability> {
    return this.http.delete<Ability>(`${this.apiServerURL}/api/habilidad/eliminar/habilidad/${abilityId}`);
  }
}
