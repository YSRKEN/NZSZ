package com.ysrken.nzszserver.controller;

import com.ysrken.nzszserver.model.LiveInfo;
import lombok.var;
import org.jsoup.Jsoup;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Pattern;

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
    public LiveInfo[] getLiveInfoList(@PathVariable int year, @PathVariable int month, @PathVariable int day, HttpServletResponse response){
        try {
            // HTML情報を取得する
            final var url = String.format("https://wikiwiki.jp/nijisanji/?cmd=read&page=配信予定%%2F%04d-%02d-%02d",year, month, day);
            final var document = Jsoup.connect(url).get();
            // まず配信予定情報があるかを確認する
            final var headerElement = document.getElementById("header");
            if(headerElement == null || headerElement.text().contains("の編集")){
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return new LiveInfo[]{};
            }
            // 配信情報を取得する
            final var output = new ArrayList<LiveInfo>();
            final var liveInfoElements = document.select("ul.list1 > li");
            for(final var liveInfoElement : liveInfoElements){
                final var liveInfo = new LiveInfo();
                // 配信時刻を抽出する
                {
                    //■の手前が時刻表示部分のはず
                    final var temp1 = liveInfoElement.text();
                    if(!temp1.contains("■")){
                        continue;
                    }
                    //<del>された文字列は不要なので削除
                    var temp2 = temp1.substring(0, temp1.indexOf("■"));
                    for(final var delElement : liveInfoElement.getElementsByTag("del")){
                        final var delSting = delElement.text();
                        temp2 = temp2.replace(delSting, "");
                    }
                    //正規表現でマッチした数字部分を取り出し、時刻データに変換する
                    final var regex = "(\\d{2})時(\\d{2})分～";
                    final var pattern = Pattern.compile(regex);
                    final var matcher = pattern.matcher(temp2);
                    if(!matcher.find()) {
                        continue;
                    }
                    // 時刻部分を取り出す
                    final var hour = Integer.parseInt(matcher.group(1));
                    final var minute = Integer.parseInt(matcher.group(2));
                    final ZoneId jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
                    liveInfo.setDate(ZonedDateTime.of(year, month, day, hour, minute, 0, 0, jst).toOffsetDateTime().toString());
                }
                // Youtuber名とURLを抽出する
                {
                    final var aElementFirst = liveInfoElement.selectFirst("a.ext");
                    if(aElementFirst == null){
                        continue;
                    }
                    liveInfo.setYoutuber(aElementFirst.text());
                    liveInfo.setUrl(aElementFirst.attr("href").replace("http://re.wikiwiki.jp/?", ""));
                }
                //リストに追加する
                output.add(liveInfo);
            }
            response.setStatus(HttpServletResponse.SC_OK);
            return output.toArray(new LiveInfo[output.size()]);
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return new LiveInfo[]{};
        }
    }
}
