---
layout: post
title:  "Loaders (WebGL shaders)"
date:   2018-05-28 00:00:00 +0300
categories: codepen
icon: hotoncodepen
tags: [javascript, animation, canvas, webgl, codepen]
thumb: "/images/e27d84b33cd0a44e1e4a0199feee1af6.jpg"
---

I'm still experimenting with shaders and I've created a couple of nice loaders. Do you think that WebGL shaders were created for something else? Maybe you're right... but it's easy to create interesting effects with them.

{% include codepen.html hash="LrPWRq" height="420" %}

This is an experiment and I think we shouldn't do it in production. The performance is very bad, especially on mobile devices. It's better to use SVG here.

{% include codepen.html hash="MXgGZG" height="420" %}
