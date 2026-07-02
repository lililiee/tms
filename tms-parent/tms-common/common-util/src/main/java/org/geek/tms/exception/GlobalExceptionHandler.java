package org.geek.tms.exception;

import org.geek.tms.result.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @Author chenmin
 * @Description TODO
 *
 * 使用  @RestControllerAdvice + @ExceptionHandler(XxxException.class)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    //全局异常处理类
    @ExceptionHandler(Exception.class)
    public Result error(Exception e) {
        e.printStackTrace();
        return Result.fail();
    }


    //自定义异常处理方法
    @ExceptionHandler(YyghException.class)
    public Result error(YyghException e){
        return Result.build(e.getCode(), e.getMessage());
    }
}