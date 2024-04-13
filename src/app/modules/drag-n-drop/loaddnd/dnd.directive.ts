import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core'

@Directive({
  standalone: true,
  selector: '[appDnd]',
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver: boolean | undefined
  @Output() fileDropped = new EventEmitter<any>()

  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault()
    event.stopPropagation()
    this.fileOver = true
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: any) {
    event.preventDefault()
    event.stopPropagation()
    this.fileOver = false
  }

  @HostListener('drop', ['$event']) public ondrop(event: any) {
    event.preventDefault()
    // event.stopPropagation();
    this.fileOver = false
    const files = event.dataTransfer.files

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile()
          // console.debug('... file[' + i + '].name = ' + file.name);
        }
      }
    }
    if (files.length > 0) {
      this.fileDropped.emit(files)
    }
  }

  getMetadataForFileList(fileList: any) {
    for (const file of fileList) {
      // Not supported in Safari for iOS.
      const name = file.name ? file.name : 'NOT SUPPORTED'
      // Not supported in Firefox for Android or Opera for Android.
      const type = file.type ? file.type : 'NOT SUPPORTED'
      // Unknown cross-browser support.
      const size = file.size ? file.size : 'NOT SUPPORTED'
      // console.debug({file, name, type, size});
    }
  }
}
