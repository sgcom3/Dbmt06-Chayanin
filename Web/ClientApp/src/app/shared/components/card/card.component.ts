import {
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { CardDirective } from './card.directive';
import { Guid } from 'guid-ts';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() header;
  @Input() subheader;
  @Input() style;
  @Input() class;
  @Input() styleClass;
  @Input() toggleable: any | boolean = true;
  loadedPanel = true;
  loadedCard = false;
  id = Guid.newGuid().toString();

  // @ContentChild("cardHeader") headerTemplate!: TemplateRef<any>;
  // // @ContentChild("cardContent") contentTemplate!: TemplateRef<any>;
  // @ContentChild("cardFooter") footerTemplate!: TemplateRef<any>;
  // @ContentChild(CardDirective) template!: CardDirective;
  // @ContentChildren(CardDirective) templateList!: QueryList<CardDirective>;
  template: CardDirective;
  constructor(private templateTemp: CardDirective) {
    this.template = templateTemp;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['toggleable']) {
      if (this.toggleable == true) {
        this.loadedPanel = true;
        this.loadedCard = !this.loadedPanel;
      } else {
        this.loadedCard = true;
        this.loadedPanel = !this.loadedCard;

      }
    }
  }

  ngAfterContentInit() {}
}
