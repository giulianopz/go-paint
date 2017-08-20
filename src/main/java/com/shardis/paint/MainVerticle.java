package com.shardis.paint;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;

public class MainVerticle extends AbstractVerticle {

    @Override
    public void start() {
        final Router router = Router.router(vertx);

        BridgeOptions bridgeOptions = new BridgeOptions()
                .addInboundPermitted(new PermittedOptions().setAddress("client.paint"))
                .addOutboundPermitted(new PermittedOptions().setAddress("client.paint"));

        SockJSHandler sockJSHandler = SockJSHandler
                .create(vertx)
                .bridge(bridgeOptions);
        router.route("/eventbus/*").handler(sockJSHandler);

        StaticHandler staticHandler = StaticHandler
                .create()
                .setWebRoot("src/main/resources/webroot")
                .setCachingEnabled(false);
        router.route().handler(staticHandler);

        vertx.createHttpServer()
                .requestHandler(router::accept)
                .listen(8080, res -> {
                    if (res.succeeded()) {
                        System.out.println("Server is running at http://localhost:8080/");
                    } else {
                        res.cause().printStackTrace();
                    }
                });
    }
}
