import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveInfo } from '../model/LiveInfo';

/**
 * WebAPIを扱うService
 */
@Injectable({
  providedIn: 'root'
})
export class WebApiService {
  /* エンドポイント */
  private readonly endpoint: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }
  /**
   * ライブ情報を取得する
   * @param date 日付
   * @returns 指定した日付のライブ情報
   */
  async downloadLiveInfoList(date: Date): Promise<LiveInfo[]>{
      // サーバーに情報をリクエストする
      const result = await this.http.get<[{
          youtuber: string,
          date: string,
          site: string,
          url: string
      }]>(`${this.endpoint}/api/liveinfo/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
      .toPromise();
      return result.map((data) => {
          // 返ってきた結果を代入する
          const liveInfo: LiveInfo = {
              youtuber: data.youtuber,
              date: new Date(data.date),
              site: data.site,
              url: data.url
          };
          return liveInfo;
      });
  }
  /**
   * リビジョン情報を取得する
   * @returns 最新版のリビジョン番号
   */
  async downloadRevision(): Promise<number>{
      const result = await this.http.get<{"revision": string}>
          ("https://script.google.com/macros/s/AKfycbxMAXjAVnDg4phbeK1WvVc90QICkVszTjYVmQ5FHkmuZqRnGeI/exec")
          .toPromise();
      const revision = parseInt(result.revision);
      return (isNaN(revision) ? 0 : revision);
  }
}
