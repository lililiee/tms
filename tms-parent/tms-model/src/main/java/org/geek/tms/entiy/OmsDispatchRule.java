package org.geek.tms.entiy;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
// 替换为 Swagger 3 的导包
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 分单拆单规则表
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("oms_dispatch_rule")
// 替换为 @Schema 注解，注意 value 改为 name
@Schema(name = "OmsDispatchRule对象", description = "分单拆单规则表")
public class OmsDispatchRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "规则名称")
    private String ruleName;

    @Schema(description = "类型：DISPATCH(分单)/SPLIT(拆单)")
    private String ruleType;

    @Schema(description = "温区过滤（逗号分隔）")
    private String zoneFilter;

    @Schema(description = "区域过滤（JSON:省份城市列表）")
    private String regionFilter;

    @Schema(description = "时效过滤：NORMAL/URGENT/INSTANT")
    private String timeFilter;

    @Schema(description = "规则优先级，越小越高")
    private Integer priority;

    @Schema(description = "启用：0否 1是，默认1")
    private Integer enabled;

    @Schema(description = "扩展配置JSON")
    private String configJson;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

}