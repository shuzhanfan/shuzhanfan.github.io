---
layout:         post
title:          Understanding the mathematics behind Linear Discriminant Analysis (LDA)
subtitle:
card-image:     /assets/images/mancancat17.gif
date:           2018-07-23 09:00:00
tags:           [machine&nbsp;learning]
categories:     [machine&nbsp;learning, algorithms]
post-card-type: image
mathjax:        true
---

We are already familiar with Logistic Regression classification algorithm. It works fine for two-class classification problems. However, if there are more than two classes, Logistic Regression will not be preferred and we tend to use another linear classification technique: Linear Discriminant Analysis (LDA).

Before we get into the details of LDA, let's first review the [Naive Bayes classification algorithm](/2018/06/understanding-mathematics-behind-naive-bayes/), which forms the basis for LDA.

## Naive Bayes

The Bayes Theorem is stated as:

Given a feature vector $$X=(x_1, x_2,...,x_n)$$ and a class variable $$C_k$$, Bayes Theorem states that:
{% raw %}
$$
    P(C_k|X) = \frac{P(X|C_k)P(C_k)}{P(X)}, \space \space for \space k=1,2,...,K
$$
{% endraw %}

We call $$P(C_k\mid X)$$ the posterior probability, $$P(X\mid C_k)$$ the likelihood, $$P(C_k)$$ the prior probability of class, and $$P(X)$$ the prior probability of predictor. We are interested in calculating the posterior probability from the likelihood and prior probabilities.

Using the Naive independence assumption, which states that $$P(X\mid C_k) = P(x_1,...,x_n\mid C_k) = \prod_{i=1}^n{P(x_i\mid C_k)}$$, the posterior probability can then be written as:

{% raw %}
$$
    P(C_k|X) = \frac{P(C_k)\prod_{i=1}^n{P(x_i\mid C_k)}}{P(X)}
$$
{% endraw %}

The Naive Bayes classification problem then becomes: for different class values of $$C_k$$, find the maximum of $$P(C_k)\prod_{i=1}^n{P(x_i\mid C_k)}$$. This can be formulated as:
{% raw %}
$$
    \hat{C} = \arg \max_{C_k} P(C_k)\prod_{i=1}^n{P(x_i\mid C_k)}
$$
{% endraw %}

## Discriminant analysis

We then talk about the broader concept: Discriminant analysis. Discriminant analysis can be viewed as a 5-step procedure:

* **Step 1: Calculate prior probabilities**. The prior probability of class $$P(C_k)$$ could be calculated as the relative frequency of class $$C_k$$ in the training data.
* **Step 2: Test of variances homogeneity**. Use Bartlett’s test to test if K samples are from populations with equal variance-covariance matrices. The result of this test will determine whether to use Linear or Quadratic Discriminant Analysis.
    * Use **Linear discriminant analysis** for homogeneous variance-covariance matrices: $$\Sigma_1 = \Sigma_2 = ... = \Sigma_K = \Sigma$$.
    * Use **Quadratic discriminant analysis** for heterogeneous variance-covariance matrices: $$\Sigma_i \neq \Sigma_j$$ for some $$i \neq j$$.
* **Step 3: Estimate parameters of the likelihoods**. We estimate the parameters (e.g. $$\mu_i$$, and $$\Sigma$$) of the conditional probability density functions $$P(X\mid C_k)$$ from the training data. Here, we shall make the standard assumption that the data are multivariate normally distributed.
* **Step 4: Compute discriminant functions**. This is the rule to classify the new object into one of the known populations.
* **Step 5: Estimate classification performance**: Use cross validation to estimate misclassification probabilities. We can then make predictions for new observations.

## LDA (Linear Discriminant Analysis)

Now we go ahead and talk about the LDA (Linear Discriminant Analysis).

We assume that in population $$\pi_i$$ the probability density function of $$x$$ is multivariate normal with mean vector $$\mu_i$$ and variance-covariance matrix $$\Sigma$$ (same for all populations). The formula for this normal probability density function is:

{% raw %}
$$
    P(X\mid \pi_i) = \frac{1}{(2\pi)^{p/2}\vert \Sigma \vert^{1/2}}exp[-\frac{1}{2}(X-\mu_i)'\Sigma^{-1}(X-\mu_i)]
$$
{% endraw %}

According to the Naive Bayes classification algorithm. We know that we classify the example to the population for which $$P(\pi_i)\space P(X\vert \pi_i)$$ is the maximum. For the ease of calculation, we also take a log transform.

LDA is used when the variance-covariance matrices for all populations are homogeneous. In LDA, our decision rule is based on the Linear Score Function, a function of the population means for each of our g populations, $$\mu_i$$, and the pooled variance-covariance matrix.

The **Linear Score Function** is defined as:

{% raw %}
$$
    s_i^L(X) = -\frac{1}{2}\mu_i' \Sigma^{-1}\mu_i + \mu_i' \Sigma^{-1} X + logP(\pi_i) = d_{i0} + \sum_{j=1}^{p}{d_{ij}x_j} + log{P(\pi_i)} = d_i^L(X) + logP(\pi_i)
$$
{% endraw %}

where $$d_{i0} = -\frac{1}{2}\mu_i' \Sigma^{-1}\mu_i$$ and $$d_{ij}$$ = jth element of $$\mu_i' \Sigma^{-1}$$. And we call $$d_i^L(X)$$ the linear discriminant function.

As we can see from the above formula, the far right-hand expression is similar to a linear regression with intercept $$d_{i0}$$ and coefficients $$d_{ij}$$.

Given an example with a feature vector $$X=(x_1, x_2,...,x_p)$$, linear score function is computed for each population, and we classify the example into the population which has the largest Linear Score Function. This is equivalent to classifying to the population for which the posterior probability of membership is largest.

We should also notice that the linear score function is a function of unknown parameters, $$\mu_i$$ and $$\Sigma$$. So we have to estimate their values from the training data. Discriminant analysis requires estimates of:

* **Prior probabilities**: $$P(\pi_i)$$;
* **Population means**: $$\mu_i = E(X\vert \pi_i)$$;
* **Variance-covariance matrix**: $$\Sigma = var(X\vert \pi_i)$$;
