---
layout:         post
title:          Understanding the mathematics behind linear regression
subtitle:
card-image:     /assets/images/mancancat16.gif
date:           2018-07-02 21:00:00
tags:           [machine&nbsp;learning]
categories:     [machine&nbsp;learning, algorithms]
post-card-type: image
mathjax:        true
---

Today we are going to talk about linear regression, one of the most well known and well understood algorithms in machine learning. We are going to focus on the simple linear regression, which contains only one input variable. But the same logic and analyses will extend to the multi-variable linear regression. You probably are familiar with its form: $$y=\beta_0+\beta_1 x$$. However, you might feel confused about how the linear regression model is learnt. This blog post will talk about some of the most commonly techniques used to train a linear regression model.

## Solving linear regression using Ordinary Least Squares -- general formula

A simple linear regression function can be written as:
{% raw %}
$$
    y_i = \beta_0 + \beta_1x_i + \epsilon_i, \space i=1,2...n
$$
{% endraw %}

We can obtain n equations for n examples:
{% raw %}
$$
    y_1 = \beta_0 + \beta_1x_1 + \epsilon_1 \\
    y_2 = \beta_0 + \beta_1x_2 + \epsilon_2 \\
    \vdots \\
    y_n = \beta_0 + \beta_1x_n + \epsilon_n
$$
{% endraw %}

If we add n equations together, we get:
{% raw %}
$$
    \sum{y_i} = n\beta_0 + \beta_1\sum{x_i} + \sum{\epsilon_i}
$$
{% endraw %}

Because for linear regression, the sum of the residuals is zero. We get:
{% raw %}
$$
    \sum{y_i} = n\beta_0 + \beta_1\sum{x_i} \space\space\space\space\space\space\space\space\space\space\space\space\space\space\space\space\space(1)
$$
{% endraw %}

If we use the Ordinary Least Squares method, which aims to minimize the sum of the squared residuals. We define C to be the sum of the squared residuals:
{% raw %}
$$
    C = (\beta_0 + \beta_1x_1 - y_1)^2 + (\beta_0 + \beta_1x_2 - y_2)^2 + ... + (\beta_0 + \beta_1x_n - y_n)^2
$$
{% endraw %}

This is a quadratic polynomial problem. To minimize C, we take the partial derivatives with respect to $$\beta_1$$ and set the results to 0 and we get:
{% raw %}
$$
    \sum{x_iy_i} = \sum{x_i}\beta_0 + \beta_1\sum{x_i^2} \space\space\space\space\space(2)
$$
{% endraw %}

Solving equations (1) and (2), we can then get:
{% raw %}
$$
    \beta_0 =  \frac{(\sum{x_i^2})(\sum{y_i})-(\sum{x_i})(\sum{x_iy_i})}{n\sum{x_i^2-(\sum{x_i})^2}}\\
    \\
    \beta_1 = \frac{n(\sum{x_iy_i})-(\sum{x_i})(\sum{y_i})}{n\sum{x_i^2-(\sum{x_i})^2}}
$$
{% endraw %}

## Solving linear regression using Ordinary Least Squares -- matrix formulation

It is, however, more computationally efficient to use matrices to define the linear regression model and performing the subsequent analyses.

The n simple linear regression equations can be written out as:
{% raw %}
$$
    \begin{bmatrix}
        y_1 \\ y_2 \\ \vdots \\ y_n
    \end{bmatrix} =
    \begin{bmatrix}
        1 & x_1 \\ 1 & x_2 \\ \vdots & \vdots\\ 1 & x_n
    \end{bmatrix} \begin{bmatrix}
            \beta_0 \\ \beta_1
    \end{bmatrix} +
    \begin{bmatrix}
        \epsilon_1 \\ \epsilon_2 \\ \vdots \\ \epsilon_n
    \end{bmatrix}
$$
{% endraw %}

In matrix formulation the linear regression model can be rewritten as:
{% raw %}
$$
    Y = X\beta + \epsilon
$$
{% endraw %}

In the above section, equations (1) and (2) state that:
{% raw %}
$$
    \sum{y_i} = n\beta_0 + \beta_1\sum{x_i} \\
    \\
    \sum{x_iy_i} = \sum{x_i}\beta_0 + \beta_1\sum{x_i^2}
$$
{% endraw %}

