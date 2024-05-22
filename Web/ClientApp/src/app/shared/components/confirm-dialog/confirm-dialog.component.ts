import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, viewChild } from "@angular/core";
import { Guid } from "guid-ts";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject } from "rxjs";
 
export interface Confirmation {
    /**
     * The message to be displayed in the confirmation dialog.
     */
    message?: string;
    /**
     * A unique key to identify the confirmation dialog.
     */
    key?: string;
    /**
     * The name of the icon to be displayed in the confirmation dialog.
     */
    icon?: string;
    /**
     * The header text of the confirmation dialog.
     */
    header?: string;
    /**
     * The callback function to be executed when the accept button is clicked.
     */
    accept?: Function;
    /**
     * The callback function to be executed when the reject button is clicked.
     */
    reject?: Function;
    /**
     * The label text for the accept button.
     */
    acceptLabel?: string;
    /**
     * The label text for the reject button.
     */
    rejectLabel?: string;
    /**
     * The name of the icon to be displayed on the accept button.
     */
    acceptIcon?: string;
    /**
     * The name of the icon to be displayed on the reject button.
     */
    rejectIcon?: string;
    /**
     * Specifies whether the accept button should be visible.
     */
    acceptVisible?: boolean;
    /**
     * Specifies whether the reject button should be visible.
     */
    rejectVisible?: boolean;
    /**
     * Specifies whether to block scrolling on the page when the confirmation dialog is displayed.
     */
    blockScroll?: boolean;
    /**
     * Specifies whether the confirmation dialog should be closed when the escape key is pressed.
     */
    closeOnEscape?: boolean;
    /**
     * Specifies whether clicking outside the confirmation dialog should dismiss it.
     */
    dismissableMask?: boolean;
    /**
     * The ID or class name of the element to receive focus by default when the confirmation dialog is opened.
     */
    defaultFocus?: string;
    /**
     * The CSS class name to be applied to the accept button.
     */
    acceptButtonStyleClass?: string;
    /**
     * The CSS class name to be applied to the reject button.
     */
    rejectButtonStyleClass?: string;
    /**
     * The target event where the confirmation dialog is triggered from.
     */
    target?: EventTarget;
    /**
     * An event emitter for the accept event.
     */
    acceptEvent?: EventEmitter<any>;
    /**
     * An event emitter for the reject event.
     */
    rejectEvent?: EventEmitter<any>;
}
 
// The component for alert toast with HTML template
@Component({
    selector: 'p-confirm-dialog-ng'
    , styles: `
        // :host{
        //     p-confirmDialog[key="confirm-dialog-key"]{
        //         ::ng-deep.p-confirm-dialog, .p-component
        //         {
        //                 width: auto !important;
        //             }
        //     }
        // }
 
    `
    , template: `
            <span id="btn-confirm-dialog"
            (click)="open()">
                <ng-content select="[btn]"></ng-content>
            </span >
            <p-confirmDialog key="{{key}}{{name}}"
            [style]="{width: '25vw'}"
            [breakpoints]="{'960px': '75vw'}">
                <ng-template pTemplate="message" let-message>
                    <ng-content select="[body]"></ng-content>
                </ng-template>
            </p-confirmDialog>

            <!-- <p-confirmDialog *ngIf="isShowDirty" key="confirm-dirty"
            [style]="{width: '25vw'}"
            [breakpoints]="{'960px': '75vw'}">
            <ng-template pTemplate="message" let-message>
            <p class="mb-0">{{ message.message }}</p>
            </ng-template>
            </p-confirmDialog> -->
        `,
})
export class ConfirmDialogComponent {  
    display = false;
    @Input() key = 'confirm-dialog'
    // @Input() isShowDirty = true;
    @Input() confirmDialogModel: ConfirmDialogModel = new ConfirmDialogModel();
    @Output() confirm = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() click = new EventEmitter();
    name = Guid.newGuid().toString();
    constructor(private confirmationService: ConfirmationService
        , private messageService: MessageService) {
 
    }
 
    open(event: Event | any = null) {
        this.click.emit();
        this.confirmationService.confirm({
            key: `${this.key}${this.name}` || `${this.confirmDialogModel.key}${this.name}`,
            message: this.confirmDialogModel.message,
            header: this.confirmDialogModel.header,
            icon: this.confirmDialogModel.icon,
            acceptIcon: this.confirmDialogModel.acceptIcon,
            rejectIcon: this.confirmDialogModel.rejectIcon,
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.confirm.emit();
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                this.cancel.emit();
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
 
    onCancel() {
        this.cancel.emit();
    }
}
 
export class ConfirmDialogModel {
    public message?: string;
    public key?: string;
    public icon?: string;
    public header?: string;
    public acceptLabel?: string;
    public rejectLabel?: string;
    public acceptIcon?: string;
    public rejectIcon?: string;
    public observe?: BehaviorSubject<any>;
    // accept?: Function;
    // reject?: Function;
 
 
    constructor(initial: Confirmation = null) {
        this.key = initial?.key || 'confirm-dialog';
        this.icon = initial?.icon || '';
        this.header = initial?.header || 'Please confirm';
        this.message = initial?.message || 'Are you sure you want to continue?';
        this.acceptLabel = initial?.acceptLabel || 'Yes';
        this.rejectLabel = initial?.rejectLabel || 'No';
        this.acceptIcon = initial?.acceptIcon || 'none';
        this.rejectIcon = initial?.rejectIcon || 'none';
        this.observe = new BehaviorSubject(true);
    }
}