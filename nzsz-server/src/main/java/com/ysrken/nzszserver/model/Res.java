package com.ysrken.nzszserver.model;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.appengine.repackaged.com.google.gson.Gson;

/**
 * HTTPレスポンスを構成する 参考：
 * https://web-dev.hatenablog.com/entry/java/servlet/dev-restful-app/java2
 * 
 * @author ysrken
 */
public class Res {
	static ObjectMapper mapper = new ObjectMapper();

	/**
	 * 引数をjson化して、その結果をレスポンスボディに返す
	 * 
	 * @param res
	 *            HTTPレスポンス
	 * @param toJson
	 *            json化したい引数
	 * @throws IOException
	 *             書き込みに失敗した際に送出される例外
	 */
	public static void json(HttpServletResponse res, Object toJson) throws IOException {
		res.setContentType("application/json");
		res.setCharacterEncoding("utf-8");
		res.getWriter().println(mapper.writeValueAsString(toJson));
	}
}
