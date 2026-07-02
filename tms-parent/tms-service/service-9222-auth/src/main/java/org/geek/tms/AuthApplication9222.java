package org.geek.tms;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * TODO
 *
 * @author 86134
 * @since 2026/7/1
 */
@EnableFeignClients
@MapperScan("org.geek.tms.mapper")
@SpringBootApplication
public class AuthApplication9222 {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication9222.class, args);
    }

}
