import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private originalColor = '';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.originalColor = this.elementRef.nativeElement.style.backgroundColor;
    this.elementRef.nativeElement.style.backgroundColor = this.appHighlight || 'yellow';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.elementRef.nativeElement.style.backgroundColor = this.originalColor;
  }
}