We know:
{% raw %}
$$
    X^{'}X =     \begin{bmatrix}
            1 & 1 & \cdots & 1 \\ x_1 & x_2 & \cdots & x_n
        \end{bmatrix}     \begin{bmatrix}
                1 & x_1 \\ 1 & x_2 \\ \vdots & \vdots\\ 1 & x_n
            \end{bmatrix} = \begin{bmatrix}
                    n & \sum{x_i} \\ \sum{x_i} & \sum{x_i}^2
            \end{bmatrix} \\
    \\
    X^{'}Y = \begin{bmatrix}
            1 & 1 & \cdots & 1 \\ x_1 & x_2 & \cdots & x_n
        \end{bmatrix} \begin{bmatrix}
            y_1 \\ y_2 \\ \vdots \\ y_n
        \end{bmatrix} = \begin{bmatrix}
            \sum{y_i} \\ \sum{x_iy_i}
        \end{bmatrix}

$$
{% endraw %}

We can see that the equations (1) and (2) are equivalent to the following matrix formula:
{% raw %}
$$
    X^{'}Y = X^{'}XB
$$
{% endraw %}

Thus, we could get:
{% raw %}
$$
    B = (X^{'}X)^{-1}X^{'}Y \\
    with \space B=\begin{bmatrix}\beta_0 \\ \beta_1\end{bmatrix}
$$
{% endraw %}

Thus, to solve the linear regression problem using least squares, it normally requires that all of the data must be available and your computer must have enough memory to hold the data and perform matrix operations.

## Solving linear regression using Gradient Descent

When you have a very large dataset. The dataset may contain a lot of examples (rows) or it may contain a lot of features (columns). In either way, the matrix representing the dataset will be large and may not fit into memory. It is better to use another method to train the linear regression model. We'll talk about gradient descent in this section.

We first define a cost function which measures how good fit the regression line is. The cost function $$E(\beta)$$ is defined as:
{% raw %}
$$
    E(\beta) = \frac{1}{2n}\sum_{i=1}^{n}{(y_i-(\beta_0+\beta_1x_i))^2}
$$
{% endraw %}

The goal of the linear regression model is to minimize the cost function. Gradient descent search will determine a weight vector **B** that minimizes E by starting with an arbitrary initial weight vector, then repeatedly modifying it in small steps. At each step, the weight vector is altered in the direction that produces the steepest descent along the error surface. This process continues until the global minimum error is reached.

So, in what direction should we change the weight vector **B** that moves towards minimizing the cost function? If we change a small amount $$\Delta\beta_0$$ in the $$\beta_0$$ direction, and change a small amount $$\Delta\beta_1$$ in the $$\beta_1$$ direction, then E changes as follows:
{% raw %}
$$
    \Delta E \approx \frac{\delta E}{\delta \beta_0}\Delta \beta_0 + \frac{\delta E}{\delta \beta_1}\Delta \beta_1
$$
{% endraw %}

We rewrite this as:
{% raw %}
$$
    \Delta E \approx \nabla E \cdot \Delta B
$$
{% endraw %}

where $$\nabla E = (\frac{\delta E}{\delta \beta_0}, \frac{\delta E}{\delta \beta_1})$$, and $$\Delta B = (\beta_0, \beta_1)^T$$.

If we choose:
{% raw %}
$$
    \Delta B = -\eta \nabla E
$$
{% endraw %}

Then we will get:
{% raw %}
$$
    \Delta E \approx \nabla E \cdot -\eta \nabla E = -\eta ||\nabla E||^2 \le 0
$$
{% endraw %}

We will make sure that the error E will always decrease, which is the property we want.

Hence, the update rule for $$\beta_0$$ and $$\beta_1$$ is:
{% raw %}
$$
    \beta_0 := \beta_0 - \eta \frac{\delta E}{\delta \beta_0}  \\
    \beta_1 := \beta_1 - \eta \frac{\delta E}{\delta \beta_1}
$$
{% endraw %}

We have:
{% raw %}
$$
    \frac{\delta E}{\delta \beta_0} = \frac{1}{n}\sum_{i=1}^{n}{((\beta_0+\beta_1x_i)-y_i)}
    \\
    \frac{\delta E}{\delta \beta_1} = \frac{1}{n}\sum_{i=1}^{n}{((\beta_0+\beta_1x_i)-y_i)x_i}
$$
{% endraw %}

We get:
{% raw %}
$$
    \beta_0 := \beta_0 - \eta \frac{1}{n}\sum_{i=1}^{n}{((\beta_0+\beta_1x_i)-y_i)}  \\
    \beta_1 := \beta_1 - \eta \frac{1}{n}\sum_{i=1}^{n}{((\beta_0+\beta_1x_i)-y_i)x_i}
$$
{% endraw %}

The learning rate $$\eta$$ controls how quickly we want the weights to move towards the minimum. The weights are updated until a minimum sum squared error is achieved or no further improvement is possible.

## Regularization methods for linear regression

For machine learning problems, overfitting is a common issue we have to be aware of. Overfitting means your model fits your training data well but performs badly at predicting unseen data. One of the most common techniques to overcome overfitting is the use of regularization. Two popular regularization procedures for linear regression are Lasso regression and Ridge regression.

### Lasso Regression -- L1 regularization

In Lasso regression, we add an extra term to the cost function, which is called the regularization term. The regularized cost function is:
{% raw %}
$$
    E(\beta) = \frac{1}{2n}\sum_{i=1}^{n}{(y_i-(\beta_0+\beta_1x_i))^2} + \lambda \sum_{j=1}^{p}|\beta_j|
$$
{% endraw %}

We can rewrite it as:
{% raw %}
$$
    E(\beta) = E_0 + \lambda \sum_{j=1}^{p}|\beta_j|
$$
{% endraw %}

where $$E_0$$ is the unregularized cost function.

If we take the partial derivatives with regard to $$\beta_1$$, we get:
{% raw %}
$$
    \frac{\delta E}{\delta \beta_1} = \frac{\delta E_0}{\delta \beta_1} + \lambda \space sgn(\beta_1)
$$
{% endraw %}

where $$sgn(\beta_1)$$ is the sign of $$\beta_1$$, +1 if $$\beta_1$$ is positive, -1 if $$\beta_1$$ is negative.

The update rule for $$\beta_1$$ then becomes:
{% raw %}
$$
    \beta_1 := \beta_1 - \eta \lambda \space sgn(\beta_1) - \eta \frac{\delta E_0}{\delta \beta_1}
$$
{% endraw %}

This update rule will have the effect of penalizing relatively smaller weights while concentrating on a small number of large weights, by shrinking the weights by a constant amount towards 0.

### Ridge Regression -- L2 regularization

In Ridge regression, we add a different term to the cost function. The regularized cost function is:
{% raw %}
$$
    E(\beta) = \frac{1}{2n}\sum_{i=1}^{n}{(y_i-(\beta_0+\beta_1x_i))^2} + \lambda \sum_{j=1}^{p}\beta_j^2
$$
{% endraw %}

We can rewrite it as:
{% raw %}
$$
    E(\beta) = E_0 + \lambda \sum_{j=1}^{p}\beta_j^2
$$
{% endraw %}

where $$E_0$$ is the unregularized cost function.

If we take the partial derivatives with regard to $$\beta_1$$, we get:
{% raw %}
$$
    \frac{\delta E}{\delta \beta_1} = \frac{\delta E_0}{\delta \beta_1} + 2\lambda \beta_1
$$
{% endraw %}

The update rule for $$\beta_1$$ then becomes:
{% raw %}
$$
    \beta_1 := \beta_1 - 2\eta \lambda \space \beta_1 - \eta \frac{\delta E_0}{\delta \beta_1}
$$
{% endraw %}

It can be written as:
{% raw %}
$$
    \beta_1 := (1 - 2\eta \lambda)\beta_1 - \eta \frac{\delta E_0}{\delta \beta_1}
$$
{% endraw %}

The update rule now rescales the weights with a factor of $$(1 - 2\eta \lambda)$$. It has an effect of penalizing relatively large weights.

So, if we compare the L1 and L2 regularization. When a particular weight has a large magnitude, L1 regularization tends to shrink the weight much less than the L2 regularization does. In contrary, when a particular weight has a small magnitude, L1 regularization tends to shrink the weight much more than the L2 regularization does.

Regularization methods are useful when there is collinearity in your input variables and the unregularized model would overfit the training data.

### Extra words about linear Regression

There are some heuristics you can use when you are performing linear regression, especially, in the stage of data preparation.

* **Linear assumption**: linear regression assumes that the relationship between the input variables and output variable to be linear. You may need to transform the data to make the relationship linear. Also be careful when the training data contain outliers/noise, because linear regression is sensitive to outliers. You may need to clean the noise data before feeding the data into the model.

* **Collinearity assumption**: linear regression assumes that there is no or little collinearity among input variables. Linear regression will overfit the training data when the input variables are highly correlated. You may need to do some feature selection and remove the most correlated features.

* **Normal assumption**: linear regression assumes that all the variables to be normal distributed or close to normal. Linear regression will make more reliable predictions if the variables are normally distributed. You may need to transform the data to make the variables normal looking.

* **Rescaling data**: linear regression will make more reliable predictions if the input variables are rescaled (using normalization or standardization).
