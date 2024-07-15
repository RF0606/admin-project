import { CategoryType } from "@/type";
import { categoryAdd, categoryUpdate, getCategoryList } from "@/api/category";
import { LEVEL_OPTIONS } from "@/pages/category";
import { Button, Form, Input, Select, message,} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import styles from "./index.module.css";
import Content from "../Content";


export default function CategoryForm({ 
    title, 
    editData 
}: { 
    title: string,
    editData: CategoryType
}) {
    //antd创建表单用的
    const [form] = Form.useForm();
    const [level, setLevel] = useState(1);
    const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (editData?._id) {
            form.setFieldsValue({ ...editData });
            setLevel(editData.level);
        }
    }, [editData, form]);


    //提交表单时的操作
    const handleFinish = async (values: CategoryType) => {
        if(editData?._id){
            await categoryUpdate(editData._id, values);
            // console.log(values);
            message.success("更新成功");
        }else{
            await categoryAdd(values);
            message.success("创建成功");
        }
        router.push("/category");
    };

    //更新显示信息
    async function fetchData() {
        const res = await getCategoryList({ all: true, level: 1 });
        setLevelOneList(res.data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    // level options
    const levelOneOptions = useMemo(() => {
        return levelOneList.map((item) => ({
            value: item._id,
            label: item.name,
        }));
    }, [levelOneList]);

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

                {/* 级别 */}
                <Form.Item
                    label="级别"
                    name="level"
                    rules={[
                        {
                            required: true,
                            message: "请选择级别",
                        },
                    ]}
                >
                    <Select
                        onChange={(value) => { 
                            setLevel(value);
                            if (value === 1) {
                                form.setFieldsValue({ parent: undefined });
                            }
                        }}
                        disabled={!!editData?._id}
                        placeholder="请选择"
                        options={LEVEL_OPTIONS}
                    />
                </Form.Item>

                { (level === 2 || editData?.level === 2) && (
                    <Form.Item
                        label="所属级别"
                        name="parent"
                        rules={[
                            {
                                required: true,
                                message: "请选择级别",
                            },
                        ]}
                    >
                        <Select placeholder="请选择" options={levelOneOptions}></Select>
                    </Form.Item>
                )}

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