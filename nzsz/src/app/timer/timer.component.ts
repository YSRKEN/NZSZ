import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';
import { LiveInfo } from '../model/LiveInfo';

/**
 * タイマー画面を表すComponent
 */
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  /**
   * 配信予定のタイマー情報
   */
  LiveInfoList: LiveInfo[];

  constructor(private router: Router, private settings: SettingsService) {}

  ngOnInit() {
    this.LiveInfoList = this.settings.settings.timerList;
  }

  /**
   * 任意のページを開く
   * @param url URL
   */
  jumpOtherPage(url: string){
    window.open(url);
  }

  /**
   * 古いタイマー情報を削除
  */
  deleteOldTimer(){
    this.settings.deleteOldTimer();
    this.LiveInfoList = this.settings.settings.timerList;
    window.alert("古いタイマー情報を削除しました。");
  }

  /**
   * タップしたタイマー情報を削除
   * @param liveInfo タップされた配信予定の情報
  */
  deleteSelectTimer(liveInfo: LiveInfo){
    this.settings.deleteSelectTimer(liveInfo);
    this.LiveInfoList = this.settings.settings.timerList;
  }

  /**
   * メイン画面に遷移
  */
  navigateMain(){
    this.router.navigate(['/']);
  }
}
