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

  constructor() { }

  async ngOnInit() {
    try{
      // 配信データをダウンロードする
      const liveInfoList = await WebApi.downloadLiveInfoList(this.Today);
      this.LiveInfoList = liveInfoList;
    }catch(e){
      window.alert('ライブ情報を取得できませんでした。');
    }
  }

  /** 今日の日付を返す */
  get Today(): Date { 
    return new Date();
  }

  /** にじさんじの公式サイト(Twitter垢)のページを開く */
  jumpNzSzSite(){
    window.open('https://twitter.com/nijisanji_app');
  }
  jumpNzSzLive(){
    window.open('https://www.youtube.com/channel/UCX7YkU9nEeaoZbkVLVajcMg/videos');
  }
}
