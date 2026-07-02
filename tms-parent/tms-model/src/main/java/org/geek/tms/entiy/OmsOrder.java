package org.geek.tms.entiy;

import java.math.BigDecimal;
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
 * 订单主表
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("oms_order")
@Schema(name="OmsOrder对象", description="订单主表")
public class OmsOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "订单唯一编号，唯一索引")
    private String orderNo;

    @Schema(description = "来源渠道：ERP/WMS/E_COMMERCE/B_CLIENT/EDI")
    private String channelType;

    @Schema(description = "渠道原始订单号")
    private String channelOrderNo;

    @Schema(description = "客户名称")
    private String customerName;

    @Schema(description = "客户电话")
    private String customerPhone;

    @Schema(description = "收货地址")
    private String deliveryAddress;

    @Schema(description = "收货经度")
    private BigDecimal deliveryLng;

    @Schema(description = "收货纬度")
    private BigDecimal deliveryLat;

    @Schema(description = "收货时间窗开始")
    private LocalDateTime deliveryTimeStart;

    @Schema(description = "收货时间窗结束")
    private LocalDateTime deliveryTimeEnd;

    @Schema(description = "温区：FROZEN/COLD/AMBIENT")
    private String temperatureZone;

    @Schema(description = "优先级：1普通 2优先 3紧急，默认1")
    private Integer priorityLevel;

    @Schema(description = "订单状态：PENDING/DISPATCHED/LOADING/IN_TRANSIT/DELIVERED/SIGNED/CANCELLED")
    private String status;

    @Schema(description = "总重量(kg)")
    private BigDecimal totalWeight;

    @Schema(description = "总体积(m³)")
    private BigDecimal totalVolume;

    @Schema(description = "总件数")
    private Integer totalQuantity;

    @Schema(description = "生产批号")
    private String productionBatch;

    @Schema(description = "出库单号")
    private String outboundNo;

    @Schema(description = "分配承运商ID")
    private Long carrierId;

    @Schema(description = "分配车辆ID")
    private Long vehicleId;

    @Schema(description = "路径方案ID")
    private Long routePlanId;

    @Schema(description = "配载方案ID")
    private Long loadingPlanId;

    @Schema(description = "最近ERP同步时间")
    private LocalDateTime erpSyncTime;

    @Schema(description = "最近WMS同步时间")
    private LocalDateTime wmsSyncTime;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

    @Schema(description = "逻辑删除，默认0")
    private Integer deleted;


}
