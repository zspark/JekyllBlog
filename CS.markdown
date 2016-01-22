---
layout: page
title: ComputerGraphics
permalink: /cs/
---
{% for post in site.posts %}
{% assign cat = post.categories | array_to_sentence_string %}
{% if cat == 'jekyll and CG' or cat == 'jekyll and cg' %}
 <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}   <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span></a>
{% endif %}
{% endfor %}

