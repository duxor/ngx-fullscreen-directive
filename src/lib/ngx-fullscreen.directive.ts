import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnDestroy,
  Output,
} from "@angular/core";

@Directive({
  selector: "[fullScreen]",
  exportAs: "fullScreen",
})
export class FullScreenDirective implements OnDestroy {
  /** Styles applied to the container which has the `fullScreen` directive.
   *
   *  These styles are applied when entering in the full screen mode and are roll-backed when exiting it.
   */
  @Input() set fullScreenCtrStyle(style: CSSStyleDeclaration) {
    this._fullScreenCtrStyle = style;
  }

  /**
   *  * Emits `true` when entering in the full screen mode.
   *  * Emits `false` when leaving full screen mode.
   */
  @Output() fullScreenToggle = new EventEmitter<boolean>();

  private _nativeEl;
  private _fullScreenCtrStyle: Partial<CSSStyleDeclaration>;
  private _prevStyle: Partial<CSSStyleDeclaration>;
  private _listener = [
    "fullscreenchange",
    () => {
      if (this._document.fullscreenElement) {
        this.fullScreenToggle.emit(true);
      } else {
        this.fullScreenToggle.emit(false);
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

  private _addFullScreenStyle() {
    this._prevStyle = { ...this._nativeEl.style };
    this._asignNativeElStyle(this._fullScreenCtrStyle);
  }

  private _resetFullScreenStyle() {
    this._asignNativeElStyle(this._prevStyle);
  }

  private _asignNativeElStyle(style: Partial<CSSStyleDeclaration>) {
    for (const key in this._fullScreenCtrStyle) {
      this._nativeEl.style[key] = style[key];
    }
  }

  openFullScreen = () => {
    if (this._nativeEl.requestFullscreen && !this._document.fullscreenElement) {
      this._nativeEl.requestFullscreen();
      this._addFullScreenStyle();
    }
  };

  ngOnDestroy(): void {
    this._nativeEl.removeEventListener(...this._listener);
  }
}

@Directive({
  selector: "[closeFullScreen]",
  host: { "(click)": "_closeFullScreen()" },
})
export class CloseFullScreenDirective {
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  private _closeFullScreen() {
    if (this._document.fullscreenElement) this._document.exitFullscreen();
  }
}

@NgModule({
  declarations: [FullScreenDirective, CloseFullScreenDirective],
  exports: [FullScreenDirective, CloseFullScreenDirective],
})
export class FullScreenDirectiveModule {}
