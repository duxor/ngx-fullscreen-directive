import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgModule,
  OnDestroy,
} from "@angular/core";

@Directive({
  selector: "[fullScreen]",
  exportAs: "fullScreen",
})
export class FullScreenDirective implements OnDestroy {
  /** Styles applied to the container which has the `fullScreen` directive.
   *
   *  These styles are applied only in the full screen mode and are roll-backed when exiting it.
   */
  @Input() set fullScreenCtrStyle(style: CSSStyleDeclaration) {
    this._fullScreenCtrStyle = style;
  }

  private _nativeEl;
  private _fullScreenCtrStyle: Partial<CSSStyleDeclaration>;
  private _prevStyle: Partial<CSSStyleDeclaration>;
  private _listener = [
    "fullscreenchange",
    () => {
      if (!this._document.fullscreenElement) {
        this._resetFullScreenStyle();
      }
    },
  ];

  constructor(
    private _el: ElementRef,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this._nativeEl = this._el.nativeElement;
    this._nativeEl.addEventListener(...this._listener);
  }

  openFullScreen = () => {
    if (this._nativeEl.requestFullscreen) {
      this._nativeEl.requestFullscreen();
      this._addFullScreenStyle();
    }
  };

  private _addFullScreenStyle() {
    this._prevStyle = { ...this._nativeEl.style };
    this._asignNativeElStyle(this._fullScreenCtrStyle);
  }

  private _resetFullScreenStyle() {
    this._asignNativeElStyle(this._prevStyle);
  }

  private _asignNativeElStyle(style: Partial<CSSStyleDeclaration>) {
    Object.keys(this._fullScreenCtrStyle).forEach((key) => {
      this._nativeEl.style[key] = style[key];
    });
  }

  ngOnDestroy(): void {
    this._nativeEl.removeEventListener(...this._listener);
  }
}

@NgModule({
  declarations: [FullScreenDirective],
  exports: [FullScreenDirective],
})
export class FullScreenDirectiveModule {}
