---
layout:         post
title:          Using Python subprocess for parallel processing
subtitle:       
card-image:     /assets/images/runningman.gif
date:           2017-12-17 10:00:00
tags:           [python]
categories:     [python, parallel&nbsp;processing]
post-card-type: image
---

Unlike Javascript, which is naturally asynchronous, Python interpreter executes codes in a sequential order. The subsequent jobs have to wait until the completeness of the previous ones. This behavior sometimes has disadvantages, especially when the processing time for certain jobs in the queue is fairly long and the subsequent jobs do not really rely on the results of previous ones. This raises a question: Could we take advantage of the waiting time in an efficient way and possibly parallelize the workflow of processing of the sequential jobs.

Well, the answer is of course yes. Let me give you an example of a problem I often came across in my work. Everyday I have to run scripts to process satellite data. The scripts will first read raw data files, each file corresponding to one frame (a frame corresponds to a specific area on earth at a specific time). The scripts read data and process them sequentially, one at a time. This is highly inefficient and takes a lot of time for the whole processing to be done. I was then thinking if there is a way to make the processing of the different files parallel, which means they are all processed concurrently. And Python [`subprocess`](https://docs.python.org/3/library/subprocess.html) module came to the rescue.

## Subprocess module
According to the [<u>official documentation</u>](https://docs.python.org/3/library/subprocess.html), the `subprocess` module allows you to spawn new processes, connect to their input, output, and error pipes, and obtain their return codes.

### Start a process in Python
One common scenario you might want to use `subprocess` is when you want to start a new application (say, another python script, or a shell script) from your Python program.  Let’s go through an example and I’ll show you how to use `subprocess` module.

For example, you are writing a *`process_data.py`* program which performs some data processing work. However, the raw data files are compressed (e.g. they are some bz2 files) in order to reduce space storage.  The compressed files need to be uncompressed first. This uncompressing task is performed by a *`bunzip2_file.py`* program. Normally, you don’t want to bother to run *`bunzip2_file.py`* command in the terminal first and then run *`process_data.py`*. It will be more convenient to just run *`process_data.py`*. And within this program, it will spawn a subprocess, invoking *`bunzip2_file.py`*.  Let’s take a look at the codes:

{% highlight python %}
from subprocess import Popen, PIPE

cmd_list = ['./bunzip2_file.py', 'file_name']
p = Popen(cmd_list, stdout=PIPE, stderr=PIPE)
stdout = p.stdout.read()
stderr = p.stderr.read()
if stdout:
	print stdout
if stderr:
	print stderr
{% endhighlight %}

First we import `subprocess` functions `Popen` and `PIPE`. `Popen` is the class which handles process creation and management in the module. It could take a series of arguments. You may refer to the [<u>official subprocess documentation</u>](https://docs.python.org/3/library/subprocess.html#subprocess.Popen) for the full `Popen` arguments list. Most of the time you only need to pass arguments _**cmd_list**_, _**stdout**_ and _**stderr**_, and sometimes _**shell**_ boolean value.

The _**cmd_list**_ should be a sequence of program arguments or else a single string, just the same as you type in the terminal. The _**shell**_ argument specifies whether to use the shell as the program to execute. If _**shell**_ is _true_, it is recommended to to pass _**cmd_list**_ as a string. _**stdout**_ and _**stderr**_ specify the executed program’s standard output and standard error file handles. Most of the time we’ll pass `PIPE` as the value to _**stdout**_ and _**stderr**_, which means a new pipe to the child should be created. By specifying it this way, it means you are going to redirect the standard output and error to a new pipe, which normally defaults to the terminal. You can also give other values to _**stdout**_ or _**stderr**_ such as an existing file object, if you want to redirect the output to a file. Then you read the _**stdout**_ and _**stderr**_ and print it in the terminal accordingly.

### Parallel processing  

Now, suppose you have multiple compressed files, if you don’t use any parallel processing, the program will uncompress the file one by one, until the last one is uncompressed. This is time-consuming and inefficient. If we use parallel processing, however, the processing time will be _1/N_ of the sequential processing, where _N_ is the number of files to be uncompressed.

We can use `subprocess` module to create multiple child processes and they are run in parallel.

{% highlight python %}
from subprocess import Popen, PIPE
import glob

f_list = glob.glob('./*bz2')
cmds_list = [['./bunzip2_file.py', file_name] for file_name in f_list]
procs_list = [Popen(cmd, stdout=PIPE, stderr=PIPE) for cmd in cmds_list]
for proc in procs_list:
	proc.wait()
{% endhighlight %}

First, we search the current directory and obtain a list of all the compressed files. Next, we create a list of the sequence of program arguments, each list element corresponding to each file. Then, we create a process list using `Popen` for each command. Finally, we wait for the child processes to terminate. Plain and simple.

## Conclusion
Python `subprocess` module is useful for starting new processes in Python and running them in parallel. Parallel processing could substantially reduce the processing time. Careful readers might notice that subprocess can be used if we want to call external programs in parallel, but what if we want to execute functions in parallel. The answer is to use another python module `multiprocessing`. I’ll write another article covering `multiprocessing`.
