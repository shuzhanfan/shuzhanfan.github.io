---
layout:         post
title:          Feature selection in machine learning
subtitle:
card-image:     /assets/images/mancancat8.gif
date:           2018-05-29 09:00:00
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

Generally, there are three classes of feature selection methods: filter methods, wrapper methods and embedded methods. I'll discuss them in detail in the rest of this article.

## Filter methods

In filter methods, the selection of features are independent of the machine learning algorithms. Features are selected based on a statistical score for each feature's correlation with the response variable. The correlation score used depends on the type of the dependent and independent data. The following table summarizes the relationship:

Feature\Response | Continuous | Categorical
 --- | --- |
 **Continuous**  | Pearson's correlation | LDA
 **Categorical** | Anova | Chi-square

### Pearson's Correlation Coefficient

Pearson's correlation coefficient measures the linear correlation between two variables. It is normally denoted as $$r$$, ranging between -1 and +1. The formula of the Pearson's correlation coefficient is:
{% raw %}
$$
    r_{XY} = \frac{E[(X-\mu_X)(Y-\mu_Y)]}{\sigma_X \sigma_Y}
$$
{% endraw %}

where $$\mu_X$$ and $$\mu_Y$$ are the means and $$\sigma_X$$ and $$\sigma_Y$$ are the standard deviations of random variables $$X$$ and $$Y$$.

A correlation coefficient that is closer to +1 implies a strong positive linear  correlation among the variables. A correlation coefficient that is closer to -1 implies a strong negative linear correlation among the variables. A correlation coefficient that is closer to 0 implies the variables are not linear correlated.

### ANOVA

ANOVA (analysis of variance) test can be used to test whether the means of several groups are equal or not. The null hypothesis of the test is: the means of different populations are equal. The F-statistic can be calculated as follows:

Source of Variation | SS | df | MS | F ratio
 --- | --- | --- | --- | ---
**Between groups** | SSB | k-1 | MSB = SSB/(k-1) | F = MSB/MSW
**Within groups**  | SSW | n-k | MSW = SSW/(n-k)
**Total**           | SST <br> = SSB + SSW | n-1

where k is the number of groups, n is the total number of samples.

After we calculate the F-statistic and determine the number of degrees of freedom in the denominator and numerator, we then select a confidence level (e.g. 95% or 99%). With the degrees of freedom and the confidence level, we can determine the critical value of the F distribution. We then compare the calculated F-statistic with the critical value. If it is smaller than the critical value, the null hypothesis is not rejected, the means of different groups are the same. If it is larger than the critical value, the opposite.

### Chi-square

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

## Wrapper methods

## Embedded methods

https://www.analyticsvidhya.com/blog/2016/12/introduction-to-feature-selection-methods-with-an-example-or-how-to-select-the-right-variables/

https://machinelearningmastery.com/an-introduction-to-feature-selection/

https://machinelearningmastery.com/feature-selection-machine-learning-python/

http://scikit-learn.org/stable/modules/feature_selection.html
