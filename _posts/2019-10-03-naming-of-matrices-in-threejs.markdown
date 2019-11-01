---
layout: post
title:  "Naming of the matrices in three.js"
date:   2019-10-03 00:00:00 +0300
categories: other
tags: [javascript, webgl, other]
thumb: "/images/b7a6645ba244d4297592eafec0fdf213.jpg"
---

Most of the books on computer graphics include a scheme of the OpenGL/WebGL transformation pipeline. There are four fundamental transforms in it - a model transform, a view transform, a projection transform and a viewport transform. When I started learning three.js I was confused, because it uses several naming conventions at once. It's really hard to understand who is who, especially for beginner. I painted this diagram to explain to myself what names have matrices in CG theory, what names three.js passes to the shaders and what names we have in javascript for the same matrices. I hope this cheat sheet will be helpful not for me only.

