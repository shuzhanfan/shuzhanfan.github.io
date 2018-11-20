---
layout:         post
title:          Feature selection in machine learning
subtitle:
card-image:     /assets/images/mancancat14.gif
date:           2018-10-20 09:00:00
tags:           [machine&nbsp;learning]
categories:     [machine&nbsp;learning]
post-card-type: image
mathjax:        true
---

Feature selection is a process where you can automatically select features which are most relevant to your machine learning problem. In other words, after feature selection, you are expected to see an accuracy improvement of your predictive model.

The benefits of using feature selection are:
* **Train faster**: less data means faster training time.
* **Reduce model complexity**: less features, less complexity, easier to interpret.
* **Reduce overfitting**: less irrelevant features means the model is less based on noise.
* **Improve prediction accuracy**: less noise data, better prediction performance.

Another term we often hear is dimensionality reduction. Although similar, they actually use different strategies to reduce features. Feature selection reduces features by including and excluding features in the data without changing them, while dimensionality reduction reduces features by creating new combinations of them (e.g. SVD, PCA, etc.).

Generally, there are three classes of feature selection methods: <a href="#Filter methods">**filter methods**</a>, <a href="#Wrapper methods">**wrapper methods**</a> and <a href="#Embedded methods">**embedded methods**</a>. I'll discuss them in detail in the rest of this article.

## <a name="Filter methods">Filter methods</a>

In filter methods, the selection of features are independent of the machine learning algorithms. Features are selected based on a statistical score for each feature's correlation with the response variable. The correlation score used depends on the type of the dependent and independent data. The following table summarizes the relationship:

Feature\Response | Continuous | Categorical
 --- | --- |
 **Continuous**  | <a href="#Pearson's correlation">Pearson's correlation</a> | <a href="#LDA">LDA</a>
 **Categorical** | <a href="#Anova">Anova</a> | <a href="#Chi-square">Chi-square</a>

### <a name="Pearson's correlation">Pearson's Correlation Coefficient</a>

Pearson's correlation coefficient measures the linear correlation between two variables. It is normally denoted as $$r$$, ranging between -1 and +1. The formula of the Pearson's correlation coefficient is:
{% raw %}
$$
    r_{XY} = \frac{E[(X-\mu_X)(Y-\mu_Y)]}{\sigma_X \sigma_Y}
$$
{% endraw %}

where $$\mu_X$$ and $$\mu_Y$$ are the means and $$\sigma_X$$ and $$\sigma_Y$$ are the standard deviations of random variables $$X$$ and $$Y$$.

A correlation coefficient that is closer to +1 implies a strong positive linear  correlation among the variables. A correlation coefficient that is closer to -1 implies a strong negative linear correlation among the variables. A correlation coefficient that is closer to 0 implies the variables are not linear correlated.

### <a name="Anova">ANOVA</a>

ANOVA (analysis of variance) test can be used to test whether the means of several groups are equal or not. The null hypothesis of the test is: the means of different populations are equal. The F-statistic can be calculated as follows:

Source of Variation | SS | df | MS | F ratio
 --- | --- | --- | --- | ---
**Between groups** | SSB | k-1 | MSB = SSB/(k-1) | F = MSB/MSW
**Within groups**  | SSW | n-k | MSW = SSW/(n-k)
**Total**           | SST <br> = SSB + SSW | n-1

where k is the number of groups, n is the total number of samples.

After we calculate the F-statistic and determine the number of degrees of freedom in the denominator and numerator, we then select a confidence level (e.g. 95% or 99%). With the degrees of freedom and the confidence level, we can determine the critical value of the F distribution. We then compare the calculated F-statistic with the critical value. If it is smaller than the critical value, the null hypothesis is not rejected, the means of different groups are the same. If it is larger than the critical value, the opposite.

### <a name="Chi-square">Chi-square</a>

Chi-square test can be used to test for independence of two categorical variables. The null hypothesis of the test is: the two categorical variables are independent in the population. The chi-square value can be calculated using the following formula:
{% raw %}
$$
    \chi^2 = \sum_{i=1}^r \sum_{j=1}^c \frac{(O_{i,j}-E_{i,j})^2}{E_{i,j}}
$$
{% endraw %}

