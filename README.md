# Angular full screen directive

Displays a container in the full screen mode.

## Usage

- Add the directive to the container to be maximized and call `openFullScreen()` on the
  element which will trigger the full screen displaying.

- Optional: Define custom styles to the container while it is displayed in full screen by sending
  an object of type `CSSStyleDeclaration` to the `fullScreenCtrStyle` input property of
  the directive. These styles will be rolled-back after the full screen mode is exited.

```html
<!-- container to be displayed in the full screen mode -->
<element
  fullScreen
  #fullScreen="fullScreen"
  [fullScreenCtrStyle]="customStyles"
>
  ...
</element>

...

<!-- element which triggers the full screen mode -->
<element (click)="fullScreen.openFullScreen()"></element>
```
