import { Directive } from '@angular/core';

@Directive({
  selector: 'input([type=text])[formControlName]'
})
export class DropdownValueAccessorDirective {

  constructor() { }

}
