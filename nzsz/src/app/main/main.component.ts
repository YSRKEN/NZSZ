import { Component, OnInit } from '@angular/core';
import { WebApi } from '../api/WebApi';
import { LiveInfo } from '../api/LiveInfo';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  /** 配信予定 */
  LiveInfoList: LiveInfo[];
  /** 選択されている日付 */
  Today: Date = new Date();

  constructor() { }

  async ngOnInit() {
    try{
      // 配信データをダウンロードする
      const list = await WebApi.downloadLiveInfoList(this.Today);
      this.LiveInfoList = list;
    }catch(e){
      window.alert('ライブ情報を取得できませんでした。');
    }
  }

  /** にじさんじの公式サイト(Twitter垢)のページを開く */
  jumpNzSzSite(){
    window.open('https://twitter.com/nijisanji_app');
  }
  /** にじさんじの公式チャンネル(Youtube)のページを開く */
  jumpNzSzLive(){
    window.open('https://www.youtube.com/channel/UCX7YkU9nEeaoZbkVLVajcMg/videos');
  }
  /** タップした日付にカレンダーの日付を変更する */
  async onTap(date: Date){
    try{
      // 配信データをダウンロードする
      this.LiveInfoList = await WebApi.downloadLiveInfoList(date);
      this.Today = date;
    }catch(e){
      window.alert('ライブ情報を取得できませんでした。');
    }
  }
}
