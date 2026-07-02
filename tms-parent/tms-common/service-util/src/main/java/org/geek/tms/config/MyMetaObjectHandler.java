package org.geek.tms.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * @Description TODO
 * @Author chenmin
 * @Date 2022/8/2 10:23
 */
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    //插入时填充
    @Override
    public void insertFill(MetaObject metaObject) {
        //HospSet设置状态  1可用  0不可用 metaObject.setValue("status",1);
        metaObject.setValue("createTime",new Date());
        metaObject.setValue("updateTime",new Date());
    }

    //更新时填充
    @Override
    public void updateFill(MetaObject metaObject) {
        metaObject.setValue("updateTime",new Date());
    }
}
