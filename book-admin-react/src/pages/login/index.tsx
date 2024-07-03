import { login } from "@/api/user";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";

export default function Login() {
  const router = useRouter();
  const handleFinish = async (values: { name: string; password: string }) => {

    const res = await login(values);
    // {data:{id:xx,name:xxx}}
    // if (res.code === 200) {
      message.success("登陆成功");
      router.push("/book");
    // }

    // try {
    //   const res = await login(values);
    //   if(res.data){
    //     message.success("登陆成功");
    //     router.push("/book");
    //   }else{
    //     message.error("登陆失败，请检查您的账号和密码");
    //   }
    // }catch (error) {
    //   message.error("请求失败，请稍后重试");
    //   console.error("Login error:", error);
    // }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>图书管理系统</h2>
      <Form onFinish={handleFinish}>
        <Form.Item
          label="账号"
          name="name"
          rules={[{ required: true, message: "请输入账号" }]}
        >
          <Input placeholder="请输入账号" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入密码" autoComplete="off" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >
            登陆
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}