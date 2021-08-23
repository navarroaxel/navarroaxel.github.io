# Connecting a react app using custom elements

The React documentation says that React and web components are [complementary to each other](https://reactjs.org/docs/web-components.html). We're going to wrap a React component into a custom element, sending some props as HTML attributes and listen the `click` event.

I'll assume you know about React and you only want to know how to use custom elements.

## Define a custom element

To define a web component we should associate a custom tag with a class that wraps the component behavior.

```javascript
window.customElements.define('my-element', MyElement);
```

Then our class should extend the `HTMLElement` class.

💡 If you want to extend a built-in tag like `p`, you should use the `HTMLParagraphElement` instead.

## The React component

Well, we need a component inside the React world.

```javascript
const App = ({text = 'The button wasn\'t pressed yet.', children, onClick}) => {
  const [date] = useState(new Date());
  return (
    <div>
      This is a custom element, created at {date.toString()}
      <br/>
      {text}
      <br/>
      <button onClick={onClick}>Click me!</button>
      <br/>
      {children}
    </div>
  );
};
```

We're going to test some React features like `children`, a prop, and a date constant to test if the component is recreated.

## Defining a class for the element

We should create a `ShadowRoot` for our React component to encapsulate the JavaScript and CSS for this component from the global CSS, it's not required, but it's recommended.

Also, it's good to separate the constructor from the render of the element itself.

```javascript
class MyElement extends HTMLElement {
  shadow;

  constructor() {
    // Always call super first in constructor
    super();

    this.shadow = this.attachShadow({mode: 'open'});
    // Write element functionality in here
    this.renderElement();
  }

  renderElement() {
    const onClick = this.getAttribute('onclick')
    const text = this.hasAttribute('text')
      ? this.getAttribute('text')
      : undefined;
    ReactDOM.render(
      <App text={text} onClick={onClick}>
        <slot />
      </App>,
      this.shadow
    );
  }

  // ...
}
```

In the `renderElement` method we take values from the attributes of the HTML tag, like `onclick` and `text`, but what is that wild [`<slot />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) there?

The `slot` element is a placeholder inside a web component where you can fill your own markup. Sounds similar to [dangerouslySetInnerHTML](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml). 🙈

💡 You can use several `slot`s in the web component using the `name` attribute.

🧠 If you check the React component's code, the `slot` is placed using the `children` prop.

### The custom element lifecycle

Like the React components, we can define specific method inside the custom element class to handle the lifecycle, similar to the old fashion class component in React. We're going to see the most important two.

### Unmount a custom element

We can use `disconnectedCallback` to known when our component is disconnected from the document's DOM.

### Receiving new props form outside

We should re-render 🙀 our React component if we receive new values for our custom element. We have the `attributeChangedCallback` to let us know when some value changes.

First, we should define an array of observable attributes for our component, and then we can render the custom element again.

```javascript
class MyElement extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'onclick'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`The attribute ${name} was updated.`);
    this.renderElement();
  }

  // ...
}
```

Ok, this looks really easy. 🤔 We takes the attribute values each time the `renderElement` is called, so we just need to call it, and the `ReactDOM.render()` API is going to re-render our component and calculate the diffs. 🍰

## Conclusion

Now we can create a modern and light website using just HTML and JavaScript, but plugging in complex UI stuff made with React using the Custom Element interface, or third party React packages if we need one. We are using the best of both worlds. 🎸

I left you a guide about [Custom Element Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices).
