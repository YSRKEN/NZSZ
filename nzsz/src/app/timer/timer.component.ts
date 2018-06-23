import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';
import { LiveInfo } from '../model/LiveInfo';

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

  /** 任意のページを開く */
  jumpOtherPage(url: string){
    window.open(url);
  }

  /** 古いタイマー情報を削除 */
  deleteOldTimer(){
    this.settings.deleteOldTimer();
    this.LiveInfoList = this.settings.TimerLiveInfoList;
    window.alert("古いタイマー情報を削除しました。");
  }

  /** タップしたタイマー情報を削除 */
  deleteSelectTimer(liveInfo: LiveInfo){
    this.settings.deleteSelectTimer(liveInfo);
    this.LiveInfoList = this.settings.TimerLiveInfoList;
  }

  /** メイン画面に遷移 */
  navigateMain(){
    this.router.navigate(['/']);
  }
}
