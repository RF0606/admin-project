import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, TablePaginationConfig, Tag, message } from "antd";
import dayjs from 'dayjs'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css"
import { UserQueryType, UserType } from "@/type";
import Content from "@/components/Content";
import { getUserList, userDelete, userUpdate } from "@/api/user";


enum STATUS {
  ON = "on",
  OFF = "Off",
};

export const STATUS_OPTIONS = [
  { label: "正常", value: STATUS.ON },
  { label: "禁用", value: STATUS.OFF },
];

const COLUMNS = [
  {
    title: '账号',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '用户名',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (text: string) => {
      return text === STATUS.ON ? (
        <Tag color="green">正常</Tag>
      ) : (
        <Tag color="red">禁用</Tag>
      );
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];

export default function User() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });


  async function fetchData(values?: any) {
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });
    console.log(res);
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //user搜索功能
  const handleSearchFinish = async (values: UserQueryType) => {
    const res = await getUserList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    // console.log(res);
    setData(res.data);
    // setPagination({ ...pagination, current: 1, total: res.total });
    setPagination({ ...pagination, current: 1, total: res.total }); //prev指的是先前配置, 查询完之后更新分页的数据，保证在第一页，还有总数
  };

  //清空选择内容
  const handleSearchReset = () => {
    form.resetFields();
  };

  //更新user
  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`);
  };

  //分页
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    }).then(res => {
      setData(res.data);
      setPagination(pagination);
    });
  };

  //user删除
  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "确定删除?",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await userDelete(id);
        message.success("删除成功");
        fetchData(form.getFieldsValue());
      },
    });
  };

  //user状态更新，row的type还待确定一下
  const handleStatusChange = async (row: UserType) => {
    const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON;

    await userUpdate(
      row._id!, {
      ...row,
      status: status as 'off' | 'on',
    });
    fetchData(form.getFieldsValue());
  };

  //在书籍后边添加编辑和删除
  const columns = [...COLUMNS,
  {
    title: '操作', key: "action", render: (_: any, row: any) => {
      return (
        <Space>
          <Button type="link" onClick={() => { handleUserEdit(row._id) }}>编辑</Button>
          <Button type="link" danger={row.status === STATUS.ON ? true : false} onClick={() => { handleStatusChange(row) }}>{row.status === STATUS.ON ? "禁用" : "启用"}</Button>
          <Button type="link" danger onClick={() => { handleUserDelete(row._id) }}>删除</Button>
        </Space>
      );
    },
  },
  ];

  return (
    <Content
      title="用户列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/user/add")
          }}
        >添加</Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: '',
          status: ''
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="status" label="状态" >
              <Select
                allowClear
                showSearch
                placeholder="请选择"
                options={STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>

          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button htmlType="submit" onClick={handleSearchReset}>清空</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/*category页面显示*/}
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{ ...pagination, showTotal: () => `共 ${pagination.total} 条` }}
        />
      </div>
    </Content>
  )
}
