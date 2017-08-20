package com.shardis.paint;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;

import java.util.concurrent.atomic.AtomicLong;

public class MainVerticle extends AbstractVerticle {

    @Override
    public void start() {
        final Router router = Router.router(vertx);

        BridgeOptions bridgeOptions = new BridgeOptions()
                .addInboundPermitted(new PermittedOptions().setAddress("client.paint"))
                .addInboundPermitted(new PermittedOptions().setAddress("client.paint.clear"))
                .addOutboundPermitted(new PermittedOptions().setAddress("client.paint"))
                .addOutboundPermitted(new PermittedOptions().setAddress("client.paint.clear"));

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

        AtomicLong messageCounter = new AtomicLong(0);
        AtomicLong lastStatsTime = new AtomicLong(System.currentTimeMillis());
        vertx.eventBus().localConsumer("client.paint", msg -> {
            messageCounter.incrementAndGet();
            long messageTime = System.currentTimeMillis();
            long timeDelta = messageTime - lastStatsTime.get();
            if (timeDelta > 60_000) {
                System.out.println("Messages per minute: " + (messageCounter.get() / (timeDelta / 60_000)));
                messageCounter.set(0);
                lastStatsTime.set(messageTime);
            }
        });
    }
}
