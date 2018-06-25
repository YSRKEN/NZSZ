package com.ysrken.nzszserver.model;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import lombok.Data;

@Data
public class LiveInfo {
    /** 配信者名 */
    String youtuber = "？";
    /** 配信日時 */
    String date = OffsetDateTime.now().toString();
    /** 配信サイト */
    String site = "？";
    /** 配信URL */
    String url = "";
}
