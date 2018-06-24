package com.ysrken.nzszserver.controller;

import com.ysrken.nzszserver.model.LiveInfo;
import com.ysrken.nzszserver.model.LiveInfoCache;
import com.ysrken.nzszserver.repository.LiveInfoRepository;
import com.ysrken.nzszserver.service.WebApi;
import lombok.var;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

/**
 * 配信予定をダウンロードして返すController
 */
@RestController
@RequestMapping("/api")
public class DownloadDataController {
    @Autowired
    LiveInfoRepository repository;

    private LiveInfo[] getLiveInfoListFromLiveInfoCache(List<LiveInfoCache> list){
        return list.stream().map(data -> {
            return new LiveInfo(){{
                setDate(data.getDate());
                setSite(data.getSite());
                setUrl(data.getUrl());
                setYoutuber(data.getYoutuber());
            }};
        }).toArray(LiveInfo[]::new);
    }

    /**
     * 指定した日付の配信予定を返す
     * @param year 年
     * @param month 月
     * @param day 日
     * @return 配信予定を表すLiveInfoインスタンスの配列(をJSONで)
     */
    @CrossOrigin("http://localhost:4200")
    @GetMapping("/liveinfo/{year}/{month}/{day}")
    @Transactional(readOnly = false)
    public LiveInfo[] getLiveInfoList(@PathVariable int year, @PathVariable int month, @PathVariable int day, HttpServletResponse response){
        try {
            // キャッシュに情報が存在するかを判定し、あればそちらからデータを返す
            final var cacheData = repository.findByYearAndMonthAndDay(year, month, day);
            System.out.println(String.format("%d-%d-%dのキャッシュ量: %d",year, month, day, cacheData.size()));
            if(cacheData.size() >= 1){
                // キャッシュの取得時間を取得
                final var cacheDate = OffsetDateTime.parse(cacheData.get(0).getCacheDate());
                System.out.println(String.format("%d-%d-%dのキャッシュにおける最終更新日時: %s",year, month, day, cacheDate.toString()));
                // 現在時刻 - キャッシュの取得時間が10分以内ならキャッシュのデータを使用する
                final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
                long localDiffSec = ChronoUnit.SECONDS.between(cacheDate, OffsetDateTime.now().withOffsetSameInstant(jst.getRules().getOffset(Instant.now())));
                if(localDiffSec < 10 * 60){
                    response.setStatus(HttpServletResponse.SC_OK);
                    return getLiveInfoListFromLiveInfoCache(cacheData);
                }
            }
            // キャッシュに欲しい情報が存在しないので、データを更新する
            repository.deleteAll(cacheData);
            final var downloadData =WebApi.downloadLiveInfo(year, month, day, response);
            repository.saveAll(downloadData);
            repository.flush();
            System.out.println(String.format("%d-%d-%dのデータ量: %d",year, month, day, downloadData.size()));
            return getLiveInfoListFromLiveInfoCache(downloadData);
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return new LiveInfo[]{};
        }
    }
}
