import { LiveInfo } from "./LiveInfo";

/** HTTPリクエストを送る、通信用API群 */
export class WebApi {
    static async downloadLiveInfoList(): Promise<LiveInfo[]>{
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
