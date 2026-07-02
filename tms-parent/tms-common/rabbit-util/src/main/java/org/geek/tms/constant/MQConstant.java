package org.geek.tms.constant;

/**
 * RabbitMQ相关的常量
 * @author chemin
 */
public interface MQConstant {

    //------------- 与订单相关 --------------
    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_QUEUE = "order.queue";
    public static final String ORDER_ROUTING_KEY = "order.routing.key";

    //------------- 与支付相关 --------------
    public static final String ALIPAY_EXCHANGE = "alipay.exchange";
    public static final String ALIPAY_QUEUE = "alipay.queue";
    public static final String ALIPAY_ROUTING_KEY = "alipay.routing.key";

    //------------- 与短信相关 --------------
    public static final String SMS_EXCHANGE = "sms.exchange";
    public static final String SMS_QUEUE = "sms.queue";
    public static final String SMS_ROUTING_KEY = "sms.routing.key";

    //------------- 与定时任务相关 --------------
    public static final String TASK_EXCHANGE = "task.exchange";
    public static final String TASK_QUEUE_8 = "task.queue.8";
    public static final String TASK_ROUTING_KEY_8 = "task.8";

    //------------- 与canal监听binlog相关 --------------
    public static final String CANAL_EXCHANGE = "canal.exchange";
    public static final String CANAL_QUEUE = "canal.queue";
    public static final String CANAL_ROUTING_KEY = "canal.routing.key";

    //----------------- 失败策略 ------------------
    public static final String RECOVERER_EXCHANGE = "recoverer.exchange";
    public static final String RECOVERER_QUEUE = "recoverer.queue";
    public static final String RECOVERER_ROUTING_KEY = "recoverer";
}
