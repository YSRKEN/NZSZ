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
                    // ■の手前が時刻表示部分のはず
                    final var temp1 = liveInfoElement.text();
                    if(!temp1.contains("■")){
                        continue;
                    }
                    // <del>された文字列は不要なので削除
                    var temp2 = temp1.substring(0, temp1.indexOf("■"));
                    for(final var delElement : liveInfoElement.getElementsByTag("del")){
                        final var delSting = delElement.text();
                        temp2 = temp2.replace(delSting, "");
                    }
                    // 正規表現でマッチした数字部分を取り出し、時刻データに変換する
                    final var regex = "(\\d{2})時(\\d{2})分～";
                    final var pattern = Pattern.compile(regex);
                    final var matcher = pattern.matcher(temp2);
                    if(!matcher.find()) {
                        continue;
                    }
                    // 時刻部分を取り出す
                    // 24時を超えることもあるので補正を掛けている
                    var liveDay = 0;
                    var liveHour = Integer.parseInt(matcher.group(1));
                    if(liveHour >= 24){
                        liveDay = liveHour / 24;
                        liveHour = liveHour % 24;
                    }
                    final var liveMinute = Integer.parseInt(matcher.group(2));
                    final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
                    var liveDate = ZonedDateTime.of(year, month, day, liveHour, liveMinute, 0, 0, jst).toOffsetDateTime();
                    if(liveDay > 0){
                        liveDate = liveDate.plusDays(liveDay);
                    }
                    liveInfo.setDate(liveDate.toString());
                }
                // Youtuber名とURLを抽出する
                {
                    // 最初のaタグを取り出す
                    final var aElementFirst = liveInfoElement.selectFirst("a.ext");
                    if(aElementFirst == null){
                        continue;
                    }
                    // そこからYoutuber名とURLを抽出する
                    liveInfo.setYoutuber(aElementFirst.text());
                    liveInfo.setUrl(aElementFirst.attr("href").replace("http://re.wikiwiki.jp/?", ""));
                }
                // サイト名を抽出する
                {
                    // 全体のテキストを取り出す
                    var temp1 = liveInfoElement.text();
                    // <del>された文字列は不要なので削除
                    for(final var delElement : liveInfoElement.getElementsByTag("del")){
                        final var delSting = delElement.text();
                        temp1 = temp1.replace(delSting, "");
                    }
                    // ul以下の内容は除去する
                    final var temp2 = liveInfoElement.selectFirst("ul.list2");
                    if(temp2 != null){
                        temp1 = temp1.replace(temp2.text(), "");
                    }
                    // 「at:」以降の「連続する」文字列を取り出し、サイト名とする。ただし、カンマ区切り対策は施す
                    temp1 = temp1.replaceAll("at: +", "at:");
                    var temp3 = temp1.substring(temp1.indexOf("at:") + 3).replace(", ","," );
                    if(temp3.contains(" ")){
                        temp3 = temp3.substring(0, temp3.indexOf(" "));
                    }
                    liveInfo.setSite(temp3);
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
