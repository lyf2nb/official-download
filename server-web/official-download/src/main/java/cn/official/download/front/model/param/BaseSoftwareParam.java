package cn.official.download.front.model.param;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author LYF
 */
@Data
public class BaseSoftwareParam {
    private String keyword;
    private Integer type;
    private Integer page;
}
