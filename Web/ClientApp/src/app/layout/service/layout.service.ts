import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface Config {
    inputStyle: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    _config: Config = {
        inputStyle:"outlined",
        menuMode: "static",
        ripple: true,
        scale: 14
    }

    config = signal<Config>(this._config);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<Config>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor(private http: HttpClient) {
        effect(() => {
            const config = this.config();
            this.changeScale(config.scale);
            this.onConfigUpdate();

            this.updateSetting(config).subscribe((res: boolean) => {
                if (res) {
                    localStorage.setItem("setting", JSON.stringify(config))
                }
            })
        });
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar = () => this.state.configSidebarVisible = true

    isOverlay = () => this.config().menuMode === 'overlay'

    isDesktop = () => window.innerWidth > 991

    isMobile = () => !this.isDesktop()

    onConfigUpdate() {
        this._config = { ...this.config() };
        this.configUpdate.next(this.config());
    }

    changeScale = (value: number) => document.documentElement.style.fontSize = `${value}px`;

    updateSetting = (config: Config): Observable<boolean> => this.http.disableLoading().post<boolean>(`setting`, config)

}
