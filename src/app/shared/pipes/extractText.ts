import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'extractText'
})
export class ExtractTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    // const sanitizedHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    // const div = document.createElement('div');
    // div.innerHTML = sanitizedHtml.toString();
    // return div.innerText.trim();

   // Create a new div element
   var temporalDivElement = document.createElement("div");
   // Set the HTML content with the providen
   temporalDivElement.innerHTML = html;
   // Retrieve the text property of the element (cross-browser support)
   return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }
}