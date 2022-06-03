package cn.official.download.front.dao;

import cn.official.download.front.model.BaseBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BaseBannerRepository extends JpaRepository<BaseBanner, Integer>, JpaSpecificationExecutor<BaseBanner> {

}
