import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { MainComponent } from './main/main.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { LimitStrPipe } from './limit-str.pipe';
import { OptionComponent } from './option/option.component';
import { SettingsService } from './settings.service';

const appRoutes: Routes = [ // 追加
  { path: '', component: MainComponent },
  { path: 'option', component: OptionComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CalendarComponent,
    LimitStrPipe,
    OptionComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  providers: [SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
