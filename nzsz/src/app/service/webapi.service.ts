import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    async downloadLiveInfoList(date: Date): Promise<LiveInfo[]> {
        try{
            // サーバーに情報をリクエストする
            const result = await this.http.get<LiveInfoJson[]>(`${this.endpoint}/api/liveinfo/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
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
        }catch(e){
            const status = (e as HttpErrorResponse).status;
            if(status < 500){
                return [];
            }else{
                throw e;
            }
        }
    }
    /**
     * リビジョン情報を取得する
     * @returns 最新版のリビジョン番号
     */
    async downloadRevision(): Promise<number> {
        const result = await this.http.get<{ "revision": string }>
            (`${this.endpoint}/api/revision/latest`)
            .toPromise();
        const revision = parseInt(result.revision);
        if (isNaN(revision)) {
            console.log('リビジョン情報をサーバーから取得できませんでした。');
            return 0;
        } else {
            return revision;
        }
    }
}

interface LiveInfoJson{
    youtuber: string;
    date: string;
    site: string;
    url: string;
}
