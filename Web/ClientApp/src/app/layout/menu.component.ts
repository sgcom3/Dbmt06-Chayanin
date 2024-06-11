import { Component } from '@angular/core';
import { LayoutService } from './service/layout.service';
import { MenuItem } from 'primeng/api';
import { MenuService } from './menu.service';

@Component({
    selector: 'x-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {

    model: MenuItem[] = [];

    constructor(public layoutService: LayoutService, private menuService: MenuService) {
        this.menuService.getMenuList().subscribe((item) => {
            this.model = item
        })
    }
}
