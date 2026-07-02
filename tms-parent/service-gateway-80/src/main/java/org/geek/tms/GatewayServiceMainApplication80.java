package org.geek.tms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * TODO
 *
 * @author 86134
 * @since 2026/7/2
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayServiceMainApplication80 {
    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceMainApplication80.class, args);
    }
}
