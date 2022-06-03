package cn.official.download.front.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "base_banner")
public class BaseBanner implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @Id
    @Column(name = "code", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;

    /**
     * 图片地址
     */
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * 点击后去的地址
     */
    @Column(name = "banner_url")
    private String bannerUrl;

    /**
     * 是否可以点击
     */
    @Column(name = "disabled")
    private Integer disabled;

}
