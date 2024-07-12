import { bookAdd, bookUpdate } from "@/api/book";
import { BookType, CategoryType } from "@/type";
import { getCategoryList } from "@/api/category";
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    Select,
    message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "./index.module.css";
import Content from "../Content";

const { RangePicker } = DatePicker;
const { TextArea } = Input;


export default function BookForm({
    title,
    editData
}: {
    title: string,
    editData: BookType
}) {
    const [preview, setPreview] = useState("");
    //antd创建表单用的
    const [form] = Form.useForm();
    const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (editData?._id) {
            form.setFieldsValue({ ...editData });
        }

    }, [editData, form]);

    //提交表单时的操作
    const handleFinish = async (values: BookType) => {
        //如果输入的有publishAt就转换成一个时间戳格式
        if (values.publishAt) {
            values.publishAt = dayjs(values.publishAt).valueOf();
        }
        if (editData?._id) {
            await bookUpdate(editData._id, values);
        }else{
            await bookAdd(values);
        }
        message.success("创建成功");
        router.push("/book");
    };

    //完善分类列表内的内容
    useEffect(() => {
        getCategoryList({ all: true }).then(res => {
            setCategoryList(res.data);
        });
    }, []);

    return (
        <Content title={title}>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                layout="horizontal"
                onFinish={handleFinish}
            >
                {/* 名称 */}
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "请输入名称",
                        },
                    ]}
                >
                    <Input placeholder="请输入" />
                </Form.Item>

                {/* 作者 */}
                <Form.Item
                    label="作者"
                    name="author"
                    rules={[
                        {
                            required: true,
                            message: "请输入作者",
                        },
                    ]}
                >
                    <Input placeholder="请输入" />
                </Form.Item>

                {/* 分类 */}
                {/* <Form.Item
                    label="分类"
                    name="category"
                    rules={[
                        {
                            required: true,
                            message: "请选择分类",
                        },
                    ]}
                >
                    <Select
                        placeholder="请选择"
                        options={categoryList.map((item) => ({
                            label: item.name,
                            value: item._id,
                        }))}
                    ></Select>
                </Form.Item> */}

                {/* 封面 */}
                <Form.Item label="封面" name="cover">
                    <Input.Group compact>
                        <Input
                            placeholder="请输入"
                            style={{ width: "calc(100% - 65px)" }}
                            onChange={(e) => {
                                form.setFieldValue("cover", e.target.value); //拿到输入的值,和key cover关联
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={(e) => {
                                setPreview(form.getFieldValue("cover")); //去除cover的value然后赋值给Preview
                            }}>预览</Button>
                    </Input.Group>
                </Form.Item>

                {/* 如果preview有值就渲染图像出来 */}
                {preview && (
                    <Form.Item label=" " colon={false}>
                        <Image src={preview} width={100} height={100} alt="" />
                    </Form.Item>
                )}

                {/* 出版日期 */}
                <Form.Item label="出版日期" name="publishAt">
                    <DatePicker placeholder="请选择" />
                </Form.Item>

                {/* 库存 */}
                <Form.Item label="库存" name="stock">
                    <InputNumber placeholder="请输入" />
                </Form.Item>

                {/* 描述 */}
                <Form.Item label="描述" name="description">
                    <TextArea rows={4} placeholder="请输入" />
                </Form.Item>

                {/* submit */}
                <Form.Item label=" " colon={false}>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit" //保证触发form表单的默认提交行为，触发rules的规则
                        className={styles.btn}
                    >{editData?._id ? '更新' : '创建'}</Button>
                </Form.Item>
            </Form>
        </Content>
    );
}