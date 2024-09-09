import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SobremiService } from '../../services/sobremi/sobremi.service';
import { Sobremi } from '../../models/sobremi';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  sobremi: Sobremi | null = null;
  private sobremiSubscription: Subscription | undefined;

  constructor(private sobremiService: SobremiService) { }

  ngOnInit(): void {
    this.subscribeToSobremiData();
  }

  ngOnDestroy(): void {
    this.sobremiSubscription?.unsubscribe();
  }

  private subscribeToSobremiData(): void {
    this.sobremiSubscription = this.sobremiService.sobremi$.subscribe({
      next: (sobremiData) => {
        this.sobremi = sobremiData;
      },
      error: (errorData) => {
        console.error('Error al obtener datos de Sobremi:', errorData);
      }
    });

    // Recuperación inicial para cargar datos
    this.sobremiService.fetchSobremi();
  }
}

