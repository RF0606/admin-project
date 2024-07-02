import { getBookList } from "@/api/book";
import { borrowAdd, borrowUpdate } from "@/api/borrow";
import { getUserList } from "@/api/user";
import Content from "@/components/Content";
import styles from "@/styles/Home.module.css";
import { BookType, BorrowType, UserType } from "@/type";
import { Button, Form, Select, message } from "antd";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";


export default function BorrowForm({ title, editData }: { title: string, editData?: any }) {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [stock, setStock] = useState(0);

    useEffect(() => {
        getUserList().then((res) => {
            setUserList(res.data);
        });
        getBookList().then((res) => {
            setBookList(res.data);
        });
    }, []);

    const handleFinish = async (values: BorrowType) => {
        try {
            if (editData?._id) {
                await borrowUpdate(values);
                message.success("编辑成功");
            } else {
                await borrowAdd(values);
                message.success("创建成功");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // value和option是下面select里的options里的内容, 通过value找对应的option
    // 组件要求，必须得传2个参数
    const handleBookChange = (value: any, option: any) => {
        setStock(option.stock);
    };

    return (
        <Content title={title}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                layout="horizontal"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="书籍名称"
                    name="book"
                    rules={[
                        {
                            required: true,
                            message: "请输入名称",
                        },
                    ]}
                >
                    <Select
                        onChange={handleBookChange}
                        placeholder="请选择"
                        options={bookList.map((item: BookType) => ({
                            label: item.name,
                            value: item._id,
                            stock: item.stock,
                        }))}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="借阅用户"
                    name="user"
                    rules={[
                        {
                            required: true,
                            message: "请输入作者",
                        },
                    ]}
                >
                    <Select
                        placeholder="请选择"
                        options={userList.map((item: UserType) => ({
                            label: item.name,
                            value: item._id,
                        }))}
                    ></Select>
                </Form.Item>
                <Form.Item
                    label="书籍库存"
                    rules={[
                        {
                            required: true,
                            message: "请选择分类",
                        },
                    ]}
                >
                    {stock}
                </Form.Item>
                <Form.Item label=" " colon={false}>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className={styles.btn}
                        disabled={stock <= 0}
                    >
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </Content>
    );
}