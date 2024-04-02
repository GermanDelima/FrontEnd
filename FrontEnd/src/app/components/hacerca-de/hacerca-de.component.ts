import { Component, OnInit } from '@angular/core';
import { persona } from 'src/app/models/persona.models';
import { PersonaService } from 'src/app/service/persona.service';

@Component({
  selector: 'app-hacerca-de',
  templateUrl: './hacerca-de.component.html',
  styleUrls: ['./hacerca-de.component.css']
})
export class HacercaDeComponent implements OnInit {
  persona: persona = new persona("","",""); 
  constructor(public personaService: PersonaService) { } 

  ngOnInit(): void {             
    this.personaService.getPersona().subscribe(data => {
      this.persona = data[0];
    });
  }

}
