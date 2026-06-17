package com.example.library.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import java.net.URI;
import java.net.URISyntaxException;
import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource(DataSourceProperties props) throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            URI uri = new URI(databaseUrl);
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath();
            String userInfo = uri.getUserInfo();
            String[] parts = userInfo.split(":");
            HikariDataSource ds = new HikariDataSource();
            ds.setJdbcUrl(jdbcUrl);
            ds.setUsername(parts[0]);
            ds.setPassword(parts[1]);
            ds.setDriverClassName(props.getDriverClassName());
            return ds;
        }
        return props.initializeDataSourceBuilder().build();
    }
}
