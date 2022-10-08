# Angular full screen directive

Displays a container in full screen mode

## Usage

- Import `FullScreenDirectiveModule`.

- Add the directive to the container to be maximized and call `openFullScreen()` on the
  element which will trigger the full screen displaying.

- Optional: You can define custom styles to the container while it is displayed in full screen by sending
  an object of type `CSSStyleDeclaration` to the `fullScreenCtrStyle` input property of
  the directive. These styles will be rolled-back after the full screen mode is exited.

- Optional: You can provide an event handler for `fullScreenToggle` event which emits `true` when entering in the full screen mode and `false` when exiting it.

```html
<!-- container to be displayed in the full screen mode -->
<element
  fullScreen
  #fullScreen="fullScreen"
  [fullScreenCtrStyle]="customStyles"
  (fullScreenToggle)="onFullScreenToggle($event)"
>
  ...
</element>

...

<!-- element which triggers the full screen mode -->
<element (click)="fullScreen.openFullScreen()"></element>
```

You can specify the element on clicking on which the full screen mode will be toggled off by decorating it with `closeFullScreen` directive:

```html
<element closeFullScreen></element>
```
