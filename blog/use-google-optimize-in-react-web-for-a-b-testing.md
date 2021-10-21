# Use Google Optimize in React web for A/B Testing

I'll explain how to create an experiment in the Google Optimize (GO) panel to get a simple boolean flag in our JavaScript code, specifically using Reactjs, to display the original version of our web, or the experiment.

I won't make the focus in how to create an experiments or specific configurations. I'll center this post in how to connect GO with JavaScript code.

## Introduction

I needed to integrate Google Optimize to make an A/B testing in a project I'm working on. I found that GO was made for end users that them can make little changes (text, CSS styles, etc.) in the website without need a developer.

But I couldn't find a good guide about how to receive a `bool` flag in the frontend to develop a basic `if` in JavaScript.

## The Optimize panel

### Create an experiment

First, we should create an A/B test experiment using the Google Optimize panel. Make a click to the `Create experiment` button.

![The create experience button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cqz1sgaks59l9tg4g9xl.png)

Give a name to the experiment and select the `A/B test` option.

![Select the experiment type](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mrdrk8y301q6yt323fsp.png)

When you link the experiment to a Google Analytics (GA) account the experiment receives an `Experiment ID`.

![The experiment ID](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uy5dttr74o384o7fy2ve.png)

🧠 The developer will use this `ID` to read the flag in the JavaScript code. The experiment name is not used in the JavaScript side.

Make sure you assign an objective to the experiment.

![The objectives of the given experiment](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2r477svv7i9f24c16yy9.png)

Now, you can `start` the experiment.

### Assign an activation event

Review the `Activation event` setting, because you can't use the experiment as a flag in the JavaScript code until that event is fired.

![Experiment settings section](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mrkvk15eo2791g6rmghy.png)

You can leave the activation event as `page load` to let the experiment ready when the page loads.

![Evaluate experiment on page load event](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/llt5a3jht3nj6956ltp1.png)

Or, you can use a custom event that will activate the experiment.

![Evaluate experiment on custom event](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7qih1xh1pj2mf7a6dwjw.png)

## Using in JavaScript

### Installation

Setup the GO SDK via [Google Tag Manager (GTM)](https://support.google.com/optimize/answer/6314801) or adding [the script tag](https://support.google.com/optimize/answer/10106536) to download it directly.

### Reading the flag value

The `google_optimize` object will be available as a global variable at the `window` level:

```javascript
const variant = window.google_optimize.get('<experiment_id>');
```

If the `get` function returns `undefined` means that the experiment is not available for this page, maybe this is misconfigured, or it doesn't apply for this page, or the experiment ID is not correct.

```javascript
switch (value) {
  case '0':
    // Code for visitors in the original.
    break;
  case '1':
    // Code for visitors in the first variant.
    break;
  case '2':
    // Code for visitors in another variant.
    break;
  default:
    // Code when the experiment has finished or misconfigured.
}
```

### Dispatching the activation event

If the experiment requires a custom event to activate you should dispatch it

```javascript
let variant;
if (window.dataLayer) {
  await window.dataLayer.push({event: 'optimize.activate'});
}
const intervalId = setInterval(() => {
  if (window.google_optimize !== undefined) {
    variant = window.google_optimize.get('<experiment_id>');
    clearInterval(intervalId);
  }
}, 500);
```

We don't know when `google_optimize` will be available on the `window`, we should use `setInterval` to read the variant when the experiment it's available.


### React integration

Now we can preset a useful hook for React.

```javascript
const useExperiment = (experimentId) => {
  const [variant, setVariant] = useState();
  useEffect(() => {
    (async () => {
      if (window.dataLayer) {
        await window.dataLayer.push({ event: 'optimize.activate' })
      }
      const intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
          // Set the variant to the state.
          setVariant(
            window.google_optimize.get(experimentId)
          );
          clearInterval(intervalId);
        }
      }, 100);
    })();
  })
  return variant;
}

const MyComponent = () => {
  const variant = useExperiment(YOUR_EXPERIMENT_ID_GOES_HERE);
  // here you can apply your conditional.
  return (
    <div>...</div>
  );
}
```
