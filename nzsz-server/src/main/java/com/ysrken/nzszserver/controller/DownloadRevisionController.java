package com.ysrken.nzszserver.controller;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ysrken.nzszserver.model.Res;

/**
 * 最新版のリビジョン番号を返す
 * 
 * @author ysrken
 */
@SuppressWarnings("serial")
@WebServlet("/api/revision/latest")
public class DownloadRevisionController extends HttpServlet {
	private final int revision = 8;

	/**
	 * 最新版のリビジョン番号を返す
	 * 
	 * @param request
	 *            HTTPリクエスト
	 * @param response
	 *            HTTPレスポンス
	 */
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Res.json(response, Collections.singletonMap("revision", revision));
	}
}
