import { ElementRef, OnChanges, OnDestroy, SimpleChanges, input } from '@angular/core'
import { Directive } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { filter, tap } from 'rxjs/operators'

export type ValidationError = 'required' | 'minlength' | 'maxlength' | 'invalid'

export type ValidationErrorTuple = { error: ValidationError; message: string }

export const ErrorSets: { [key: string]: ValidationError[] } = {
  OptionalText: ['minlength', 'maxlength'],
  RequiredText: ['minlength', 'maxlength', 'required'],
}

@Directive({
  selector: '[appFieldError]',
  standalone: true,
})
export class FieldErrorDirective implements OnDestroy, OnChanges {
  readonly appFieldError = input.required<ValidationError | ValidationError[] | ValidationErrorTuple | ValidationErrorTuple[]>();
  readonly input = input<HTMLInputElement | undefined>(undefined);
  readonly group = input.required<AbstractControl | null>();

  readonly fieldControl = input.required<AbstractControl | null>();
  readonly fieldLabel = input<string | undefined>(undefined);

  private controlSubscription: Subscription | undefined

  private readonly nativeElement: HTMLElement

  constructor(private el: ElementRef) {
    this.nativeElement = this.el.nativeElement
  }

  initFieldControl() {
    const input = this.input();
    const group = this.group();
    if (input && group) {
      const controlName = input.getAttribute('formControlName') ?? ''

      this.fieldControl = this.fieldControl() || group.get(controlName)

      const fieldControl = this.fieldControl();
      if (!fieldControl) {
        throw new Error(`[appFieldError] couldn't bind to control ${controlName}`)
      }

      this.unsubscribe()

      this.controlSubscription = fieldControl?.valueChanges
        .pipe(
          filter(() => this.fieldControl()?.status === 'INVALID'),
          tap(() => this.updateErrorMessage())
        )
        .subscribe()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initFieldControl()

    if (changes['input'].firstChange) {
      const input = this.input();
      if (input) {
        input.onblur = () => this.updateErrorMessage()
        this.fieldLabel =
          this.fieldLabel() ||
          input.placeholder ||
          input.getAttribute('aria-label') ||
          ''
      } else {
        throw new Error(`appFieldError.[input] couldn't bind to any input element`)
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  unsubscribe(): void {
    this.controlSubscription?.unsubscribe()
  }

  updateErrorMessage() {
    const errorsToDisplay: string[] = []

    const appFieldError = this.appFieldError();
    const errors = Array.isArray(appFieldError)
      ? appFieldError
      : [appFieldError]

    errors.forEach(
      (error: ValidationError | { error: ValidationError; message: string }) => {
        const errorCode = typeof error === 'object' ? error.error : error
        const message =
          typeof error === 'object'
            ? error.message
            : this.getStandardErrorMessage(errorCode)
        const errorChecker =
          errorCode === 'invalid'
            ? this.fieldControl()?.invalid
            : this.fieldControl()?.hasError(errorCode)

        if (errorChecker) {
          errorsToDisplay.push(message)
        }
      }
    )

    this.renderErrors(errorsToDisplay.join('<br>'))
  }

  renderErrors(errors: string) {
    this.nativeElement.innerText = errors
  }

  getStandardErrorMessage(error: ValidationError): string {
    const label = this.fieldLabel() || 'Input'

    switch (error) {
      case 'required':
        return `${label} is required`
      case 'minlength':
        return `${label} must be at least ${
          this.fieldControl()?.getError(error)?.requiredLength ?? 2
        } characters`
      case 'maxlength':
        return `${label} can't exceed ${
          this.fieldControl()?.getError(error)?.requiredLength ?? 50
        } characters`
      case 'invalid':
        return `A valid ${label} is required`
    }
  }
}
