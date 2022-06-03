package cn.official.download.front.dao;

import cn.official.download.front.model.BaseSoftware;
import cn.official.download.front.model.param.BaseSoftwareParam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BaseSoftwareRepository extends JpaRepository<BaseSoftware, Integer>, JpaSpecificationExecutor<BaseSoftware> {

}
