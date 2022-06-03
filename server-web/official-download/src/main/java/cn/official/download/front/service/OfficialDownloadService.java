package cn.official.download.front.service;

import cn.official.download.front.model.BaseSoftware;
import cn.official.download.front.model.BaseType;
import cn.official.download.front.model.param.BaseSoftwareParam;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author LYF
 */
public interface OfficialDownloadService {
    List<BaseType> getAllType();

    List<BaseSoftware> getBaseSoftwareByParam(BaseSoftwareParam param);
}
