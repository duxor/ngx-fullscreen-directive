import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";

export type FullScreenInstance = {
  openFullScreen: () => void;
  closeFullScreen: () => void;
};

@Directive({
  standalone: true,
  selector: "[fullScreen]",
  exportAs: "fullScreen",
})
export class FullScreenDirective implements OnInit {
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
  @Output() fullScreenEnabled = new EventEmitter<boolean>();

  /**Allows calling `openFullScreen()` and `closeFullScreen()` from the component .ts file*/
  @Output() fullScreenInit = new EventEmitter<FullScreenInstance>();

  private _nativeEl;
  private _fullScreenCtrStyle!: Partial<CSSStyleDeclaration>;
  private _prevStyle!: Partial<CSSStyleDeclaration>;

  constructor(
    private _el: ElementRef,
    @Inject(DOCUMENT) private _document: any
  ) {
    this._nativeEl = this._el.nativeElement;
  }

  ngOnInit(): void {
    const { openFullScreen, closeFullScreen } = this;
    this.fullScreenInit.emit({
      openFullScreen,
      closeFullScreen,
    });
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
    if (
      this._document.fullscreenElement ||
      this._document.webkitFullscreenElement
    )
      return;

    if (this._nativeEl.requestFullscreen) {
      this._nativeEl.requestFullscreen();
    } else if (this._nativeEl.webkitRequestFullscreen) {
      this._nativeEl.webkitRequestFullscreen();
    }

    this.fullScreenEnabled.emit(true);
    this._addFullScreenStyle();
  };

  closeFullScreen = () => {
    if (
      !this._document.fullscreenElement &&
      !this._document.webkitFullscreenElement
    )
      return;

    if (this._document.exitFullscreen) {
      this._document.exitFullscreen();
    } else if (this._document.webkitExitFullscreen) {
      this._document.webkitExitFullscreen();
    }

    this.fullScreenEnabled.emit(false);
    this._resetFullScreenStyle();
  };
}
