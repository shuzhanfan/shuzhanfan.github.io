---
layout:         post
title:          Gradient descent optimization algorithms
subtitle:
card-image:     /assets/images/mancancat9.gif
date:           2018-06-03 09:00:00
post-card-type: image
mathjax:        true
---

Once the analytic gradient is computed with backpropagation, the gradients are used to perform a parameter update. There are several approaches for performing the update, which we discuss next. We will not discuss algorithms that are infeasible to compute in practice for high-dimensional data sets, e.g. second-order methods such as Newton's method.

In this post, we are going to talk about 6 gradient descent optimization algorithms:
* <a href="#Vanilla update">Vanilla update</a>
* <a href="#Momentum update">Momentum update</a>
* <a href="#Nesterov Momentum">Nesterov Momentum</a>
* <a href="#Adagrad">Adagrad</a>
* <a href="#RMSprop">RMSprop</a>
* <a href="#Adam">Adam</a>

### <a name="Vanilla update">Vanilla update</a>

The simplest form of update is to change the parameters along the negative gradient direction (since the gradient indicates the direction of increase, but we usually wish to minimize a loss function).

Assuming the parameters vector $$\theta$$ and the gradient $$\frac{\delta C}{\delta \theta}$$, the simplest update has the form:
{% raw %}
$$
    \theta := \theta - \eta \space \frac{\delta C}{\delta \theta}
$$
{% endraw %}

where $$\eta$$ is the learning rate.

### <a name="Momentum update">Momentum update</a>

Momentum update is another approach that almost always enjoys better converge rates on deep networks. This update can be motivated from a physical perspective of the optimization problem.

Essentially, when using momentum, we push a ball down a hill. The ball accumulates momentum as it rolls downhill, becoming faster and faster on the way. The same thing happens to our parameter updates: The momentum term increases for dimensions whose gradients point in the same directions and reduces updates for dimensions whose gradients change directions. As a result, we gain faster convergence and reduced oscillation.

Note that this is different from the SGD update shown above, where the gradient directly integrates the position. Instead, the physics view suggests an update in which the gradient only directly influences the velocity, which in turn has an effect on the position:
{% raw %}
$$
    v_t = \mu \space v_{t-1} + \eta \space \frac{\delta C}{\delta \theta}\\
    \theta := \theta - v_t
$$
{% endraw %}

where $$\mu$$ is called the momentum (its typical value is about 0.9).

### <a name="Nesterov Momentum">Nesterov Momentum</a>

Nesterov Momentum is a slightly different version of the momentum update that has recently been gaining popularity. It enjoys stronger theoretical converge guarantees for convex functions and in practice it also consistently works slightly better than standard momentum.

The core idea behind Nesterov momentum is that when the current parameter vector is at some position $$w$$, then looking at the momentum update above, we know that the momentum term alone (i.e. ignoring the second term with the gradient) is about to nudge the parameter vector by $$\mu v$$. Therefore, if we are about to compute the gradient, we can treat the future approximate position $$\theta+\mu v$$ as a “lookahead” - this is a point in the vicinity of where we are soon going to end up. Hence, it makes sense to compute the gradient at $$\theta+\mu v$$ instead of at the “old/stale” position $$\theta$$.

![nesterov](/assets/images/nesterov.jpg)

*Nesterov momentum. Instead of evaluating gradient at the current position (red circle), we know that our momentum is about to carry us to the tip of the green arrow. With Nesterov momentum we therefore instead evaluate the gradient at this "looked-ahead" position.*

The formula for calculating Nesterov momentum is:
{% raw %}
$$
    \theta_{ahead} = \theta + \mu v_{t-1} \\
    v_t = \mu \space v_{t-1} + \eta \space \frac{\delta C}{\delta \theta_{ahead}}\\
    \theta := \theta - v_t
$$
{% endraw %}

Now that we are able to adapt our updates to the slope of our error function and speed up SGD in turn, we would also like to adapt our updates to each individual parameter to perform larger or smaller updates depending on their importance. We will then discuss some common adaptive methods you may encounter in practice.

### <a name="Adagrad">Adagrad</a>

Adagrad is an adaptive learning rate method.

Previously we performed an update for all parameters $$\theta$$ at once as every parameter $$\theta_i$$ used the same learning rate $$\eta$$. As Adagrad uses a different learning rate for every parameter $$\theta_i$$ at every time step $$t$$, we first show Adagrad's per-parameter update, which we then vectorize. For brevity, we use $$g_t$$ to demote the gradient at time step $$t$$. And $$g_{t,i}$$ is then the partial derivative of the objective function with regard to the parameter $$\theta_i$$ at time step $$t$$:
{% raw %}
$$
    g_{t,i} = \frac{\delta C}{\delta \theta_{t,i}}
$$
{% endraw %}

The SGD update for every parameter $$\theta_i$$ at each time step $$t$$ then becomes:
{% raw %}
$$
    \theta_{t+1,i} = \theta_{t,i} - \eta \space g_{t,i}
$$
{% endraw %}

