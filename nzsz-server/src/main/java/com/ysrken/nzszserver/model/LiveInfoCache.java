package com.ysrken.nzszserver.model;

import lombok.Data;

import javax.persistence.*;
import java.time.ZonedDateTime;
import java.util.Date;

@Entity
@Data
public class LiveInfoCache {
    /** 主キー */
    @Column
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    /** 年 */
    @Column private int year;
    /** 月 */
    @Column private int month;
    /** 日 */
    @Column private int day;
    /** 取得日時 */
    @Column private String cacheDate;
    /** 配信者名 */
    @Column private String youtuber;
    /** 配信日時 */
    @Column private String date;
    /** 配信サイト */
    @Column private String site;
    /** 配信URL */
    @Column private String url;
}
