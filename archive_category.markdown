---
layout: page
title: Category
permalink: /category/
---


<ul class="listing">
{% for category in site.categories %}
<li class="listing-seperator">{{ category | first }}</li>
<!-- <h2>{{ category | first }}</h2> </span>{{ category | last | size }}</span> -->
{% for post in category.last %} 
  <li class="listing-item">
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul> 
