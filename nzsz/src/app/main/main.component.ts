import { Component, OnInit } from '@angular/core';
import { WebApi } from '../api/WebApi';
import { LiveInfo } from '../api/LiveInfo';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';

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
  Version: string = "Ver.0.5";
  /** 最終更新日 */
  LastUpdate: string = "2018/06/20";
  /** くるくる表示をするか？ */
  ProgressSpinnerFlg: boolean = false;
  /** リビジョン */
  readonly revision: number = 8;

  /** 配信予定を更新する */
  private async refreshLiveInfoList(date: Date){
    try{
      this.ProgressSpinnerFlg = true;
      // 配信データをダウンロードする
      this.LiveInfoList = await WebApi.downloadLiveInfoList(date);
    }catch(e){
      this.LiveInfoList = [];
      window.alert('ライブ情報を取得できませんでした。');
    }finally{
      this.ProgressSpinnerFlg = false;
    }
    this.Today = date;
  }

  constructor(private router: Router, private settings: SettingsService) { }

  async ngOnInit() {
    // 自動読み込みの設定
    if(this.settings.AutoLoadFlg){
      await this.refreshLiveInfoList(this.Today);
    }
    // バージョンチェック
    const latestRevision = await WebApi.downloadRevision();
    if(latestRevision > this.revision){
      if(!this.settings.RevisionCheckFlg){
        window.alert("アプリが最新版ではありません。\nChromeのキャッシュをクリアしてから\n再度起動し直してください。");
      }
    }
    this.settings.RevisionCheckFlg = true;
  }

  /** にじさんじの公式サイト(Twitter垢)のページを開く */
  jumpNzSzSite(){
    window.open('https://twitter.com/nijisanji_app');
  }
  /** にじさんじの公式チャンネル(Youtube)のページを開く */
  jumpNzSzLive(){
    window.open('https://www.youtube.com/channel/UCX7YkU9nEeaoZbkVLVajcMg/videos');
  }
  /** 任意のページを開く */
  jumpOtherPage(url: string){
    window.open(url);
  }
  /** タイマー画面に遷移 */
  navigateTimer(){
    this.router.navigate(['/timer']);
  }
  /** オプション画面に遷移 */
  navigateOption(){
    this.router.navigate(['/option']);
  }
  /** タップした日付にカレンダーの日付を変更する */
  async onTap(date: Date){
    await this.refreshLiveInfoList(date);
  }
  /** 通知タイマーを設定する */
  setTimer(liveInfo: LiveInfo){
    this.settings.addTimerLiveInfoList(liveInfo);
    window.alert('通知タイマーを設定しました。');
  }

  /** バージョン情報を表示する */
  showVersionInfo(){
    window.alert("にじさんじ配信アプリ「NZSZ」\nバージョン：" + this.Version + "\n最終更新日：" + this.LastUpdate);
  }
}
