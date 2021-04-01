<h1 align="center">Welcome to react router-keep-alive 👋</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

### 🏠 [Homepage](https://github.com/jiahengaa/router-keep-alive)

### &#x1F42E;:pig_nose: Only supports hash routing mode! :point_left:

React Router Component ,Truely Keep Alive Component
## Install

```sh
yarn add router-keep-alive

# or

npm i router-keep-alive
```

## Usage

```tsx
//main.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import App from './app';

import { routes } from 'app/router'

//install router-keep-alive component
import { KeepAliveProvider } from 'router-keep-alive'

ReactDOM.render(
  <KeepAliveProvider routes={routes}>
    <App />
  </KeepAliveProvider>,
  document.getElementById('root')
);

```

```tsx
// src/app/router/index.ts

import { Patient } from "app/components/Patient";
import { User } from "app/components/User";
import { Log } from "app/components/Log";
import { App as TodoList } from "app/containers/App";

import { MenuItem, AppMenuItem, MenuType } from 'router-keep-alive'

//menu modules
export const routes: AppMenuItem[] = [
  {
    name: "patient",
    path: "patient",
    presistence: false,
    displayName: "PatientManagement",
    component: Patient,
  },
  {
    name: "user",
    path: "user",
    presistence: true,
    displayName: "UserManagement",
    component: User,
    // component: () => import("app/components/User"), not support
  },
  {
    name: "log",
    path: "log",
    presistence: true,
    component: Log,
    displayName: "LogManagement",
  },
  {
    name: "todoList",
    path: "todoList",
    presistence: true,
    component: TodoList,
    displayName: "TodoList",
  },
];

// custom menus, user can visit
export const renderRoutes: MenuItem[] = [
  {
    name: "patient",
    path: "patient",
    type: MenuType.Menu,
    presistence: false,
    displayName: "PatientManagement",
    permissions: [],
  },
  {
    name: "user",
    path: "user",
    presistence: true,
    displayName: "UserManagement",
    permissions: [],
    type: MenuType.Menu,
  },
  {
    name: "log",
    path: "log",
    presistence: true,
    displayName: "LogManagement",
    permissions: [],
    type: MenuType.Menu,
  },
  {
    name: "todoList",
    path: "todoList",
    presistence: true,
    displayName: "TodoList",
    permissions: [],
    type: MenuType.Menu,
  },
];


```

```tsx
// App

import React, { Component } from 'react';
import { HomeLayout } from 'app/components/index';

import { AppMenu } from 'app/models';
import { renderRoutes } from 'app/router'

// important!
import { KeepAliveProvider, RouterView } from 'router-keep-alive'

export interface IProps {
    initMenu?: (menuList: PartialPick<AppMenu, 'menuList'>) => void
}

export default class App extends Component<IProps> {

    componentWillMount() {
        const { initMenu } = this.props;
        if (initMenu) {
            setTimeout(() => {
                const menuList = renderRoutes // mock async way to get routes
                initMenu({
                    menuList
                })

                // can dynamic change component presistence state
                KeepAliveProvider.changeRoutesPresistenceState(menuList.map(menu => {
                    return {
                        path: menu.path,
                        presistence: menu.presistence
                    }
                }))

            }, 3000);

        }
    }

    render() {
        return <HomeLayout>
            <RouterView></RouterView>  //important! component will render here
        </HomeLayout>;
    }
};


```

```tsx
// HomeLayout

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/reducers';
import { Layout } from 'antd';
import style from './style.css';

import { MenuItem } from 'router-keep-alive'

export interface Props {
  children: React.ReactNode;
}

const { Header, Sider, Content } = Layout;

export const HomeLayout: React.FC<Props> = (props) => {

  const { appMenu } = useSelector((state: RootState) => {
    return {
      appMenu: state.appMenuState
    };
  });

  return (
    <Layout className={style.homeLayout}>
      <Sider className={style.sider}>
        {
          appMenu.menuList.map((item: MenuItem, index: any) => {
            return <a key={index} href={'/#/' + item.path}>{item.displayName}</a> //hash mode
          })
        }
      </Sider>
      <Layout>
        <Header className={style.header}>Header</Header>
        <Content className={style.content}>
          {props.children}  //props.children = <RouterView></RouterView>
        </Content>
      </Layout>
    </Layout>
  );
};


```

## Contributions Welcome!

```sh
git clone github.com/jiahengaa/router-keep-alive
cd router-keep-alive
yarn
yarn start
```

open another terminal tab

```sh
cd example
yarn
yarn start
```

## Run tests

```sh
yarn test
```

## Author

👤 **jiahengaa**

## Show your support

Give a ⭐️ if this project helped you!
