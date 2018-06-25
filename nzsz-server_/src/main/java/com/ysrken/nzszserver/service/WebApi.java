package com.ysrken.nzszserver.service;

import java.io.IOException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;

import com.ysrken.nzszserver.model.LiveInfoCache;

import lombok.var;

public class WebApi {
    public static List<LiveInfoCache> downloadLiveInfo(int year, int month, int day, HttpServletResponse response) throws IOException {
        final var liveInfoList = new ArrayList<LiveInfoCache>();
        // HTML情報を取得する
        final var url = String.format("https://wikiwiki.jp/nijisanji/?cmd=read&page=配信予定%%2F%04d-%02d-%02d",year, month, day);
        final var document = Jsoup.connect(url).get();
        // まず配信予定情報があるかを確認する
        final var headerElement = document.getElementById("header");
        if(headerElement == null || headerElement.text().contains("の編集")){
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return liveInfoList;
        }
        // 配信情報を取得する
        final var liveInfoElements = document.select("ul.list1 > li");
        final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
        final var cacheDate = OffsetDateTime.now().withOffsetSameInstant(jst.getRules().getOffset(Instant.now()));
        for(final var liveInfoElement : liveInfoElements){
            final var liveInfo = new LiveInfoCache();
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
                if(!temp1.contains("at:")){
                    continue;
                }
                var temp3 = temp1.substring(temp1.indexOf("at:") + 3).replace(", ","," );
                if(temp3.contains(" ")){
                    temp3 = temp3.substring(0, temp3.indexOf(" "));
                }
                liveInfo.setSite(temp3);
            }
            //リストに追加する
            liveInfo.setYear(year);
            liveInfo.setMonth(month);
            liveInfo.setDay(day);
            liveInfo.setCacheDate(cacheDate.toString());
            liveInfoList.add(liveInfo);
        }
        response.setStatus(HttpServletResponse.SC_OK);
        return liveInfoList;
    }
}
