package com.ysrken.nzszserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 「NZSZ」用のRESTサーバー
 */
@SpringBootApplication
public class NzszServerApplication {
	/**
	 * maineメソッド
	 * @param args コマンドライン引数
	 */
	public static void main(String[] args) {
		SpringApplication.run(NzszServerApplication.class, args);
	}
}
