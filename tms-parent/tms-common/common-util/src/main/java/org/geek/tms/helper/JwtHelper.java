package org.geek.tms.helper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * @Author chenmin
 * @Description Jwt令牌
 */
public class JwtHelper {

    //设置访问令牌有效期 2h
    private static final long TOKEN_EXPIRATION = 2*60*60*1000;
    //设置刷新令牌有效期 3*24h
    private static final long REFRESH_TOKEN_EXPIRATION = 3*24*60*60*1000;

    //秘钥   至少32字符
    private static final String TOKEN_SIGN_KEY = "com.geek.yygh.1o157y0eqzdce1z.secret.key";

    // 获取签名密钥
    private static SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(TOKEN_SIGN_KEY.getBytes(StandardCharsets.UTF_8));
    }

    //生成Token访问令牌
    public static String createToken(Long userId, String userName) {
        String token = Jwts.builder()
                .subject("YYGH-USER")
                .expiration(new Date(System.currentTimeMillis() + TOKEN_EXPIRATION))
                .claim("userId", userId)
                .claim("userName", userName)
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
        return token;
    }

    //生成Token刷新令牌
    public static String createRefreshToken(Long userId, String userName) {
        String token = Jwts.builder()
                .subject("YYGH-USER")
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .claim("userId", userId)
                .claim("userName", userName)
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
        return token;
    }

    //刷新Token
    public static String refreshToken(String token) {
        if (!StringUtils.hasLength(token)) {
            return null;
        }
        String refreshedToken;
        try {
            // 解析原始令牌，获取令牌中的声明
            final Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            //使用原始令牌中的信息创建一个新的令牌
            refreshedToken = JwtHelper.createRefreshToken(getUserId(token), getUserName(token));
        } catch (Exception e) {
            // 发生异常时，将刷新令牌设置为null
            refreshedToken = null;
        }
        return refreshedToken;
    }

    //通过token获取用户ID
    public static Long getUserId(String token) {
        if (!StringUtils.hasLength(token)) {
            return null;
        }
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Object userIdObj = claims.get("userId");
        if (userIdObj instanceof Integer) {
            return ((Integer) userIdObj).longValue();
        } else if (userIdObj instanceof Long) {
            return (Long) userIdObj;
        }
        return null;
    }

    //通过token获取用户姓名
    public static String getUserName(String token) {
        if (!StringUtils.hasLength(token)) {
            return null;
        }
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return (String)claims.get("userName");
    }


    //判断token是否有效
    public static boolean isExpiration(String token) {
        if (!StringUtils.hasLength(token)) {
            return true;
        }
        try {
            boolean isExpire = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration().before(new Date());
            //没有过期，有效，返回false
            return isExpire;
        } catch (Exception e) {
            //过期出现异常，返回true
            return true;
        }
    }

    // 判断 token 是否有效（未过期且未损坏）
    public static boolean isValid(String token) {
        if (!StringUtils.hasLength(token)) {
            return false;
        }
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public static void main(String[] args) {
        String token = JwtHelper.createToken(2L, "李四");
        //eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJScvL3D9ENDXYNUtJRSq0oULIyNDexNDE3Nzcz1VEqLU4t8kxRsjKCMP0Sc1OBWp7N7Xs6e7ZSLQCkMCnHQwAAAA.k1k-SedXIYLFQP05cHUadjgvKDcIb-RcuL2rir7SO0RwtfcHr0lmoggZCB53u0AYaJLpgH65ziJIW1o7x2tK2A
        System.out.println(token);
        System.out.println(JwtHelper.getUserId(token));
        System.out.println(JwtHelper.getUserName(token));
        System.out.println("Is Expired: " + JwtHelper.isExpiration(token));
    }

}
