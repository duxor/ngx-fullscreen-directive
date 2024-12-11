# Angular full screen directive

Displays a container in full screen mode. Requires Angular version >= 18.0.0.

## Usage:

- `npm i @duxor/ngx-fullscreen-directive`

- Import `FullScreenDirective` in a `@NgModule`

- Add the directive to the container which needs to be maximized

## Toggling full screen from template

```html
<!-- container to be displayed in the full screen mode -->
<element fullScreen #fullScreen="fullScreen"> ... </element>

...

<!-- element which triggers the full screen mode -->
<element (click)="fullScreen.openFullScreen()"></element>

<!-- OPTIONAL: element which will trigger exiting from the full screen mode -->
<element (click)="fullScreen.closeFullScreen()"></element>
```

## Specifying custom styles for the maximized container

You can define custom styles to the container while it is displayed in full screen mode by sending an object of type `CSSStyleDeclaration` to the `fullScreenCtrStyle` input property of the directive. These styles will be rolled-back after the full screen mode is exited:

```typescript
customStyles = {
  /*your styles*/
} as CSSStyleDeclaration;
```

```html
<!-- container to be displayed in the full screen mode -->
<element fullScreen [fullScreenCtrStyle]="customStyles"> ... </element>
```

## Check if full screen is toggled on

You can handle `fullScreenEnabled` event which notifies whether the full screen mode is toggled on.

```html
<!-- container to be displayed in the full screen mode -->
<element fullScreen (fullScreenEnabled)="onFullScreenToggle($event)">
  ...
</element>
```

```typescript
  onFullScreenToggle(enabled: boolean) {

  }
```

## Calling `openFullScreen()` and `closeFullScreen()` from component .ts file

By handling `fullScreenInit` event, you get access to the `openFullScreen()` and `closeFullScreen()` directive functions into your component's .ts file

```html
<!-- container to be displayed in the full screen mode -->
<element fullScreen (fullScreenInit)="onFullScreenInit($event)"> ... </element>
```

```typescript
onFullScreenInit(instance: FullScreenInstance) {
    this._fullScreenInstance = instance
}

...

//toggle on full screen
this._fullScreenInstance.openFullScreen();

//toggle off full screen
this._fullScreenInstance.closeFullScreen();
```