where $$O_{i,j}$$ is the observed counts in the contingency table, $$E_{i,j}$$ is the expected count in the contingency table. The number of degrees of freedom is $$df=(r-1)(c-1)$$.

The expected count for each cell in the contingency table can be calculated as:
{% raw %}
$$
    E = \frac{row \space total \times column \space total}{sample \space size}
$$
{% endraw %}

After we calculate the chi-squared statistic and determine the number of degrees of freedom of the statistic, we then select a confidence level (e.g. 95% or 99%). With the degrees of freedom and the confidence level, we can determine the critical value of the chi-square distribution. We then compare the calculated chi-squared statistic with the critical value. If it is smaller than the critical value, the null hypothesis is not rejected, the two categorical variables are independent of each other. If it is larger than the critical value, the opposite.

One thing that should be kept in mind is that filter methods do not remove multicollinearity. So, you must deal with multicollinearity of features as well before training models for your data.

### <a name="LDA">LDA (Linear Discriminant Analysis)</a> ([<u>PSU LDA tutorial</u>](https://onlinecourses.science.psu.edu/stat505/node/94/))

Before we get into the details of LDA, let's first review the Naive Bayes classification problem. The Bayes Theorem is stated as:

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

**Discriminant analysis** is a 7 step procedure:

* **Step 1**: Collect training data. _Training data_ are data with known group memberships. Here, we actually know which population contains each subject.
* **Step 2**: Calculate prior probabilities. The prior probability of class $$P(C_k)$$ could be calculated as the relative frequency of class $$C_k$$ in the training data.
* **Step 3**: Use Bartlett’s test to determine if the variance-covariance matrices are homogeneous for all populations involved. The result of this test will determine whether to use Linear or Quadratic Discriminant Analysis.
    * **Linear discriminant analysis** is for homogeneous variance-covariance matrices: $$\Sigma_1 = \Sigma_2 = ... = \Sigma_k = \Sigma$$. In this case the variance-covariance matrix does not depend on the population.
    * **Quadratic discriminant analysis** is used for heterogeneous variance-covariance matrices: $$\Sigma_i \neq \Sigma_j$$ for some $$i \neq j$$. This allows the variance-covariance matrices to depend on the population.
* **Step 4**: Estimate the parameters of the conditional probability density functions $$f(X\mid C_k)$$. Here, we shall make the following standard assumptions:
    * The data from group $$i$$ has common mean vector $$\mu_i$$.
    * The data from group $$i$$ has common variance-covariance matrix $$\Sigma$$.
    * Independence: The subjects are independently sampled.
    * Normality: The data are multivariate normally distributed.
* **Step 5**: Compute discriminant functions. This is the rule to classify the new object into one of the known populations.
* **Step 6**: Use cross validation to estimate misclassification probabilities.
* **Step 7**: Classify observations with unknown group memberships.

Now we go ahead and talk about the **LDA (Linear Discriminant Analysis)**.

We assume that in population $$\pi_i$$ the probability density function of $$x$$ is multivariate normal with mean vector $$\mu_i$$ and variance-covariance matrix $$\Sigma$$ (same for all populations). As a formula, this is

