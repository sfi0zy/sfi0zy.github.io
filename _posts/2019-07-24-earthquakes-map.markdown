---
layout: post
title:  "Earthquakes map"
date:   2019-07-24 00:00:00 +0300
categories: dev
tags: [javascript, canvas, webgl, threejs, github]
thumb: "/images/edb1432842bd384ab323daa9f1143c16.jpg"
---

A couple of days ago I received the email with the rules for the #codepenchallenge. I started writing the demo for it, but it was getting bigger and bigger. So I pushed it to <a href='https://github.com/sfi0zy/earthquakes-map'>GitHub repo</a> instead. This is a WebGL globe with points for all earthquakes with magnitude more than 5 which happened last year. The <a href='https://sfi0zy.github.io/earthquakes-map'>live demo is here</a>. This is an alpha version, so I recommend to use Google Chrome.

<div class='mui-media-view -full-width _separate-1'>
    <div class='lazy-image-wrapper' data-modal-opener='modal-funny-earth'>
        {% svg '/images/7b9e9ad94626c8f4008472f6aefe9333.jpg-1.svg' class='mui-image -rounded -placeholder' %}
        <img class='mui-image -rounded -js-lazy-load' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' data-src='/images/7b9e9ad94626c8f4008472f6aefe9333.jpg' alt='Funny Earth' itemprop='image'>
        <noscript>
            <img class='mui-image -rounded' src='/images/7b9e9ad94626c8f4008472f6aefe9333.jpg' alt='Funny Earth' itemprop='image'>
        </noscript>
    </div>
    <div class='mui-modal-window' id='modal-funny-earth'>
        <div class='window _shadow-3'>
            <div class='lazy-image-wrapper'>
                {% svg '/images/7b9e9ad94626c8f4008472f6aefe9333.jpg-2.svg' class='mui-image -rounded -placeholder' %}
                <img class='mui-image -rounded -js-lazy-load' data-src='/images/7b9e9ad94626c8f4008472f6aefe9333.jpg' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' alt='Funny Earth' itemprop='image'>
            </div>
            <div class='closeicon'>
                <svg class='mui-svg-icon'>
                    <use xlink:href='#mui-svg-icon--close'></use>
                </svg>
            </div>
        </div>
        <div class='mui-shadow-toggle'></div>
    </div>
    <div class='description'>No comments :-)</div>
</div>

