import { Injectable } from '@angular/core';
import { LiveInfo } from '../model/LiveInfo';
import * as moment from 'moment';
import * as push from 'push.js';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  /** 設定情報 */
  private settings: SettingData = new SettingData();

  /** 設定を保存 */
  private writeSettings(){
    window.localStorage.setItem("settings", JSON.stringify(this.settings));
    console.log("設定を保存しました");
  }

  constructor() {
    // 設定を読み込む
    if(window.localStorage.getItem("settings") != null){
      this.settings = JSON.parse(window.localStorage.getItem("settings"));
      this.settings.timerList = this.settings.timerList.map(li => {
        li.date = new Date(li.date);
        return li;
      });
      this.settings.revisionCheckFlg = false;
      console.log("設定を読み込みました");
    }else{
      console.log("デフォルト設定で起動しました");
      this.writeSettings();
    }
    // 配信予定を通知するためのタイマー動作
    window.setInterval(this.checkTimer.bind(this), 10 * 1000);
  }

  /** タイマーの配信予定にデータを追加する */
  addTimer(liveInfo: LiveInfo){
    // データを追加
    const hash2 = calcHash(liveInfo);
    if(this.settings.timerList.filter(li => {
      return calcHash(li) == hash2;
    }).length == 0){
      this.settings.timerList.push(liveInfo);
    }
    // データをソート
    this.settings.timerList = this.settings.timerList.sort((a, b) => a.date.getTime() > b.date.getTime() ? 1 : -1);
    // データを記録
    console.log("タイマーの配信予定にデータを追加しました");
    this.writeSettings();
  }

  /** 古いタイマー情報を削除する */
  deleteOldTimer(){
    if(this.settings.timerList.filter(li => li.date.getTime() < moment().toDate().getTime()).length > 0){
      this.settings.timerList = this.settings.timerList.filter(li => li.date.getTime() >= moment().toDate().getTime());
      console.log("タイマーの配信予定から古い情報を削除しました");
      this.writeSettings();
    }
  }

  /** 指定したタイマー情報を削除する */
  deleteSelectTimer(liveInfo: LiveInfo){
    const hash2 = liveInfo.date.toString() + liveInfo.site + liveInfo.url + liveInfo.youtuber;
    this.settings.timerList = this.settings.timerList.filter(li => {
      return calcHash(li) != hash2;
    });
    console.log("タイマーの配信予定から選択した情報を削除しました");
    this.writeSettings();
  }

  /** カレンダーの日付をタップした際に自動読込みするフラグ */
  get AutoLoadFlg(){
    return this.settings.autoLoadFlg;
  }
  set AutoLoadFlg(flg: boolean){
    this.settings.autoLoadFlg = flg;
    this.writeSettings();
  }
  /** 起動時にリビジョンをチェックするフラグ */
  get RevisionCheckFlg(){
    return this.settings.revisionCheckFlg;
  }
  set RevisionCheckFlg(flg: boolean){
    this.settings.revisionCheckFlg = flg;
    this.writeSettings();
  }
  /** 配信予定の一覧を返す */
  get TimerList(): LiveInfo[]{
    return this.settings.timerList;
  }
  /**
   * 配信予定を開始10分前に通知する
   * (10秒間隔でチェックするため、配信予定時刻－現在時刻が600[s]～591[s]なら通知するようにしている)
   */
  checkTimer(){
    console.log('配信予定タイマーの確認...');
    const nowTime = (new Date()).getTime();
    const timerList = this.settings.timerList;
    for(const liveInfo of timerList){
      const timeDiff = liveInfo.date.getTime() - nowTime;
      //console.log(`配信予定:\n${liveInfo.date.getHours()}:${liveInfo.date.getMinutes()}　${liveInfo.site}\n${liveInfo.youtuber}\n${timeDiff / 1000}[s]`)
      if(timeDiff >= 591 * 1000 && nowTime <= 600 * 1000){
        if(push.Permission.has()){
          push.create(`${liveInfo.date.getHours()}:${liveInfo.date.getMinutes()}配信予定:\n${liveInfo.site}\n${liveInfo.youtuber}`);
        }
      }
    }
  }
}

/**
 * 設定情報を読み書きするためのclass
 */
class SettingData{
  /** タイマーの配信予定 */
  timerList: LiveInfo[] = [];
  /** 起動時にリビジョンをチェックしたか？ */
  revisionCheckFlg: boolean = false;
  /** カレンダーの日付をタップした際に自動読込みするか？ */
  autoLoadFlg: boolean = false;
}

/** 配信情報のハッシュ値 */
function calcHash(liveInfo: LiveInfo): string{
  return liveInfo.date.toString() + liveInfo.site + liveInfo.url + liveInfo.youtuber;
}
