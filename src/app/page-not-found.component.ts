import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  template:
    `
  <div class="absolute inset-0 flex flex-col min-w-0 overflow-y-auto -px-20" cdkScrollable>
    <div class="flex-auto p-6 sm:p-10">
  <div class="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]">
  <header class="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
    <a href="#">
      <span class="sr-only">Your Company</span>
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="https://firebasestorage.googleapis.com/v0/b/condo-mgmt.appspot.com/o/logo.png?alt=media&token=8c826534-947b-4dae-a95d-7fa431f61e72" alt="Logo">
    </a>
  </header>
  <main class="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
    <div class="max-w-lg">
      <p class="text-3xl font-semibold leading-8 text-indigo-600">404</p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
      <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
      <div class="mt-10">
        <a href="/projects" class="text-3xl font-semibold leading-7 text-indigo-600"><span aria-hidden="true">&larr;</span> Back to home</a>
      </div>
    </div>
  </main>

</div>
</div>
</div>
`
})
export class PageNotFoundComponent {

}
