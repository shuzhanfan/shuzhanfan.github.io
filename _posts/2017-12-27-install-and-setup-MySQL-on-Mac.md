---
layout:         post
title:          How to install and set up MySQL on Mac
subtitle:
card-image:     /assets/images/takeiteasy.gif
date:           2017-12-27 17:00:00
tags:           [database]
categories:     [database]
post-card-type: image
---

MySQL is probably the most popular open source SQL relational database. Unfortunately, MacOS doesn't ship with MySQL. I still remember when I took my first database class years ago, the professor handed everyone a small piece of paper containing a username and a password in the very first lecture. We had to use these credentials to log on to the class server which has MySQL installed, in order to practice writing SQL commands.

What if we have MySQL installed on our Mac and can connect to it by typing commands from the terminal? That would be much more convenient for us to play with SQL and more importantly, we can create databases and store data into them for our own projects. However, I found it somewhat difficult to install on my laptop, which is running an OS X operating system. In this blog post I'll show you step by step how to get MySQL up and running.

## 1. Install Homebrew

First, we install the macOS software package manager [<u>Homebrew</u>](https://brew.sh/). It helps us facilitate the installment of Unix/Linux software packages. Type the following in a Terminal prompt:

```sh
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## 2. Install MySQL

We can then use Homebrew to install MySQL. Type the following command to check the latest version of MySQL on Homwbrew:

```sh
$ brew info mysql
```

The expected output should be something like this:

```sh
$ mysql: stable 5.7.20 (bottled), devel 8.0.3-rc
```

We then install MySQL:

```sh
$ brew install mysql
```

If no warning or error message shows up, you have MySQL installed successfully.

## 3. Load MySQL service

Next, launch the MySQL service from Homebrew. The first step is to install brew services:

```sh
$ brew tap homebrew/services
```

Then, start MySQL service:

```sh
$ brew services start mysql
````

The expected output should be something like this:

```sh
$ ==> Successfully started `mysql` (label: homebrew.mxcl.mysql)
```

Check if MySQL has been loaded:

```sh
$ brew services list
```

The expected output should contain something like this:

```sh
$ mysql started shuzhan /Users/shuzhan/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```

## 4. Connect to MySQL server

Finally, we can connect to the MySQL server. We connect to it as the superuser **root**:

```sh
$ mysql -u root -p
```

You will be required to enter your root password. Enter that password, you are connected to the MySQL server. Type `exit` to disconnect to the MySQL server.
