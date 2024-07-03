import { logout } from "@/api/user";
import { MenuProps, message } from "antd";
import Link from "next/link";
import router from "next/router";

export const USER_ITEMS: MenuProps["items"] = [
    {
        label: <Link href="/user/edit/id">用户中心</Link>,
        key: "1",
    },
    {
        label: (
            <span
                onClick={async () => {
                    await logout();
                    message.success("登出成功");
                    router.push("/login");
                }}
            >
                登出
            </span>
        ),
        key: "2",
    },
];