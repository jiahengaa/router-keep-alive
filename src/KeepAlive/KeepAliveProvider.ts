import React from "react";
import { AppMenuItem, AppMenuItemPresistenceChanged } from ".";
import warning from 'tiny-warning';

export interface IProps {
    routes: Array<AppMenuItem>;
}

export class KeepAliveProvider extends React.PureComponent<IProps> {
    private static instance: KeepAliveProvider;
    readonly routes: AppMenuItem[];
    private willDisposeViews: String[];
    readonly presistenceChangedRoutes: AppMenuItemPresistenceChanged[];
    private constructor(props: IProps) {
        super(props);
        this.routes = this.props.routes;
        this.willDisposeViews = [];
        this.presistenceChangedRoutes = [];

        KeepAliveProvider.instance = this;
    }

    /**
     * get all routes
     * @returns get all routes
     */
    public static getRoutes() {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }
        return this.instance.routes;
    }

    /**
     * get all routes that needs update presistence
     * @returns get all routes that need to update presistence state
     */
    public static getPresistenceChangedRoutes() {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }
        return this.instance.presistenceChangedRoutes;
    }

    /**
     * push views that are about to be destroyed
     * @param viewPaths views that are about to be destroyed
     */
    public static pushDisposePresistenceView(viewPaths: String[]) {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }
        this.instance.willDisposeViews = viewPaths;
    }

    /**
     * pop all views that are about to be destroyed
     * @returns all views that are about to be destroyed
     */
    public static popWillDisposeViews() {
        if (!this.instance) {
            warning(this.instance, "please ensure KeepAliveProvider installed");
        }

        const tempDV = [...this.instance.willDisposeViews]
        this.instance.willDisposeViews = []
        return tempDV;
    }

    /**
     * dynamic update some routes presistence state
     * @param menus newest State
     */
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
