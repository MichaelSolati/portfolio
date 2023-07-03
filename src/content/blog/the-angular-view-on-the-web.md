---
title: "The Angular View: On The Web"
description: Explaining how the view is generated on the web by Angular.
pubDate: May 17 2017
hero: https://thepracticaldev.s3.amazonaws.com/i/bz85ttpacmuwn7fok5b3.png
---

Welcome to the first post of The Angular View, a series discussing how the Angular framework handles the view in our MVC ([Model View Controller](https://medium.freecodecamp.com/model-view-controller-mvc-explained-through-ordering-drinks-at-the-bar-efcba6255053)) structured application. This month, we're going to take a high level pass over how the Angular view works within web applications. Let's jump right in!
When creating an Angular application, you 'declare' in your NgModule all of the components (classes and views) that your application can use.

```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The NgModule provides a definition of your application or just a part of our application. The services, modules, and other necessities that our Angular application requires in order to build and handle the code we write all goes through our NgModule. In the snippet above, you can see a component initially created by the Angular CLI, AppComponent, was immediately loaded into our application with a declaration (where we define all of our views) as well as in the bootstrap (where we define our initial view). However, there are three Modules that are also imported into our application; the BrowserModule, FormsModule and HttpModule. The latter two of the three provide Angular developers with some incredibly important functionality for our application, but the BrowserModule is really the star (at least for this blog post).

In Angular there is a very clear abstraction from the view when compared to other prevalent JavaScript frameworks (primarily React). Below is an example from the [React tutorial](https://facebook.github.io/react/tutorial/tutorial.html) of a view constructed in the components class.

```jsx
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}
```

If you were to take the sample snippet from the React tutorial and implement it in Angular, it would probably require a few more files, but the structure of the application would still be very organized.

![Component Folder](https://thepracticaldev.s3.amazonaws.com/i/yqlhc4w53mvjjkl7xa55.png)

The auto generated component provided by the AngularÂ CLI.The HTML file would hold something very similar to the return of the React render function.

```html
<div class="shopping-list">
  <h1>Shopping List for {{props.name}}</h1>
  <ul>
    <li>Instagram</li>
    <li>WhatsApp</li>
    <li>Oculus</li>
  </ul>
</div>
```

The entire view is managed in a separate HTML file, which is associated with our component via the Component decorator. Even if you're not very familiar with the Component Decorator, you've probably seen it in action without realizing it.

[Decorators are a feature of ES7](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841), which was finalized in June of 2016, but was implemented in TypeScript well before the finalized spec so that Angular developers could take advantage of it. What Decorators allow us to do is to provide metadata for our class. The metadata describes functionality and other details about our class. In Angular, our Component decorator allows us to associate what styling we want for our component, what the HTML selector should be, and most importantly what the template for our component is! Here's an example in the snippet below:

```typescript
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent {}
```

So how does this work? How does this wrap back to our BrowserModule? Don't worry, we're getting there.

If you take the time to dig through your [BrowserModule](https://github.com/angular/angular/blob/master/packages/platform-browser/src/browser.ts#L91) you'll see that it takes in a slew of services that manipulate our DOM and create elements. The primary class of importance is the DefaultDomRenderer2 class, which a few of the other classes actually extend from, and is mainly used in our DomRendererFactory2 service.

There are two different things going on here. First, our [DefaultDomRenderer2](https://github.com/angular/angular/blob/master/packages/platform-browser/src/dom/dom_renderer.ts#L102) class has several functions that directly manipulate the DOM in order to create and manipulate our view. This class isn't exclusive for our Angular components; remember that our custom elements will likely call on standard HTML components (think your H1 tags, P tags, DIVs, etc.), and the createElement() will call on the native DOM APIs to generate either standard HTML components with the [document.createElement() function](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) or your custom-made ones with the [document.createElementNS() function](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS).

```typescript
createElement(name: string, namespace?: string): any {
  if (namespace) {
    return document.createElementNS(NAMESPACE_URIS[namespace], name);
  }
  return document.createElement(name);
}
```

In fact, if you learned DOM manipulation without JQuery, you will likely see a lot of functions that manipulate the DOM node/component as well as allowing you to append children and target the parent node. It's clean, pure JavaScript that's been so abstracted that you don't even need to consider or worry about it!

```typescript
appendChild(parent: any, newChild: any): void { parent.appendChild(newChild); }

parentNode(node: any): any { return node.parentNode; }

addClass(el: any, name: string): void { el.classList.add(name); }

removeClass(el: any, name: string): void { el.classList.remove(name); }
```

A few other classes and services extend the DefaultDomRenderer2, but it is primarily used for the [DomRendererFactory2](https://github.com/angular/angular/blob/master/packages/platform-browser/src/dom/dom_renderer.ts#L62) service. If you're not familiar with what a factory is, factories are used in Object Oriented Programming (OOP) to create and/or return new objects. In this case, our view components are created in the constructor of our factory for our usage.

The result is that our BrowserModule is able to take all the code we write and build the views that get displayed in the browser. It uses pure JavaScript to create and manage our view through the DomRendererFactory2 and the DefaultDomRenderer2, but it also allows us to associate our events into our views. [This is handled by a variety of services](https://github.com/angular/angular/tree/master/packages/platform-browser/src/dom/events) that also use pure JS to add event listeners to our web elements. Know that there are other important bits for our data binding and event listeners, which can be non-browser specific behavior, that are handled by the Angular [common](https://github.com/angular/angular/blob/master/packages/common/src/common.ts) and [core](https://github.com/angular/angular/blob/master/packages/core/src/core.ts) libraries.

```typescript
addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
  element.addEventListener(eventName, handler as any, false);
  return () => element.removeEventListener(eventName, handler as any, false);
}
```

## tl;dr

Our Angular applications allow us to build components that clearly separate our views from our code, but are associated via decorators. All of these components are imported into our NgModule which is essentially the entry point for our application. Our NgModule class uses the BrowserModule to take the metadata and build our views using native JavaScript.

This is all fine and dandy, but some of you may be wondering why we're doing all of this. Why use an abstracted module to generate our views, or even abstract our views from our controllers/classes at all? Well, we don't have to just build our applications for the web. There are many other platforms out there where we could run our Angular code on, and come next month we will discuss how this model allows us to write native applications with Angular as well!
