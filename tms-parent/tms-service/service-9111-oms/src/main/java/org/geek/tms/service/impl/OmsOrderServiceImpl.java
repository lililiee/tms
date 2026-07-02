package org.geek.tms.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.geek.tms.mapper.OmsOrderMapper;
import org.geek.tms.service.IOmsOrderService;
import org.geek.tms.entiy.OmsOrder;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 订单主表 服务实现类
 * </p>
 *
 * @author author
 * @since 2026-07-01
 */
@Service
public class OmsOrderServiceImpl extends ServiceImpl<OmsOrderMapper, OmsOrder> implements IOmsOrderService {

}
