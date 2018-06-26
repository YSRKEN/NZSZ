package com.ysrken.nzszserver.controller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ysrken.nzszserver.model.LiveInfo;
import com.ysrken.nzszserver.model.LiveInfoCache;
import com.ysrken.nzszserver.model.Res;
import com.ysrken.nzszserver.repository.LiveInfoRepository;
import com.ysrken.nzszserver.service.WebApi;

import lombok.var;

/**
 * 指定された日付の配信予定を返す
 * 
 * @author ysrken
 */
@SuppressWarnings("serial")
@WebServlet("/api/liveinfo")
@Component
public class DownloadDataController extends HttpServlet {
	/*@Autowired
    LiveInfoRepository repository;*/
    
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
	 * 指定された日付の配信予定を返す
	 * 
	 * @param request
	 *            HTTPリクエスト
	 * @param response
	 *            HTTPレスポンス
	 */
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		try {
			// GETパラメーターを読み取る
			final var yearString = request.getParameter("year");
			final var monthString = request.getParameter("month");
			final var dayString = request.getParameter("day");
			final var year = Integer.parseInt(yearString);
			final var month = Integer.parseInt(monthString);
			final var day = Integer.parseInt(dayString);

			// キャッシュに情報が存在するかを判定し、あればそちらからデータを返す
            /*final var cacheData = repository.findByYearAndMonthAndDay(year, month, day);
            System.out.println(String.format("%d-%d-%dのキャッシュ量: %d",year, month, day, cacheData.size()));
            if(cacheData.size() >= 1){
                // キャッシュの取得時間を取得
                final var cacheDate = OffsetDateTime.parse(cacheData.get(0).getCacheDate());
                System.out.println(String.format("%d-%d-%dのキャッシュにおける最終更新日時: %s",year, month, day, cacheDate.toString()));
                // 現在時刻 - キャッシュの取得時間が10分以内ならキャッシュのデータを使用する
                final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
                long localDiffSec = ChronoUnit.SECONDS.between(cacheDate, OffsetDateTime.now().withOffsetSameInstant(jst.getRules().getOffset(Instant.now())));
                if(localDiffSec < 10 * 60){
                	Res.json(response, getLiveInfoListFromLiveInfoCache(cacheData));
                }
            }*/
			
            // キャッシュに欲しい情報が存在しないので、データを更新する
            //repository.deleteAll(cacheData);
            final var downloadData =WebApi.downloadLiveInfo(year, month, day, response);
            //repository.saveAll(downloadData);
            //repository.flush();
            System.out.println(String.format("%d-%d-%dのデータ量: %d",year, month, day, downloadData.size()));
            Res.json(response, getLiveInfoListFromLiveInfoCache(downloadData));
		} catch (NumberFormatException e) {
			// 引数ミスの場合の処理
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		} catch(IOException e) {
			// IOエラーの場合の処理
			e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}
}