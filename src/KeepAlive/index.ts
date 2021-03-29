import { KeepAliveProvider } from "./KeepAliveProvider";
import RouterView from "./RouterView";

export enum MenuType {
    Fold = "Fold",
    Menu = "Menu",
}

export interface MenuItem {
    name: string;
    path: string;
    icon?: string;
    type: MenuType;
    presistence?: boolean;
    displayName: string;
    permissions: string[];
    children?: MenuItem[];
}

export interface AppMenuItem {
    name: string;
    path: string;
    redirect?: string;
    presistence: boolean;
    displayName: string;
    component?: React.ComponentType<any>;
}

export interface AppMenuItemPresistenceChanged {
    path: string;
    presistence?: boolean;
}

export { KeepAliveProvider, RouterView };
