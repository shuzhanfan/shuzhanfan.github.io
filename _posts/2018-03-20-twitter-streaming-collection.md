---
layout:         post
title:          Geo-tagged tweets collection using Twitter Streaming API and database
subtitle:
card-image:     /assets/images/twitter.gif
date:           2018-03-20 15:00:00
tags:           [big&nbsp;data, nlp, python]
categories:     [database, data&nbsp;mining, nlp, python]
post-card-type: image
---

One research I'm working on is to use Twitter data to predict crime patterns. So, the first thing I need to do is to collect Twitter data. Specifically, since I'm interested in discovering the spatial patterns of crime, only geo-tagged tweets are collected. Based on the purpose of your own project, you might need to use **Twitter official REST API** if you want to search for specific sets of tweets, or use **Twitter official Streaming API** if you want to collect tweets in real time. The Streaming API is quite different from the REST API in that the REST API is used to **pull** data from Twitter but the streaming api **pushes** messages to a persistent session. In this blog post I'm going to discuss how to collect Twitter messages using Twitter Streaming API. In the next post, I'm going to talk about the use of Twitter REST API to collect tweets.

The python package I'm using is [<u>Tweepy</u>](http://docs.tweepy.org/en/v3.5.0/). The collected Twitter messages will be then stored into a database, either MySQL or MongoDB. The full codes are hosted on my [<u>Github repository</u>]().

## Tweepy

`Tweepy` is a Python package which enables users to more easily work with the [<u>official Twitter API</u>](https://developer.twitter.com/en/docs). It's sort of like a Python wrapper that bridges the communication between your own program and the Twitter API. Let's go straight to the code snippets.

The first thing we need to do is to register the client application with Twitter. [<u>Log in</u>](https://apps.twitter.com/) to Twitter Apps with your Twitter account and create a new application. Once you are done you should have your consumer key, consumer secret, access token and access token secret. Now, we import the packages and define the keys and access tokens.

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_import_config.py"></script>

Next, we create a `MyStreamListener` class. This class will later be used to create a `tweepy.Stream` object and connect to the Twitter Streaming API. We define the `on_connect()`, `on_data()` and `on_error()` methods. The parent `tweepy.StreamListener` class has alreary defined these methods. We overwrite the default ones to add our own intended logic.

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_mystreamlistener.py"></script>

The method `on_connect()` will be invoked once a successful response is received from the server. When the connection is established and raw data is received, the method `on_data()` will be called. **If** condition ensures that only tweets associated with coordinates information are received. The received tweet object is in JSON format. So we use `json.loads()` method to first decode JSON object to Python object. The collected tweet object has a long list of [<u>attributes</u>](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object). We are only interested in some of the attributes and we print them onto the terminal screen.

The method `on_error()` will be called when a non-200 status code is returned. [<u> HTTP Status codes</u>](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) are issued by a server in response to a browser's request made to the server. A successful HTTP request will return a status code 200. A special case in using Twitter API is the issue of [<u>rate limit</u>](https://developer.twitter.com/en/docs/basics/rate-limiting). Twitter limits the number of requests a user can make during a specific time window. The Twitter API will send a 420 status code if we're being rate limited.

## Database

Normally, we don't just want to print out the collected tweets on the terminal screen. We also want to store them for later analysis. Of course, you can choose to store all the collected tweets into a single file. But a more efficient and appropriate choice is to store them into a database.

### MySQL

Let's first look at how to store collected tweets into `MySQL`. We need a SQL connector to connect to a `MySQL` database in Python. I use `MySQLdb` package, but you are free to use the alternative. The first thing we need to do is to install `MySQL`. Check [<u>this post</u>](https://shuzhanfan.github.io/2017/12/install-and-setup-MySQL-on-Mac/) I wrote before about how to install and set up MySQL on Mac. Then we need to install `MySQLdb` package.

Before we import `MySQLdb` in our Python program, we should create a database and a table first. Add a database called `twitter`:

```sql
mysql> CREATE DATABASE twitter;
```

A `twitter` database is created. Use the database with `USE` command:

```sql
mysql> USE twitter;
```

Then, create a table called `twitter_stream_collect` which we are going to use to store the data.

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_create_table.sql"></script>

Now, we define a method to create a connection to the `twitter` database, execute and commit the query.

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_mysql_query.py"></script>

### MongoDB

Another option for the use of database is MongoDB. Unlike MySQL, MongoDB is a NoSQL database. It stores data in flexible, JSON-like documents. You don't have to define a schema before the use of a database.

We define a method to create a database, connect to it, and store data into it:

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_mongodb.py"></script>

Both of the `mysql_store()` and `mongodb_store()` methods are invoked inside `on_data()`. Check my [<u>Git repository</u>]() for full codes.

## Run collecting

The final step is to authenticate with our keys and access tokens, instantiate the `MyStreamListener` class, connect to the Twitter streaming API, and filter the collected tweets will **locations** filtering criteria.

<script src="https://gist.github.com/shuzhanfan/9c5d7be391fdec62a25d72914fe3b8cd.js?file=twitter_stream_run.py"></script>

Now, you can collect Twitter screaming data in real time and store them into database.
