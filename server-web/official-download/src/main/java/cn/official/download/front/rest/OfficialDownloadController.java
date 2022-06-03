package cn.official.download.front.rest;

import cn.official.download.front.model.BaseSoftware;
import cn.official.download.front.model.BaseType;
import cn.official.download.front.model.param.BaseSoftwareParam;
import cn.official.download.front.service.OfficialDownloadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author LYF
 */
@RestController
@RequestMapping("/official-download")
@Tag(name = "前端接口")
public class OfficialDownloadController {

    @Autowired
    OfficialDownloadService officialDownloadService;

    @Operation(summary ="获取所有分类")
    @GetMapping("/getAllType")
    public List<BaseType> getAllType(){
        return officialDownloadService.getAllType();
    }
    @Operation(summary ="获取所有软件")
    @GetMapping("/getBaseSoftwareByParam")
    public List<BaseSoftware> getBaseSoftwareByParam(BaseSoftwareParam param){
        return officialDownloadService.getBaseSoftwareByParam(param);
    }

}
