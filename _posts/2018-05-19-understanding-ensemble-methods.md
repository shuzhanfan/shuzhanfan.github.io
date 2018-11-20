---
layout:         post
title:          Understanding Ensemble machine learning methods
subtitle:
card-image:     /assets/images/mancancat13.gif
date:           2018-09-19 21:00:00
tags:           [machine&nbsp;learning]
categories:     [machine&nbsp;learning, algorithms]
post-card-type: image
mathjax:        true
---

Ensemble methods in machine learning is a class of method which combines multiple machine learning models into one predictive model in order to have a boost on the prediction accuracy over a single model.

In practice, two families of ensemble methods are most commonly used: Bagging and Boosting. The difference between bagging and boosting is that in bagging, multiple models (normally of the same type) are built from different subsamples of the training data, while in boosting, multiple models (normally of the same type) are built in a way that each model learns to fix the prediction errors of a prior model in the chain.

In terms of reducing prediction errors, the goal of bagging and boosting also differ. Bagging aims to decrease variance while boosting tends to reduce bias. In the next section I will talk about bias and variance briefly so you will understand what I am saying here.

In this post, I will focus on discussing two of the most popular ensemble methods: random forests (bagging) and gradient boosting trees (boosting). Other ensemble methods are either similar to these two methods or are just variants of them.

## Bias and Variance

Bias and Variance are two primary sources of error in machine learning algorithms. Roughly speaking, in machine learning settings, Bias is the algorithm’s error rate on the training data, and Variance is how much worse the algorithm does on the testing dataset than the training dataset.

For example, suppose your algorithm has an error rate of 10% on the training data, and an error rate of 20% on the testing data. So we estimate the algorithm has a bias of 10% and a variance of 10% (20%-10%=10%). The algorithm has a high variance. It performs well at predicting training data, but fails to generalize to the testing data. We call this problem as **overfitting**.

Bagging seeks to reduce the variance by averaging together multiple estimates, while boosting wants to lower the bias by correcting the mistakes of prior models in a sequence.

## Bagging

Bagging stands for bootstrap aggregation. As the name suggests, bagging uses bootstrap sampling to take multiple samples from your training data (with replacement). Then, the outputs of the multiple base learners are aggregated for final prediction, by taking the average or majority vote.

Let's look at one of the most popular bagging methods, random forests and see how it works.

### Random Forests

Here are the steps random forests take to make predictions:

1. $$a_N$$ observations are drawn at random with replacement from the original data set.
2. $$m$$ features are selected at random with replacement from the whole features.
3. Choose the best split among the $$m$$ features based on some split criterion (e.g. Gini impurity measure).
4. Split the node into children nodes based on the best split.
5. Repeat steps 2-4 until some stopping criterion has been met (e.g. the minimum number of points each node contains, or the number of nodes that have been reached).
6. Repeat steps 1-5 for $$n$$ times to build a forest which contains $$n$$ number of trees.
7. A final prediction is made by taking an average or majority vote of the $$n$$ number of trees.

When tuning the random forests parameters, especially $$m$$, a good initial recommendation is to set $$m$$ to $$\sqrt {k}$$ or $$2\sqrt {k}$$ ($$k$$ is the number of all features) but you still need to tune to find the optimal $$m$$.

