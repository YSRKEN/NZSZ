package com.ysrken.nzszserver.repository;

import com.ysrken.nzszserver.model.LiveInfoCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveInfoRepository extends JpaRepository<LiveInfoCache, Long> {
    public List<LiveInfoCache> findByYearAndMonthAndDay(int year, int month, int day);
}
