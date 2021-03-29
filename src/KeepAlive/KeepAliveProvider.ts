import React from "react";
import { AppMenuItem, AppMenuItemPresistenceChanged } from ".";
import warning from 'tiny-warning';

export interface IProps {
    routes: Array<AppMenuItem>;
}

export class KeepAliveProvider extends React.PureComponent<IProps> {
    private static instance: KeepAliveProvider;
    readonly routes: AppMenuItem[];
    readonly presistenceChangedRoutes: AppMenuItemPresistenceChanged[];
    private constructor(props: IProps) {
        super(props);
        this.routes = this.props.routes;
        this.presistenceChangedRoutes = [];

        KeepAliveProvider.instance = this;
    }

    public static getRoutes() {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }
        return this.instance.routes;
    }

    public static getPresistenceChangedRoutes() {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }
        return this.instance.presistenceChangedRoutes;
    }

    public static changeRoutesPresistenceState(
        menus: AppMenuItemPresistenceChanged[]
    ) {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }

        if (menus && menus.length > 0) {
            for (let i = 0; i < menus.length; i++) {
                const route = this.instance.presistenceChangedRoutes.find(
                    (p) => (p.path = menus[i].path)
                );
                if (route) {
                    route.presistence = menus[i].presistence;
                } else {
                    this.instance.presistenceChangedRoutes.push({
                        path: menus[i].path,
                        presistence: menus[i].presistence,
                    });
                }
            }
        }
    }

    render() {
        return this.props.children;
    }
}
