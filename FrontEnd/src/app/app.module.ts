import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoAPComponent } from './components/logo-ap/logo-ap.component';
import { BannerComponent } from './components/banner/banner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EducacionComponent } from './components/educacion/educacion.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //formulaReactivo
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HacercaDeComponent } from './components/hacerca-de/hacerca-de.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbModule


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoAPComponent,
    BannerComponent,
    EducacionComponent, 
    ProyectoComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    HacercaDeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    ReactiveFormsModule,//formularios reactivos
  
    MatIconModule,
    NgbModule // Agrega NgbModule a la lista de importaciones
    
  ],
  providers: [],
  bootstrap: [AppComponent]///considerara cambiar
})
export class AppModule { }