In its update rule, Adagrad modifies the general learning rate $$\eta$$ at each time step $$t$$ for every parameter $$\theta_i$$ based on the past gradients that have been computed for $$\theta_i$$:
{% raw %}
$$
    \theta_{t+1,i} = \theta_{t,i} - \frac{\eta}{\sqrt{G_{t,ii}+\epsilon}} \space g_{t,i}
$$
{% endraw %}

where $$G_{t}$$ is a diagonal matrix where each diagonal element $$ii$$ is the sum of the squares of the gradients with regard to $$\theta_i$$ up to time step $$t$$:
{% raw %}
$$
    G_{t,ii} = \sum^t{(\frac{\delta C}{\delta \theta_i})^2}
$$
{% endraw %}

And $$\epsilon$$ is a smoothing term that avoids division by zero.

Notice that the weights that receive high gradients will have their effective learning rate reduced, while weights that receive small or infrequent updates will have their effective learning rate increased. Amusingly, the square root operation turns out to be very important and without it the algorithm performs much worse. A downside of Adagrad is that in case of Deep Learning, the monotonic learning rate usually proves too aggressive and stops learning too early.

One of Adagrad's main benefits is that it eliminates the need to manually tune the learning rate. Most implementations use a default value of 0.01 and leave it at that.

Adagrad's main weakness is its accumulation of the squared gradients in the denominator: Since every added term is positive, the accumulated sum keeps growing during training. This in turn causes the learning rate to shrink and eventually become infinitesimally small, at which point the algorithm is no longer able to acquire additional knowledge. The following algorithms aim to resolve this flaw.

### <a name="RMSprop">RMSprop</a>

RMSprop is a very effective, but currently unpublished adaptive learning rate method. Amusingly, everyone who uses this method in their work currently cites slide 29 of Lecture 6 of Geoff Hinton’s Coursera class. The RMSProp update adjusts the Adagrad method in a very simple way in an attempt to reduce its aggressive, monotonically decreasing learning rate. In particular, it uses a moving average of squared gradients instead, giving:
{% raw %}
$$
    \theta_{t+1,i} = \theta_{t,i} - \frac{\eta}{\sqrt{E[g^2]_{t,i}+\epsilon}} \space g_{t,i}
$$
{% endraw %}

where:
{% raw %}
$$
    E[g^2]_{t,i} = \gamma \space E[g^2]_{t-1} + (1-\gamma) \space g_t^2
$$
{% endraw %}

RMSprop is an extension of Adagrad that seeks to reduce its aggressive, monotonically decreasing learning rate. Instead of accumulating all past squared gradients, RMSprop restricts the window of accumulated past gradients to some fixed size w.

Instead of inefficiently storing w previous squared gradients, the sum of gradients is recursively defined as a decaying average of all past squared gradients. The running average $$E[g^2]_{t}$$ at time step $$t$$ then depends (as a fraction $$\gamma$$ similarly to the Momentum term) only on the previous average and the current gradient. The typical values of $$\gamma$$ are 0.9, 0.99, or 0.999. RMSProp still modulates the learning rate of each weight based on the magnitudes of its gradients, which has a beneficial equalizing effect, but unlike Adagrad the updates do not get monotonically smaller.

### <a name="Adam">Adam</a>

Adam (Adaptive Moment Estimation) is a recently proposed update that looks a bit like RMSProp with momentum. In addition to storing an exponentially decaying average of past squared gradients $$v_t$$ like RMSprop, Adam also keeps an exponentially decaying average of past gradients $$m_t$$, similar to momentum.

We compute the decaying averages of past and past squared gradients $$m_t$$ and $$v_t$$ respectively as follows:
{% raw %}
$$
    m_t = \beta_1 m_{t-1} + (1-\beta_1)g_t\\
    v_t = \beta_2 v_{t-1} + (1-\beta_2)g_t^2
$$
{% endraw %}

$$m_t$$ and $$v_t$$ are estimates of the first moment (the mean) and the second moment (the uncentered variance) of the gradients respectively, hence the name of the method. As $$m_t$$ and $$v_t$$ are initialized as vectors of 0's, the authors of Adam observe that they are biased towards zero, especially during the initial time steps, and especially when the decay rates are small (i.e. $$\beta_1$$ and $$\beta_2$$ are close to 1).

They counteract these biases by computing bias-corrected first and second moment estimates:
{% raw %}
$$
    \hat{m_t} = \frac{m_t}{1-\beta_1^t} \\
    \hat{v_t} = \frac{v_t}{1-\beta_2^t}
$$
{% endraw %}

They then use these to update the parameters just as we have seen in RMSprop, which yields the Adam update rule:
{% raw %}
$$
    \theta_{t+1} = \theta_{t} - \frac{\eta}{\sqrt{\hat{v_t}}+\epsilon} \space \hat{m_t}
$$
{% endraw %}

Recommended values in the paper are $$\beta_1=0.9$$, $$\beta_2=0.999$$, $$\epsilon=1e-8$$. In practice Adam is currently recommended as the default algorithm to use, and often works slightly better than RMSProp. However, it is often also worth trying SGD+Nesterov Momentum as an alternative.
