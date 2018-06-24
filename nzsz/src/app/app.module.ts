import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { MainComponent } from './main/main.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { OptionComponent } from './option/option.component';
import { SettingsService } from './service/settings.service';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './timer/timer.component';
import { WebApiService } from './service/webapi.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CalendarComponent,
    OptionComponent,
    TimerComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  providers: [SettingsService, WebApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
