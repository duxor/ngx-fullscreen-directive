import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  Inject,
  NgModule,
  OnDestroy,
} from "@angular/core";

@Directive({
  selector: "[fullScreen]",
  exportAs: "fullScreen",
})
export class FullScreenDirective implements OnDestroy {
  private _nativeEl = this._el.nativeElement;
  private _prevStyles;
  private _listener = [
    "fullscreenchange",
    () => {
      if (!this._document.fullscreenElement) {
        this._resetFullScreenStyles();
      }
    },
  ];

  constructor(
    private _el: ElementRef,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this._nativeEl.addEventListener(...this._listener);
  }

  openFullScreen = () => {
    if (this._nativeEl.requestFullscreen) {
      this._nativeEl.requestFullscreen();
      this._addFullScreenStyles();
    }
  };

  private _addFullScreenStyles() {
    const _style = this._nativeEl.style;

    this._cacheStyles(_style);

    _style.backgroundColor = "white";
    _style.display = "flex";
    _style.alignItems = "center";
    _style.justifyContent = "center";
    _style.padding = "3rem";
  }

  private _resetFullScreenStyles() {
    const _style = this._nativeEl.style;

    _style.display = this._prevStyles.display;
    _style.alignItems = this._prevStyles.alignItems;
    _style.justifyContent = this._prevStyles.justifyContent;
    _style.backgroundColor = this._prevStyles.backgroundColor;
    _style.padding = this._prevStyles.padding;
  }

  private _cacheStyles({
    display,
    alignItems,
    justifyContent,
    backgroundColor,
    padding,
  }) {
    this._prevStyles = {
      display,
      alignItems,
      justifyContent,
      backgroundColor,
      padding,
    };
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
