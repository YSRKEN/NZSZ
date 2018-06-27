package com.ysrken.nzszserver.controller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ysrken.nzszserver.model.LiveInfo;
import com.ysrken.nzszserver.model.Pair;
import com.ysrken.nzszserver.model.Res;
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
	/** データキャッシュ */
	private final static Map<String, Pair<OffsetDateTime, List<LiveInfo>>> cache
		= new ConcurrentHashMap<>();
	private final static OffsetDateTime lastRefreshTime = OffsetDateTime.now();
    	
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
			// 定期的にメモリを掃除する
			synchronized(DownloadDataController.lastRefreshTime) {
				final var nowtime = OffsetDateTime.now();
				long localDiffHour = ChronoUnit.HOURS.between(DownloadDataController.lastRefreshTime, nowtime);
				if(localDiffHour >= 24) {
					synchronized(DownloadDataController.cache) {
						List<String> deleteList = new ArrayList<>();
						for(var entry : cache.entrySet()) {
							long localDiffSec = ChronoUnit.SECONDS.between(entry.getValue().getKey(), nowtime);
			                if(localDiffSec >= 60 * 60){
			                	deleteList.add(entry.getKey());
			                }
						}
						for(var key : deleteList) {
							cache.remove(key);
						}
					}
				}
			}
			
			// GETパラメーターを読み取る
			final var yearString = request.getParameter("year");
			final var monthString = request.getParameter("month");
			final var dayString = request.getParameter("day");
			final var year = Integer.parseInt(yearString);
			final var month = Integer.parseInt(monthString);
			final var day = Integer.parseInt(dayString);

			// キャッシュに情報が存在するかを判定し、あればそちらからデータを返す
			synchronized(DownloadDataController.cache) {
				final var key = String.format("%d-%d-%d", year, month, day);
				if(cache.containsKey(key)) {
					// キャッシュの取得時間を取得
					final var cacheDate = cache.get(key).getKey();
					System.out.println(String.format("Last-Modified of Cache on %d-%d-%d: %s",year, month, day, cacheDate.toString()));
	                // 現在時刻 - キャッシュの取得時間が1時間以内ならキャッシュのデータを使用する
	                final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
	                long localDiffSec = ChronoUnit.SECONDS.between(cacheDate, OffsetDateTime.now().withOffsetSameInstant(jst.getRules().getOffset(Instant.now())));
	                if(localDiffSec < 60 * 60){
	                	final var cacheData = cache.get(key).getValue();
	                	Res.json(response, cacheData.toArray(new LiveInfo[0]));
	                	return;
	                }
				}
			}
			
            // キャッシュに欲しい情報が存在しないので、データを更新する
            final var downloadData = WebApi.downloadLiveInfo(year, month, day, response);
            System.out.println(String.format("Count of Liveinfo on %d-%d-%d: %d",year, month, day, downloadData.size()));
            synchronized(DownloadDataController.cache) {
            	final var key = String.format("%d-%d-%d", year, month, day);
            	final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
            	final var cacheDate = OffsetDateTime.now().withOffsetSameInstant(jst.getRules().getOffset(Instant.now()));
            	cache.put(key, new Pair<OffsetDateTime, List<LiveInfo>>(cacheDate, downloadData));
            	System.out.println(String.format("Last-Modified of Cache on %d-%d-%d: %s",year, month, day, cacheDate.toString()));
            }
            Res.json(response, downloadData.toArray(new LiveInfo[0]));
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