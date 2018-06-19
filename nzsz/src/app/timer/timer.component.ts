import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { LiveInfo } from '../api/LiveInfo';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  LiveInfoList: LiveInfo[];

  constructor(private router: Router, private settings: SettingsService) {}

  ngOnInit() {
    this.LiveInfoList = this.settings.TimerLiveInfoList;
  }

  /** メイン画面に遷移 */
  navigateMain(){
    this.router.navigate(['/']);
  }
}
