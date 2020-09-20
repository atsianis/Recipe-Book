import { Directive, ElementRef, Renderer2, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;


  // This closes the menu only on clicking on the button
  // @HostListener('click') toggleOpen(){
  //   this.isOpen = !this.isOpen
  // }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  
  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    
  }

}
