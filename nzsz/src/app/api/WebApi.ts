import { LiveInfo } from "./LiveInfo";
import { HttpClient } from "@angular/common/http";

/** HTTPリクエストを送る、通信用API群 */
export class WebApi {
    /** HTTPクライアント */
    private static http: HttpClient;
    /** 初期化子 */
    static initialize(http: HttpClient){
        WebApi.http = http;
    }
    /** ライブ情報を取得する */
    static async downloadLiveInfoList(date: Date): Promise<LiveInfo[]>{
        // GASで書いたサーバーに情報をリクエストする
        const result = await WebApi.http.get<[{
            youtuber: string,
            date: string,
            site: string,
            url: string
        }]>(" https://script.google.com/macros/s/AKfycbyC6XzbNsX_bq9hD91Ab7Zp48mC1Ot1D3alMK9BqQ/exec",
        {params: {
            year: "" + date.getFullYear,
            month: "" + date.getMonth,
            day: "" + date.getDate }}).toPromise();
        return result.map((data) => {
            const liveInfo: LiveInfo = {
                youtuber: [data.youtuber],
                date: new Date(data.date),
                site: data.site,
                url: data.url
            };
            return liveInfo;
        });
    }
}
