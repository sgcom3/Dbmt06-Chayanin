import { Directive, HostListener, Output, EventEmitter, Input, Renderer2, ElementRef, Attribute, ContentChildren, QueryList, ContentChild, TemplateRef, ViewContainerRef, ViewChild, contentChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Directive({
    selector: 'card'
})
export class CardDirective {
    @ContentChild("cardHeader") headerTemplate!: TemplateRef<any>;
    @ContentChild("cardFooter") footerTemplate!: TemplateRef<any>;
    constructor(private elementRef: ElementRef
        , private viewContainerRef: ViewContainerRef
        , private renderer: Renderer2) { }


    ngAfterContentInit() {
    }
}



