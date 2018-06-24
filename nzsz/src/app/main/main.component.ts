import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../service/webapi.service';
import { LiveInfo } from '../model/LiveInfo';
import { Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';

/**
 * メイン画面を表すComponent
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  /** 配信予定 */
  LiveInfoList: LiveInfo[] = [];
  /** 選択されている日付 */
  Today: Date = new Date();
  /** ソフトウェアのバージョン */
  Version: string = "Ver.0.9";
  /** 最終更新日 */
  LastUpdate: string = "2018/06/24";
  /** くるくる表示をするか？ */
  ProgressSpinnerFlg: boolean = false;

  /** リビジョン */
  private readonly revision: number = 9;

  /**
   * 配信予定を更新する
   * @param date 日付
   */
  private async refreshLiveInfoList(date: Date){
    try{
      this.ProgressSpinnerFlg = true;
      // 配信データをダウンロードする
      this.LiveInfoList = await this.webApi.downloadLiveInfoList(date);
    }catch(e){
      this.LiveInfoList = [];
      window.alert('ライブ情報を取得できませんでした。');
    }finally{
      this.ProgressSpinnerFlg = false;
    }
    this.Today = date;
  }

  constructor(private router: Router, private settings: SettingsService, private webApi: WebApiService) { }

  async ngOnInit() {
    // 自動読み込みの設定
    if(this.settings.AutoLoadFlg){
      await this.refreshLiveInfoList(this.Today);
    }
    // バージョンチェック
    const latestRevision = await this.webApi.downloadRevision();
    if(latestRevision > this.revision){
      if(!this.settings.RevisionCheckFlg){
        window.alert("アプリが最新版ではありません。\nChromeのキャッシュをクリアしてから\n再度起動し直してください。");
      }
    }
    this.settings.RevisionCheckFlg = true;
  }

  /**
   * にじさんじの公式サイト(Twitter垢)のページを開く
  */
  jumpNzSzSite(){
    window.open('https://twitter.com/nijisanji_app');
  }
  /**
   * にじさんじの公式チャンネル(Youtube)のページを開く
  */
  jumpNzSzLive(){
    window.open('https://www.youtube.com/channel/UCX7YkU9nEeaoZbkVLVajcMg/videos');
  }
  /**
   * 指定したURLを開く
   * @param url URL
   */
  jumpOtherPage(url: string){
    window.open(url);
  }
  /**
   * タイマー画面に遷移
  */
  navigateTimer(){
    this.router.navigate(['/timer']);
  }
  /**
   * オプション画面に遷移
  */
  navigateOption(){
    this.router.navigate(['/option']);
  }
  /**
   * タップした日付にカレンダーの日付を変更する
   * @param date タップした日付
   */
  async onTap(date: Date){
    await this.refreshLiveInfoList(date);
  }
  /**
   * 通知タイマーを設定する
   * @param liveInfo 追加したい配信予定
   */
  setTimer(liveInfo: LiveInfo){
    // 現在時刻より古い通知タイマーに意味はないので無視する
    if(liveInfo.date.getTime() < (new Date()).getTime()){
      return;
    }
    this.settings.addTimer(liveInfo);
    window.alert('通知タイマーを設定しました。');
  }
  /**
   * バージョン情報を表示する
  */
  showVersionInfo(){
    window.alert("にじさんじ配信アプリ「NZSZ」\nバージョン：" + this.Version + "\n最終更新日：" + this.LastUpdate);
  }
}
