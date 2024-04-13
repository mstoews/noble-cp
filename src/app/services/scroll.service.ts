import { ViewportScroller } from '@angular/common'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  scrollToElementById(id: string) {
    var element = this.__getElementById(id)
    if (id !== 'hero') {
      this.scrollToElement(element)
    } else {
      // console.debug('scroll to top');
      this.viewportScroller.scrollToPosition([1, 1])
      this.scrollTop(element)
    }
  }

  private __getElementById(id: string): HTMLElement {
    return document.getElementById(id)!
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' })
  }

  scrollTop(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
