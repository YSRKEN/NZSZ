import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { OptionComponent } from './option/option.component';
import { TimerComponent } from './timer/timer.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'option', component: OptionComponent },
  { path: 'timer', component: TimerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
