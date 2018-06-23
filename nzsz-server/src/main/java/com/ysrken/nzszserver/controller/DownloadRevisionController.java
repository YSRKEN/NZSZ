package com.ysrken.nzszserver.controller;

import com.ysrken.nzszserver.model.LiveInfo;
import lombok.Data;
import lombok.var;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * 最新版のリビジョン番号を返すController
 */
@RestController
@RequestMapping("/api")
public class DownloadRevisionController {
    private final static int revision = 8;

    /**
     * 最新版のリビジョン番号を返す
     * @return 最新版のリビジョン番号
     */
    @CrossOrigin("http://localhost:4200")
    @GetMapping("/revision/latest")
    public RevisionResponse getLiveInfoList(){
        return new RevisionResponse(){{setRevision(DownloadRevisionController.revision);}};
    }
}

@Data
class RevisionResponse{
    private int revision;
}