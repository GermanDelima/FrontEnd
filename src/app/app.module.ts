import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './authentication/login/login.component';
import { NavComponent } from './shared/nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { JwtInterceptorService } from './services/authentication/jwt-interceptor.service';
import { EducationComponent } from './components/education/education.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectComponent } from './components/project/project.component';
import { SobremiComponent } from './components/sobremi/Sobremi.component';
import { HeaderComponent } from './components/header/header.component';
import { AbilityComponent } from './components/ability/ability.component';
import { DiplomaComponent } from './components/diploma/diploma.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    PersonalDetailsComponent,
    EducationComponent,
    SobremiComponent,
    ProjectComponent,
    HeaderComponent,
    AbilityComponent,
    DiplomaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbTooltipModule,
     
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
