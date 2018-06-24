package com.ysrken.nzszserver.model;

import java.time.ZonedDateTime;

import lombok.Data;

/**
 * 配信予定を表すModel
 */
@Data
public class LiveInfo {
    /** 配信者名 */
    String youtuber = "？";
    /** 配信日時 */
    String date = ZonedDateTime.now().toString();
    /** 配信サイト */
    String site = "？";
    /** 配信URL */
    String url = "";
}
