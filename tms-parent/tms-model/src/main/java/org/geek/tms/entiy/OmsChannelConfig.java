package org.geek.tms.entiy;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 渠道接入配置表
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("oms_channel_config")
@Schema(name="OmsChannelConfig对象", description="渠道接入配置表")
public class OmsChannelConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "渠道名称")
    private String channelName;

    @Schema(description = "渠道类型：ERP/WMS/E_COMMERCE/B_CLIENT/EDI")
    private String channelType;

    @Schema(description = "认证方式：API_KEY/OAUTH/SIGNATURE")
    private String authType;

    @Schema(description = "接入地址")
    private String endpointUrl;

    @Schema(description = "API密钥（加密存储）")
    private String apiKey;

    @Schema(description = "每秒限流次数")
    private Integer rateLimit;

    @Schema(description = "启用状态，默认1")
    private Integer enabled;

    @Schema(description = "最后同步时间")
    private LocalDateTime lastSyncTime;

    @Schema(description = "健康状态：ONLINE/OFFLINE/ABNORMAL")
    private String healthStatus;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}