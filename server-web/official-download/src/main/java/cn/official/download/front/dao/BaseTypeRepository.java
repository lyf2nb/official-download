package cn.official.download.front.dao;

import cn.official.download.front.model.BaseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BaseTypeRepository extends JpaRepository<BaseType, Integer>, JpaSpecificationExecutor<BaseType> {

}
