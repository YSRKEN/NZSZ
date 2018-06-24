package com.ysrken.nzszserver.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

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