{% raw %}
$$
    f(X\mid \pi_i) = \frac{1}{(2\pi)^{p/2}\vert \Sigma \vert^{1/2}}exp[-\frac{1}{2}(X-\mu_i)'\Sigma^{-1}(X-\mu_i)]
$$
{% endraw %}

We classify to the population for which $$p_i\space f(X\vert \pi_i)$$ is largest. Because a log transform is monotonic, this equivalent to classifying an observation to the population for which $$log[p_i\space f(X\vert \pi_i)]$$ is largest.

Linear discriminant analysis is used when the variance-covariance matrix does not depend on the population. In this case, our decision rule is based on the Linear Score Function, a function of the population means for each of our g populations, $$\mu_i$$, as well as the pooled variance-covariance matrix.

The **Linear Score Function** is:

{% raw %}
$$
    s_i^L(X) = -\frac{1}{2}\mu_i' \Sigma^{-1}\mu_i + \mu_i' \Sigma^{-1} X + log(p_i) = d_{i0} + \sum_{j=1}^{p}{d_{ij}x_j} + log{p_i}
$$
{% endraw %}

where $$d_{i0} = -\frac{1}{2}\mu_i' \Sigma^{-1}\mu_i$$ and $$d_{ij}$$ = jth element of $$\mu_i' \Sigma^{-1}$$

The far right-hand expression resembles a linear regression with intercept term $$d_{i0}$$ and regression coefficients $$d_{ij}$$.

Linear Discriminant Function:

{% raw %}
$$
    d_i^L(X) = -\frac{1}{2}\mu_i' \Sigma^{-1}\mu_i + \mu_i' \Sigma^{-1} X = d_{i0} + \sum_{j=1}^{p}{d_{ij}x_j}
$$
{% endraw %}

Given a sample unit with measurement features $$x_1, x_2,..., x_p$$, we classify the sample unit into the population that has the largest Linear Score Function. This is equivalent to classifying to the population for which the posterior probability of membership is largest. The linear score function is computed for each population, then we plug in our observation values and assign the unit to the population with the largest score.

However, this is a function of unknown parameters, $$\mu_i$$ and $$\Sigma$$. So, these must be estimated from the data. Discriminant analysis requires estimates of:

* Prior probabilities: $$p_i = Pr(\pi_i);\space i=1,2,...,g$$
* The population means are estimated by the sample mean vectors: $$\mu_i = E(X\vert \pi_i);\space i=1,2,...,g$$
* The variance-covariance matrix is estimated by using the pooled variance-covariance matrix: $$\Sigma = var(X\vert \pi_i);\space i=1,2,...,g$$

Typically, these parameters are estimated from training data, in which the population membership is known.

## <a name="Wrapper methods">Wrapper methods</a>


In wrapper methods, we try to use a subset of features and train a model using them. Based on the inferences that we draw from the previous model, we decide to add or remove features from your subset. The problem is essentially reduced to a search problem. These methods are usually computationally very expensive.

Some common examples of wrapper methods are forward feature selection, backward feature elimination, recursive feature elimination, etc.

* **Forward Selection**: Forward selection is an iterative method in which we start with having no feature in the model. In each iteration, we keep adding the feature which best improves our model till an addition of a new variable does not improve the performance of the model.
* **Backward Elimination**: In backward elimination, we start with all the features and removes the least significant feature at each iteration which improves the performance of the model. We repeat this until no improvement is observed on removal of features.
* **Recursive Feature elimination**: It is a greedy optimization algorithm which aims to find the best performing feature subset. It repeatedly creates models and keeps aside the best or the worst performing feature at each iteration. It constructs the next model with the left features until all the features are exhausted. It then ranks the features based on the order of their elimination.

## <a name="Embedded methods">Embedded methods</a>


Embedded methods combine the qualities’ of filter and wrapper methods. It’s implemented by algorithms that have their own built-in feature selection methods.

Some of the most popular examples of these methods are LASSO and RIDGE regression which have inbuilt penalization functions to reduce overfitting.

Other examples of embedded methods are Regularized trees, Memetic algorithm, Random multinomial logit.

## Difference between Filter and Wrapper methods

The main differences between the filter and wrapper methods for feature selection are:

* Filter methods measure the relevance of features by their correlation with dependent variable while wrapper methods measure the usefulness of a subset of feature by actually training a model on it.
* Filter methods are much faster compared to wrapper methods as they do not involve training the models. On the other hand, wrapper methods are computationally very expensive as well.
* Filter methods use statistical methods for evaluation of a subset of features while wrapper methods use cross validation.
* Filter methods might fail to find the best subset of features in many occasions but wrapper methods can always provide the best subset of features.
* Using the subset of features from the wrapper methods make the model more prone to overfitting as compared to using subset of features from the filter methods.

References:

* [<u>Introduction to Feature Selection methods with an example (or how to select the right variables?)</u>](https://www.analyticsvidhya.com/blog/2016/12/introduction-to-feature-selection-methods-with-an-example-or-how-to-select-the-right-variables/)
* [<u>An Introduction to Feature Selection</u>](https://machinelearningmastery.com/an-introduction-to-feature-selection/)
* [<u>Feature Selection For Machine Learning in Python</u>](https://machinelearningmastery.com/feature-selection-machine-learning-python/)
* [<u>Scikit-learn Feature selection</u>](http://scikit-learn.org/stable/modules/feature_selection.html)
