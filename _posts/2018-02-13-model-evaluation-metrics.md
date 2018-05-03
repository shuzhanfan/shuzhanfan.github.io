---
layout:         post
title:          Machine Learning Model Evaluation Metrics
subtitle:
card-image:     /assets/images/manandcat2.gif
date:           2018-02-13 09:00:00
tags:           [machine&nbsp;learning]
categories:     [machine&nbsp;learning]
post-card-type: image
---

After training the machine learning model, we should always evaluate the model to determine if it does a good job of predicting the target value on new unseen data. Among the various metrics that could be used to evaluate the predictive power of a machine learning model (especially for classification models), several most commonly used ones are: accuracy, precision, recall, and F1 score.

One common headache newcomers to machine learning have is to differentiate the nuances among the distinct evaluation metrics. I came across the same issue when I was in my first machine learning class. Back to that time, I searched extensively online and read a bunch of articles trying to figure out which one is which. And I found that the most efficient way to untangle this and fully understand the concepts is to use a contingency table, or called a confusion matrix.

Note: For the ease of demonstration and explanation, below I will talk in case of binary classification, in which the target variable only has two classes to be predicted.

### Confusion matrix

Wikipedia provides an excellent [<u>confusion matrix</u>](https://en.wikipedia.org/wiki/Confusion_matrix) illustrating all the formulas for all the metrics. While helpful, I found this confusion matrix kind of tedious since I won't use all of the metrics and I only care about a few of them. So I decided to make a simplified version out of that confusion matrix, just showing the formulas for the four most commonly used metrics. Also, I'll show you a real example on how to calculate them and how they differ in practice.

So, here you go. The following table shows the formulas for accuracy, precision, recall, and F1 score.

![confusion matrix](/assets/images/confusion_matrix.png)

### Type I and Type II error

As you can see from the table, all the formulas are based on the results for predictions that detect the presence of a condition. If a condition is positive, and the model also predicts it as positive, it's then a true positive (TP) prediction. It's a false negative (FN) prediction if the mode predicts it as negative. If the condition is negative, and the model predicts it as positive, the prediction is a false positive (FP). It'll be a true negative (TN) if the model also predicts it as negative. FP is also called Type I error. And FN is called Type II error.

Take a look at the following image. If a doctor predicts a man is pregnant which in fact he is not (false positive), this is a Type I error. On the other hand, if a doctor predicts that a woman is not pregnant which in fact she is (false negative), this is a Type II error.

![type i and type ii error](/assets/images/typeiandtypeiierror.jpg)

### Accuracy, precision, recall, F1 score

Now, let's get into the discussion of the four model evaluation metrics. First, the definitions:

**_Accuracy_**: the ratio of correctly predicted observations to total observations.

**_Precision_**: the ratio of correctly predicted positive observations to the total predicted positive observations.

**_Recall_**: the ratio of correctly predicted positive observations to the total actual positive observations.

**_F1 score_**: the weighted average of precision of recall.

Don't worry if you still feel lost reading these definitions. Let me give you a practical example to clarify their calculations. Assume your classification model is to predict whether or not an image contains a cat. Your testing set contains 100 images. And 40 images actually contain a cat, 60 images do not. The machine learning model identifies (predicts) 30 images as the ones which contain a cat, and other 70 as the ones do not. Of the 30 images identified as positive, 25 images actually contain a cat. Of the 70 images identified as negative, 15 images actually contain a cat.

So, _TP_ = 25, _FP_ = 5, _FN_ = 15, _TN_ = 55.

Then, we could get:

**_Accuracy_** = (25+55)/100 = 80/100 = 0.8

**_Precision_** = 25/30 = 0.83

**_Recall_** = 25/40 = 0.625

**_F1 score_** = 2x0.83x0.625/(0.83+0.625) = 0.71

As for which one/ones you should use and what constitutes good metrics, it really depends on the specific problem you are dealing with.
