import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

export interface FullScreenInstance {
  openFullScreen: () => void;
  closeFullScreen: () => void;
}

@Directive({
  standalone: true,
  selector: "[fullScreen]",
  exportAs: "fullScreen",
})
export class FullScreenDirective implements OnInit, OnDestroy {
  /** Styles applied to the container which has the `fullScreen` directive.
   *
   *  These styles are applied when entering in the full screen mode and are roll-backed when exiting it.
   */
  @Input() set fullScreenCtrStyle(style: CSSStyleDeclaration) {
    this._fullScreenCtrStyle = style;
  }

  /**Emits whether full screen mode is toggled on*/
  @Output() fullScreenEnabled = new EventEmitter<boolean>();

  /**Allows calling `openFullScreen()` and `closeFullScreen()` from the component .ts file*/
  @Output() fullScreenInit = new EventEmitter<FullScreenInstance>();

  private _nativeEl;
  private _fullScreenCtrStyle!: Partial<CSSStyleDeclaration>;
  private _prevStyle!: Partial<CSSStyleDeclaration>;
  private _isFullScreen!: boolean;

  constructor(
    private _el: ElementRef,
    @Inject(DOCUMENT) private _document: any
  ) {
    this._nativeEl = this._el.nativeElement;
    this._manageListeners("add");
  }

  ngOnInit(): void {
    const { openFullScreen, closeFullScreen } = this;
    this.fullScreenInit.emit({
      openFullScreen,
      closeFullScreen,
    });
  }

  private _manageListeners(action: "add" | "remove") {
    ["fullscreenchange", "webkitfullscreenchange"].forEach((event) =>
      this._nativeEl[action + "EventListener"](event, () => {
        this._isFullScreen =
          this._document.fullscreenElement ||
          this._document.webkitFullscreenElement;

        this._isFullScreen
          ? this._addFullScreenStyle()
          : this._resetFullScreenStyle();

        this.fullScreenEnabled.emit(!!this._isFullScreen);
      })
    );
  }

  openFullScreen = () => {
    if (this._isFullScreen) return;

    if (this._nativeEl.requestFullscreen) {
      this._nativeEl.requestFullscreen();
    } else if (this._nativeEl.webkitRequestFullscreen) {
      this._nativeEl.webkitRequestFullscreen();
    }
  };

  closeFullScreen = () => {
    if (!this._isFullScreen) return;

    if (this._document.exitFullscreen) {
      this._document.exitFullscreen();
    } else if (this._document.webkitExitFullscreen) {
      this._document.webkitExitFullscreen();
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
    for (const key in this._fullScreenCtrStyle) {
      this._nativeEl.style[key] = style[key];
    }
  }

  ngOnDestroy(): void {
    this._manageListeners("remove");
  }
}