As a result of this randomness, the bias of the forest usually slightly increases (with respect to the bias of a single non-random tree) but, due to averaging, its variance also decreases, usually more than compensating for the increase in bias, hence yielding an overall better model (from [<u>scikit-learn doc</u>](http://scikit-learn.org/stable/modules/ensemble.html)).

## Boosting

Boosting is different from bagging in that it fits a sequence of weak learners to weighted versions of data. Examples which were misclassified by prior learners will have more weights, so the subsequent leaners will focus more on the misclassified examples, hence improving the accuracy.

Let's look at one of the most popular boosting methods, gradient boosting and see how it works.

### Gradient Boosting

Imagine you have $$n$$ examples $$(x_1,y_1), (x_2,y_2),..., (x_n,y_n)$$, you want to fit a model $$F(x)$$ which minimizes the loss function $$J=\frac{1}{2n}\sum_i^n{(y_i-F(x_i))^2}$$.

Now, if you have an initial model $$F(x)$$ which predicts $$F(x_1)=1.0, F(x_2)=2.0$$, while in fact $$y_1=0.8, y_2=2.2$$. We know the model $$F(x)$$ is not perfect and we want to improve the model.

One simple solution is to add an additional model $$h(x)$$ to $$F(x)$$. We want to improve the model so that:
{% raw %}
$$
    F(x_1) + h(x_1) = y_1 \\
    F(x_2) + h(x_2) = y_2 \\
    \vdots \\
    F(x_n) + h(x_n) = y_n
$$
{% endraw %}

Equivalently, we can get:
{% raw %}
$$
    h(x_1) = y_1 - F(x_1)\\
    h(x_2) = y_2 - F(x_2)\\
    \vdots \\
    h(x_n) = y_n - F(x_n)
$$
{% endraw %}

If we can find such an additional model $$h(x)$$, our predictions will be perfect. However, it is nearly impossible to get such a model. But we can work to approximate it.

One intuitive way to do this is to fit the model $$h(x)$$ to data $$(x_1,y_1 - F(x_1)), (x_2,y_2 - F(x_2)),$$ $$..., (x_n,y_n - F(x_n))$$.

If the new model $$F+h$$ is still not good enough, we can continue to add other additional model in the same way, until we are satisfied with the prediction results or some threshold values were reached.

Here we call $$y_i-F(x_i)$$ residuals. The role of model $$h$$ is to compensate the effect of residuals resulting from the imperfect model $$F$$.

Wait, we are calling this method gradient boosting, but how is it related to gradient at all?

Let's see how they are related.

The loss function we defined previously is $$J=\frac{1}{2n}\sum_i^n{(y_i-F(x_i))^2}$$. Take derivatives with regards to $$F(x)$$, we get:
{% raw %}
$$
\frac{\delta J}{\delta F(x_i)} = F(x_i) - y_i
$$
{% endraw %}

We can see that residuals are actually equal to negative gradient:
{% raw %}
$$
y_i-F(x_i) = - \frac{\delta J}{\delta F(x_i)}
$$
{% endraw %}

So, our goal of fitting $$h$$ to residuals actually becomes fitting $$h$$ to negative gradients. Thus, we can say that we are updating our model $$F$$ using gradient descent:
{% raw %}
$$
F(x_i):=F(x_i)-\frac{\delta J}{\delta F(x_i)}
$$
{% endraw %}

This is true when we choose the squared error as the loss function. Actually, we can update our model $$F$$ using this rule for any loss function used. For each update, if we take a step along the negative gradient of the loss function, we are guaranteed to reduce the loss. We can also add a parameter $$\eta$$ to the update to control the magnitude of the step. Another parameter $$\lambda$$, called shrinkage, can also be added to the model to better enhance the model performance.

Our algorithm for gradient boosting can be stated as:

1. start with an initial model, say, $$F(x)=\frac{\sum_{i=1}^ny_i}{n}$$
2. calculate the negative gradient: $$-\frac{\delta J}{\delta F(x_i)}$$
3. fit a model $$h$$ to the negative gradients
4. Update the model $$F:=F+\eta \lambda h$$
4. repeat steps 2-4 until converge or some requirements are met

The choice of the loss function is based on the problem you are dealing with. In fact, the benefit of using gradients rather than residuals is that it allows us to consider other loss functions and derive the corresponding algorithms in the same way. Squared error loss function is easy to compute, but it has the drawback of not robust to outliers. We can use some other robust loss function to deal with outliers in the data.

In practice, the model $$h$$ is almost always decision trees. This is why gradient boosting is also called gradient boosting trees.
