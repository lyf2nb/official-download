package cn.official.download.front.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "base_software")
public class BaseSoftware implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @Id
    @Column(name = "code", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;

    /**
     * 软件名称
     */
    @Column(name = "name")
    private String name;

    /**
     * 别名
     */
    @Column(name = "alias")
    private String alias;

    /**
     * logo地址
     */
    @Column(name = "logo_url")
    private String logoUrl;

    /**
     * 官网地址
     */
    @Column(name = "official_website")
    private String officialWebsite;

    /**
     * 下载地址
     */
    @Column(name = "download_link")
    private String downloadLink;

    /**
     * 网盘连接
     */
    @Column(name = "pan_url")
    private String panUrl;

    /**
     * 教程地址,推荐pdf
     */
    @Column(name = "tutorial_url")
    private String tutorialUrl;

    /**
     * 点赞数 （小于负10删除网盘连接）
     */
    @Column(name = "like_num")
    private Integer likeNum;

    /**
     * 平替软件名
     */
    @Column(name = "affordable_alternative")
    private String affordableAlternative;

    /**
     * 类型
     */
    @Column(name = "software_type")
    private Integer softwareType;

}
