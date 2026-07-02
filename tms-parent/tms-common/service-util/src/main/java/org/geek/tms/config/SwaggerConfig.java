package org.geek.tms.config;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger配置信息
 *
 * Swagger UI: http://localhost:9001/swagger-ui/index.html
 * knife4j UI: http://localhost:9001/doc.html
 * OpenAPI JSON: http://localhost:9001/v3/api-docs
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi webApiConfig() {
        return GroupedOpenApi.builder()
                .group("webApi")
                .displayName("医院挂号平台 API")
                .pathsToMatch("/api/**")
                .addOpenApiCustomizer(openApi -> openApi.info(webApiInfo()))
                .build();
    }

    @Bean
    public GroupedOpenApi adminApiConfig() {
        return GroupedOpenApi.builder()
                .group("adminApi")
                .displayName("医院后台管理 API")
                .pathsToMatch("/admin/**")
                .addOpenApiCustomizer(openApi -> openApi.info(adminApiInfo()))
                .build();
    }

    private Info webApiInfo() {
        return new Info()
                .title("医院挂号平台 API 文档")
                .description("医院挂号平台调用的接口")
                .version("1.0")
                .contact(new Contact().name("geekorigin").url("http://www.deepseek.com").email("3168850469@qq.com"));
    }

    private Info adminApiInfo() {
        return new Info()
                .title("医院后台管理 API 文档")
                .description("后台管理系统调用的接口")
                .version("1.0")
                .contact(new Contact().name("geekorigin").url("http://www.deepseek.com").email("3168850469@qq.com"));
    }

}
