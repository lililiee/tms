package org.geek.tms.controller;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.geek.tms.service.IOmsOrderService;
import org.geek.tms.entiy.OmsOrder;
import org.geek.tms.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 订单管理前端控制器
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Tag(name = "订单管理接口")
@RestController
@RequestMapping("/oms/oms-order")
public class OmsOrderController {

    @Autowired
    private IOmsOrderService omsOrderService;

    @Operation(summary = "新增订单")
    @PostMapping("save")
    public Result<Void> save(@RequestBody OmsOrder omsOrder) {
        boolean isSuccess = omsOrderService.save(omsOrder);
        return isSuccess ? Result.ok() : Result.fail();
    }

    @Operation(summary = "根据ID逻辑删除订单")
    @DeleteMapping("remove/{id}")
    public Result<Void> removeById(
            @Parameter(name = "id", description = "订单ID", required = true)
            @PathVariable Long id) {
        boolean isSuccess = omsOrderService.removeById(id);
        return isSuccess ? Result.ok() : Result.fail();
    }

    @Operation(summary = "修改订单信息")
    @PutMapping("update")
    public Result<Void> updateById(@RequestBody OmsOrder omsOrder) {
        boolean isSuccess = omsOrderService.updateById(omsOrder);
        return isSuccess ? Result.ok() : Result.fail();
    }

    @Operation(summary = "根据ID获取单个订单")
    @GetMapping("get/{id}")
    public Result<OmsOrder> getById(
            @Parameter(name = "id", description = "订单ID", required = true)
            @PathVariable Long id) {
        OmsOrder omsOrder = omsOrderService.getById(id);
        return Result.ok(omsOrder);
    }

    @Operation(summary = "条件分页查询订单列表")
    @PostMapping("findPage/{page}/{limit}")
    public Result<Page<OmsOrder>> findPage(
            @Parameter(name = "page", description = "当前页码", required = true)
            @PathVariable Long page,
            @Parameter(name = "limit", description = "每页记录数", required = true)
            @PathVariable Long limit,
            @RequestBody(required = false) OmsOrder queryVo) {

        // 1. 创建 MyBatis-Plus 分页对象
        Page<OmsOrder> pageParam = new Page<>(page, limit);

        // 2. 组装查询条件
        LambdaQueryWrapper<OmsOrder> queryWrapper = new LambdaQueryWrapper<>();
        if (queryVo != null) {
            // 按订单号模糊查询
            queryWrapper.like(StringUtils.hasText(queryVo.getOrderNo()), OmsOrder::getOrderNo, queryVo.getOrderNo());
            // 按渠道类型精确查询
            queryWrapper.eq(StringUtils.hasText(queryVo.getChannelType()), OmsOrder::getChannelType, queryVo.getChannelType());
            // 按温区精确查询
            queryWrapper.eq(StringUtils.hasText(queryVo.getTemperatureZone()), OmsOrder::getTemperatureZone, queryVo.getTemperatureZone());
            // 按订单状态精确查询
            queryWrapper.eq(StringUtils.hasText(queryVo.getStatus()), OmsOrder::getStatus, queryVo.getStatus());
            // 按客户名称模糊查询
            queryWrapper.like(StringUtils.hasText(queryVo.getCustomerName()), OmsOrder::getCustomerName, queryVo.getCustomerName());
        }

        // 按照创建时间降序排序
        queryWrapper.orderByDesc(OmsOrder::getCreateTime);

        // 3. 执行查询
        Page<OmsOrder> pageModel = omsOrderService.page(pageParam, queryWrapper);
        return Result.ok(pageModel);
    }
}
