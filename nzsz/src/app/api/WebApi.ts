import { LiveInfo } from "./LiveInfo";
import { HttpClient } from "@angular/common/http";

/** HTTPリクエストを送る、通信用API群 */
export class WebApi {
    /** HTTPクライアント */
    private static http: HttpClient;
    /* エンドポイント */
    private static endpoint: string = "http://localhost:8080";

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
        }]>(`${this.endpoint}/api/liveinfo/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
        .toPromise();
        return result.map((data) => {
            const liveInfo: LiveInfo = {
                youtuber: data.youtuber,
                date: new Date(data.date),
                site: data.site,
                url: data.url
            };
            return liveInfo;
        });
    }
    /** リビジョン情報を取得する */
    static async downloadRevision(): Promise<number>{
        const result = await WebApi.http.get<{"revision": string}>
            ("https://script.google.com/macros/s/AKfycbxMAXjAVnDg4phbeK1WvVc90QICkVszTjYVmQ5FHkmuZqRnGeI/exec")
            .toPromise();
        const revision = parseInt(result.revision);
        return (isNaN(revision) ? 0 : revision);
    }
}
