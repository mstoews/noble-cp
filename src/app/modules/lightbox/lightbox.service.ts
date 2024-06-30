import {
  ApplicationRef,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  ViewContainerRef
} from '@angular/core';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent, LIGHTBOX_EVENT, IAlbum } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class Lightbox {
  constructor(

    private viewContainerRef: ViewContainerRef,
    private _injector: Injector,
    private _applicationRef: ApplicationRef,
    private _lightboxConfig: LightboxConfig,
    private _lightboxEvent: LightboxEvent,
    @Inject(DOCUMENT) private _documentRef: any
  ) { }

  open(album: Array<IAlbum>, curIndex = 0, options = {}): void {
    const overlayComponentRef = this._createComponent(LightboxOverlayComponent);
    const componentRef = this._createComponent(LightboxComponent);
    const newOptions: Partial<LightboxConfig> = {};

    // broadcast open event
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.OPEN });
    Object.assign(newOptions, this._lightboxConfig, options);

    // attach input to lightbox
    componentRef.instance.album = album;
    componentRef.instance.currentImageIndex = curIndex;
    componentRef.instance.options = newOptions;
    componentRef.instance.cmpRef = componentRef;

    // attach input to overlay
    overlayComponentRef.instance.options = newOptions;
    overlayComponentRef.instance.cmpRef = overlayComponentRef;

    // FIXME: not sure why last event is broadcasted (which is CLOSED) and make
    // lightbox can not be opened the second time.
    // Need to timeout so that the OPEN event is set before component is initialized
    setTimeout(() => {
      this._applicationRef.attachView(overlayComponentRef.hostView);
      this._applicationRef.attachView(componentRef.hostView);
      overlayComponentRef.onDestroy(() => {
        this._applicationRef.detachView(overlayComponentRef.hostView);
      });
      componentRef.onDestroy(() => {
        this._applicationRef.detachView(componentRef.hostView);
      });

      const containerElement = this.viewContainerRef.createComponent(this._documentRef);
      // containerElement.
      // containerElement. pendChild(overlayComponentRef.location.nativeElement);
      // containerElement.appendChild(componentRef.location.nativeElement);
    });
  }

  close(): void {
    if (this._lightboxEvent) {
      this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE });
    }
  }

  _createComponent(ComponentClass: any): ComponentRef<any> {
    const component = this.viewContainerRef.createComponent(ComponentClass);
    return component;
  }
}
