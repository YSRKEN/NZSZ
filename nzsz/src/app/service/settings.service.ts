import { Injectable } from '@angular/core';
import { LiveInfo } from '../model/LiveInfo';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /** タイマーの配信予定 */
  TimerLiveInfoList: LiveInfo[] = [];
  /** 起動時にリビジョンをチェックしたか？  */
  RevisionCheckFlg: boolean = false;

  constructor() {
    // タイマーの配信予定を読み込む
    if(window.localStorage.getItem("nzsz-TimerCount") != null
    || window.localStorage.getItem("nzsz-TimerYoutuber") != null
    || window.localStorage.getItem("nzsz-TimerDate") != null
    || window.localStorage.getItem("nzsz-TimerSite") != null
    || window.localStorage.getItem("nzsz-TimerUrl") != null){
      const timerCount = parseInt(window.localStorage.getItem("nzsz-TimerCount"));
      const youtubers = window.localStorage.getItem("nzsz-TimerYoutuber").split('|');
      const dates = window.localStorage.getItem("nzsz-TimerDate").split('|');
      const sites = window.localStorage.getItem("nzsz-TimerSite").split('|');
      const urls = window.localStorage.getItem("nzsz-TimerUrl").split('|');
      for(let i = 0; i < timerCount; ++i){
        const liveInfo = new LiveInfo();
        liveInfo.youtuber = youtubers[i];
        liveInfo.date = moment(dates[i], 'YYYY-MM-DD HH-mm').toDate();
        liveInfo.site = sites[i];
        liveInfo.url = urls[i];
        this.TimerLiveInfoList.push(liveInfo);
      }
    }
  }

  /** タイマーの配信予定にデータを追加する */
  addTimerLiveInfoList(liveInfo: LiveInfo){
    // データを追加
    const temp = new LiveInfo();
    temp.youtuber = liveInfo.youtuber;
    temp.date = moment(liveInfo.date).toDate();
    temp.site = liveInfo.site;
    temp.url = liveInfo.url;
    this.TimerLiveInfoList.push(temp);
    // データをソート
    this.TimerLiveInfoList = this.TimerLiveInfoList.sort((a, b) => a.date.getTime() > b.date.getTime() ? 1 : -1);
    // データを記録
    this.writeTimerLiveInfoList();
    console.log("タイマーの配信予定にデータを追加しました");
  }

  /** タイマーの配信予定を記録 */
  writeTimerLiveInfoList(){
    window.localStorage.setItem("nzsz-TimerCount", "" + this.TimerLiveInfoList.length);
    window.localStorage.setItem("nzsz-TimerYoutuber",
      this.TimerLiveInfoList.map(l => l.youtuber).join('|'));
    window.localStorage.setItem("nzsz-TimerDate",
      this.TimerLiveInfoList.map(l => moment(l.date).format('YYYY-MM-DD HH-mm')).join('|'));
    window.localStorage.setItem("nzsz-TimerSite",
      this.TimerLiveInfoList.map(l => l.site).join('|'));
    window.localStorage.setItem("nzsz-TimerUrl",
      this.TimerLiveInfoList.map(l => l.url).join('|'));
      console.log("タイマーの配信予定を記録しました");
  }

  /** 古いタイマー情報を削除する */
  deleteOldTimer(){
    if(this.TimerLiveInfoList.filter(li => li.date.getTime() < moment().toDate().getTime()).length > 0){
      this.TimerLiveInfoList = this.TimerLiveInfoList.filter(li => li.date.getTime() >= moment().toDate().getTime());
      this.writeTimerLiveInfoList();
      console.log("古いタイマー情報を削除しました");
    }
  }

  /** 指定したタイマー情報を削除する */
  deleteSelectTimer(liveInfo: LiveInfo){
    const hash2 = liveInfo.date.toString() + liveInfo.site + liveInfo.url + liveInfo.youtuber;
    this.TimerLiveInfoList = this.TimerLiveInfoList.filter(li => {
      const hash1 = li.date.toString() + li.site + li.url + li.youtuber;
      return hash1 != hash2;
    });
    this.writeTimerLiveInfoList();
    console.log("選択したタイマー情報を削除しました");
  }

  /** 起動時に今日の予定を読み込むフラグ */
  get AutoLoadFlg(){
    if(window.localStorage.getItem("nzsz-AutoLoadFlg") != null){
      return (window.localStorage.getItem("nzsz-AutoLoadFlg") == "true");
    }else{
      return false;
    }
  }
  set AutoLoadFlg(flg: boolean){
    window.localStorage.setItem("nzsz-AutoLoadFlg", flg ? "true" : "false");
  }
}
