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
        const result = await WebApi.http.get<{
            youtuber: string,
            date: string,
            site: string,
            url: string
        }>(" https://script.google.com/macros/s/AKfycbyC6XzbNsX_bq9hD91Ab7Zp48mC1Ot1D3alMK9BqQ/exec",
        {params: {
            year: "" + date.getFullYear,
            month: "" + date.getMonth,
            day: "" + date.getDate }}).toPromise();
        console.log(result);
        // スタブ
        const liveInfo1: LiveInfo = {
            youtuber: ["樋口楓"],
            date: new Date(2018, 6, 17, 0, 50, 0, 0),
            site: "MIrrativ",
            url: "https://www.mirrativ.com/user/2328706#"
        };
        const liveInfo2: LiveInfo = {
            youtuber: ["樋口楓", "月ノ美兎"],
            date: new Date(2018, 6, 17, 1, 0, 0, 0),
            site: "YouTube",
            url: ""
        };
        const liveInfo3: LiveInfo = {
            youtuber: ["月ノ美兎", "電脳少女シロ他5名"],
            date: new Date(2018, 6, 17, 16, 30, 0, 0),
            site: "AbemaTV",
            url: "https://abema.tv/channels/ultra-games-4/slots/AawoQd2KUbx2QF"
        };
        return [liveInfo1, liveInfo2, liveInfo3];
    }
}
