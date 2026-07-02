package org.geek.tms.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.geek.tms.mapper.OmsOrderItemMapper;
import org.geek.tms.service.IOmsOrderItemService;
import org.geek.tms.entiy.OmsOrderItem;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 订单货品明细表 服务实现类
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Service
public class OmsOrderItemServiceImpl extends ServiceImpl<OmsOrderItemMapper, OmsOrderItem> implements IOmsOrderItemService {

}
