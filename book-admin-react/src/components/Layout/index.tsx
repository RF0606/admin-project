import React, { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Layout as AntdLayout, Dropdown, Menu } from "antd";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { ITEMS } from "./sideBarItems";
import { USER_ITEMS } from "./userItems"

const { Header, Content, Sider } = AntdLayout;

//处理下面children爆红问题的
interface LayoutProps {
  children: ReactNode;
}
// export function Layout({ children }: LayoutProps) {
export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  //next.js用useRouter();替换了vite里那俩
  const router = useRouter();
  //用于实现跳转之后正确显示在哪个路径上
  const activeMenu = router.pathname;
  const [user, setUser] = useState({ info: { nickName: "" } });

  //user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStorage = localStorage.getItem('user');
      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }
    }
  }, [])

  //处理点击跳转
  const menuClick = (e: { key: string }) => {
    //console.log("点击了",e.key)
    router.push(e.key);
  };

  //下面实现自动闭合sidebar和记忆选择
  function findKey(obj: { key: string }) {
    return obj.key === router.pathname
  };

  const keysWithChildren = ITEMS.map(item => {
    if (item.children && item.children.length > 0 && item.children.find(findKey)) {
      return item.key;
    }
    return null; // 如果没有满足条件的子元素，则返回 null
  }).filter(key => key !== null) as string[];

  const defaultOpenKey = keysWithChildren.length > 0 ? keysWithChildren[0] : "";
  const [openKeys, setOpenKeys] = useState<string[]>([defaultOpenKey]);
  const handleOpenChange = (keys: string[]) => {
    //这块需要传递一个数组下来，上边初始化的时候也要初始化成一个空数组，保持一致性
    setOpenKeys([keys[keys.length - 1]]);
  };

  //页面
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <AntdLayout>
          <Header className={styles.header}>
            <Image
              src="/logo.svg"
              width={30}
              height={30}
              alt="logo"
              className={styles.logo}
            />
            三木图书管理系统
            <span className={styles.user}>
              <Dropdown menu={{ items: USER_ITEMS }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {user?.info?.nickName ? user?.info?.nickName : '用户名'}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </span>
          </Header>
          <AntdLayout className={styles.sectionInner}>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={[router.pathname]}
                selectedKeys={[activeMenu]}
                style={{ height: "100%", borderRight: 0 }}
                items={ITEMS}
                onClick={menuClick}
                onOpenChange={handleOpenChange}
                openKeys={openKeys}
              />
            </Sider>
            <AntdLayout className={styles.sectionContent}>
              <Content className={styles.content}>{children}</Content>
            </AntdLayout>
          </AntdLayout>
        </AntdLayout>
      </main>
    </>
  );
};
