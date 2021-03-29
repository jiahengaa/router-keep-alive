import React, { createElement, ReactNode } from "react";

import { KeepAliveProvider } from "./KeepAliveProvider";

export interface View {
    id: number;
    name: string;
    path: string;
    presistence: boolean;
    displayName: string;
    component?: React.ComponentType<any>;
    presistenceRenderContent: ReactNode;
}

export interface IState {
    viewList: Array<View>;
    curView: View | null;
}

export default class RouterView extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            viewList: [],
            curView: null,
        };
    }

    routesInit() {
        const routes = KeepAliveProvider.getRoutes();
        let count = 0;
        routes.map((route) => {
            this.state.viewList.push({
                id: count++,
                name: route.name,
                path: route.path,
                presistence: route.presistence,
                displayName: route.displayName,
                component: route.component,
                presistenceRenderContent: "",
            });
        });
    }

    hashChanged = ((location: Location) => {
        const viewPath = location.hash.substring(2, location.hash.length);
        const presistenceChangedRoutes = KeepAliveProvider.getPresistenceChangedRoutes();
        if (this.state.curView?.path === viewPath) {
            return;
        } else {
            let curView = this.state.viewList.find((p) => p.path === viewPath);

            if (curView === null || curView === undefined) {
                return;
            } else {
                curView.presistence =
                    presistenceChangedRoutes.find((p) => p.path === curView?.path)
                        ?.presistence ?? curView.presistence;

                if (curView.presistence && curView.presistenceRenderContent !== "") {
                    let state = {
                        ...this.state,
                    };

                    let curStateView = state.viewList.find(
                        (p) => p.path === curView?.path
                    );
                    if (curStateView !== undefined) {
                        curStateView.presistence = curView.presistence;
                    }
                    state.curView = curView;
                    this.setState(state);
                } else {
                    if (curView.presistence) {
                        let state = {
                            ...this.state,
                        };
                        curView.presistenceRenderContent = curView.component
                            ? createElement(curView.component, {})
                            : null;

                        let curStateView = state.viewList.find(
                            (p) => p.path === curView?.path
                        );
                        if (curStateView !== undefined) {
                            curStateView.presistenceRenderContent = curView.component
                                ? createElement(curView.component, {})
                                : null;
                        }

                        state.curView = curView;
                        this.setState(state);
                    } else {
                        let state = {
                            ...this.state,
                        };

                        let curStateView = state.viewList.find(
                            (p) => p.path === curView?.path
                        );
                        if (curStateView !== undefined) {
                            curStateView.presistence = curView.presistence;
                        }
                        state.curView = curView;
                        this.setState(state);
                    }
                }
            }
        }
    }).bind(this)

    hashChangedHandle = ((evt: HashChangeEvent) => {
        if (evt.oldURL === evt.newURL) {
            return;
        }
        //分析路由，打开对应菜单
        this.hashChanged((evt.target as Window).location);
    }).bind(this)

    componentDidMount() {
        this.routesInit();

        window.addEventListener("hashchange", this.hashChangedHandle);
        //分析路由，打开对应菜单
        this.hashChanged(window.location);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.hashChangedHandle);
    }

    renderContent() {
        return this.state.viewList.map((view, index) => {
            if (view.presistence && view.presistenceRenderContent !== "") {
                return createElement(
                    "div",
                    {
                        key: index,
                        style: {
                            display:
                                view.path === this.state.curView?.path ? "inherit" : "none",
                        },
                    },
                    view.presistenceRenderContent
                );
            } else if (view.presistence === false && view.component) {
                if (view.path === this.state.curView?.path) {
                    return createElement(view.component ?? "", {
                        key: index,
                        style: {
                            display:
                                view.path === this.state.curView?.path ? "inherit" : "none",
                        },
                    });
                } else {
                    return "";
                }
            } else {
                return "";
            }
        });
    }

    render() {
        return this.renderContent();
    }
}
