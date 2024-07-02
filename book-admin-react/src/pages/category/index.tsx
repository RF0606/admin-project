import { Button, Col, Form, Image, Input, Modal, Row, Select, Space, Table, TablePaginationConfig, Tag, message } from "antd";
import dayjs from 'dayjs'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css"
import { CategoryQueryType } from "@/type";
import Content from "@/components/Content";
import { categoryDelete, getCategoryList } from "@/api/category";


const LEVEL = {
  ONE: 1,
  TWO: 2,
};

export const LEVEL_OPTIONS = [
  { label: "级别1", value: LEVEL.ONE },
  { label: "级别2", value: LEVEL.TWO },
];

const COLUMNS = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '级别',
    // dataIndex要跟category.d.ts里面的CategoryQueryType中的名字对应
    dataIndex: 'level',
    key: 'level',
    width: 120,
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>
        {`级别${text}`}
      </Tag>
    }
  },
  {
    title: '所属分类',
    dataIndex: 'parent',
    key: 'parent',
    width: 120,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
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

export default function Category() {
  //数据，和部分初始化，任何状态的更新都会重新渲染页面
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });


  //渲染之后更新页面信息
  async function fetchData(values?: any) {
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    }); //带着当前页和页面大小传给后端，获取对应数据，set到data里
    // console.log(res)
    const { data } = res;
    setData(data);
    setPagination({ ...pagination, total: res.total });
  };

  //render渲染完之后加载，如果[]内的东西有改变，继续加载useEffect内的
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //搜索功能
  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getCategoryList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    }); //带着选好的value，以及设定好的当前页和pagesize，传给后端，获取对应数据，放到res里
    // console.log(res);
    setData(res.data);
    // setPagination({ ...pagination, current: 1, total: res.total });
    setPagination(prev => ({ ...prev, current: 1, total: res.total })); //prev指的是先前配置, 查询完之后更新分页的数据，保证在第一页，还有总数
  };

  //清空选择内容
  const handleSearchReset = () => {
    form.resetFields();
  };

  //编辑category，'' 和 `` 的区别
  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`);
  };

  //分页
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue(); // query是对应查询form里的value
    getCategoryList({ //用新的条件去获取新的数据 待修改
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    }).then(res => { //res代表上边getBookList的返回结果，更新给data，下面这点其实可以不用写
      setData(res.data);
      setPagination(pagination); //和上边那个2选1用就行
    });
  };

  //删除
  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "确定删除?",
      okText: "确定",
      cancelText: "取消",
      async onOk(){
        await categoryDelete(id);
        message.success("删除成功");
        fetchData(form.getFieldsValue());
      },
    });
  };

  //在书籍后边添加编辑和删除
  const columns = [...COLUMNS,
  {
    title: '操作', key: "action", render: (_: any, row: any) => {
      return (
        <Space>
          <Button type="link" onClick={() => { handleCategoryEdit(row._id) }}>编辑</Button>
          <Button type="link" danger onClick={() => { handleCategoryDelete(row._id) }}>删除</Button>
        </Space>
      );
    },
  },
  ];

  return (
    <Content
      title="分类列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/category/add")
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
          level: ''
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="level" label="级别" >
              <Select
                allowClear
                showSearch
                placeholder="请选择"
                options={LEVEL_OPTIONS}
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
