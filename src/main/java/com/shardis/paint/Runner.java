package com.shardis.paint;

import io.vertx.core.Vertx;

public class Runner {

    public static void main(String[] args) {
        Vertx.vertx().deployVerticle(MainVerticle.class.getCanonicalName());
    }
}
