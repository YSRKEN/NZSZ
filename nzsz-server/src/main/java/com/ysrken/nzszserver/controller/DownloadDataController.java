package com.ysrken.nzszserver.controller;

import com.ysrken.nzszserver.model.LiveInfo;
import lombok.var;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;

/**
 * 配信予定をダウンロードして返すController
 */
@RestController
@RequestMapping("/api")
public class DownloadDataController {
    /**
     * 指定した日付の配信予定を返す
     * @param year 年
     * @param month 月
     * @param day 日
     * @return 配信予定を表すLiveInfoインスタンスの配列(をJSONで)
     */
    @CrossOrigin("http://localhost:4200")
    @GetMapping("/liveinfo/{year}/{month}/{day}")
    public LiveInfo[] getLiveInfoList(@PathVariable int year, @PathVariable int month, @PathVariable int day){
        final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
        // スタブ
        if(year == 2018 && month == 6 && day == 17){
            final var liveInfo = new LiveInfo(){{
                setYoutuber("月ノ美兎");
                setDate(ZonedDateTime.of(2018, 6, 17, 15, 0, 0, 0, jst).toOffsetDateTime().toString());
                setSite("OPENREC.tv");
                setUrl("https://twitter.com/MitoTsukino/status/1008200445297188864");
            }};
            return new LiveInfo[]{liveInfo};
        }else{
            return new LiveInfo[]{};
        }
    }
}
