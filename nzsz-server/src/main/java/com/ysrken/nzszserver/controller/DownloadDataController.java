package com.ysrken.nzszserver.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Date;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ysrken.nzszserver.model.LiveInfo;
import com.ysrken.nzszserver.model.Res;

import lombok.var;

/**
 * 指定された日付の配信予定を返す
 * 
 * @author ysrken
 */
@SuppressWarnings("serial")
@WebServlet("/api/liveinfo")
public class DownloadDataController extends HttpServlet {
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

			// 結果を返却する(スタブ)
			if (year == 2018 && month == 6 && day == 17) {
				final var jst = ZoneId.of("JST", ZoneId.SHORT_IDS);
				final var liveInfo = new LiveInfo();
				liveInfo.setYoutuber("月ノ美兎");
				liveInfo.setDate(ZonedDateTime.of(2018, 6, 17, 15, 0, 0, 0, jst).toOffsetDateTime().toString());
				liveInfo.setSite("OPENREC.tv");
				liveInfo.setUrl("https://twitter.com/MitoTsukino/status/1008200445297188864");
				Res.json(response, new LiveInfo[] { liveInfo });
			} else {
				Res.json(response, new LiveInfo[] {});
			}
		} catch (NumberFormatException e) {
			// 引数ミスの場合の処理
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}
}