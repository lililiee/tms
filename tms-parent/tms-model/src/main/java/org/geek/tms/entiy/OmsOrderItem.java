package org.geek.tms.entiy;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 订单货品明细表
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("oms_order_item")
@Schema(name="OmsOrderItem对象", description="订单货品明细表")
public class OmsOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "订单ID，索引")
    private Long orderId;

    @Schema(description = "货品编号")
    private String materialCode;

    @Schema(description = "货品名称")
    private String materialName;

    @Schema(description = "品类：FROZEN_PASTRY/INSTANT_MEAL/SALAD/FRESH_MEAT 等")
    private String category;

    @Schema(description = "温区：FROZEN/COLD/AMBIENT")
    private String temperatureZone;

    @Schema(description = "件数")
    private Integer quantity;

    @Schema(description = "单件重量(kg)")
    private BigDecimal weight;

    @Schema(description = "单件体积(m³)")
    private BigDecimal volume;

    @Schema(description = "包装：CARTON/PLASTIC_BIN/VACUUM_BAG")
    private String packageType;

    @Schema(description = "包装规格描述")
    private String packageSpec;

    @Schema(description = "堆叠高度限制(mm)")
    private Integer stackHeightLimit;

    @Schema(description = "混装禁忌（逗号分隔物料编码）")
    private String mixingTaboo;

    @Schema(description = "是否单独隔离，默认0")
    private Integer isolated;

    @Schema(description = "乙烯释放等级 1-5")
    private Integer ethyleneLevel;

    @Schema(description = "湿度敏感等级 1-5")
    private Integer humiditySensitivity;


}
