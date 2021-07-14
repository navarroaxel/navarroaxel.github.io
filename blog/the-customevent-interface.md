# The CustomEvent interface

We can dispatch [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) from our JavaScript code, this let us build native UI components and re-use them without needing a UI framework.

## Constructing a custom event

The events have a type (a string that identifies which kind of event it is) like `click` or `my-event`.

Also, the [constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) accepts an object called `customEventInit` which accepts some arguments but we're talking about this later on.

```javascript
new CustomEvent('my-event')
```

## Dispatching events

The events should be dispatched by a DOM element by using the [`dispatchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) method. To read/intercept our event we should register an event listener using the [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method.

```html
<button id="menu">open</button>
<script type="text/javascript">
  menu.onclick = () =>  menu.dispatchEvent(new CustomEvent('menu-open'));
  menu.addEventListener('menu-open', () => console.log('The menu is open.'));
</script>
```

Easy right? Now, let's go to the advanced topics...

## Events in a bubble

The bubbling events are events triggered by an element of the DOM that can be listened from any parents of that element and the `document` itself.

We just need to set the `bubbles` flag to `true` in the constructor.

```html
<button id="menu">open</button>
<script type="text/javascript">
  menu.onclick = () => {
    const event = new CustomEvent('menu-open', {bubbles: true};
    menu.dispatchEvent(event);
  });

  document.addEventListener('menu-open', () => console.log('The menu is open.'));
</script>
```

This is useful if your event is "global" in the web page.

## Cancelable events

Some browser's native events have a default action, e.g. the `submit` event, and we could cancel this behavior by using the `event.preventDefault()`. Our custom events could have an associated behavior like `open the menu` and support the cancellation of it by setting the `cancelable` flag as `true`.

```html
<button id="menu">open</button>
<div id="dropdown" hidden>Menu content</div>
<script type="text/javascript">
  menu.onclick = () => {
    const event = new CustomEvent('menu-open', {cancelable: true});
    if (menu.dispatchEvent(event)) {
      dropdown.hidden = false
    } else {
      console.log('The action was prevented.')
    }
  };

  menu.addEventListener('menu-open', e => {
    if (confirm("Call preventDefault?")) {
      e.preventDefault();
    }
  })
</script>
```

## Passing data inside events

We could include additional information in our custom event by using the `detail` attribute on its constructor.

```html
<button id="menu">open</button>
<script type="text/javascript">
  menu.onclick = () => {
    const event = new CustomEvent('menu-open', {
      detail: { openByUser: true }
    });
    menu.dispatchEvent(event)
  };

  menu.addEventListener('menu-open', e => {
    if (e.detail.openByUser) {
      console.log('The user open the menu.')
    }
  })
</script>
```

## Conclusion

The events' usage is a common approach to interact between UI elements. Now we can dispatch custom events from our UI components, including additional data to be used by the event listeners.

We can bubble up our events in the DOM and make "global" events at the `document` level so any JavaScript module can listen our events easily.

And we can make our events cancelables, so the listeners are able to prevent their behavior.

This is really useful to build UI components, and this can be used with the [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), with the microfrontend approach, or even to connect to an UI JavaScript framework like Angular or library such as React.
