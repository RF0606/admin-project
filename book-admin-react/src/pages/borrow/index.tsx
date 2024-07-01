import { Button, Col, Form, Modal, Row, Select, Space, Table, TablePaginationConfig, Tag, Tooltip, message } from "antd";
import dayjs from 'dayjs'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css"

import { getBookList } from "@/api/book";
import { BookType, BorrowQueryType, BorrowType } from "@/type";
import Content from "@/components/Content";
import { borrowDelete, getBorrowList } from "@/api/borrow";

const STATUS_OPTIONS = [
  {
    label: "借出",
    value: "on",
  },
  {
    label: "归还",
    value: "off",
  },
];

const COLUMNS = [
  {
    title: '名称',
    //这个dataIndex需要在下面的newData里传入，才能在正常显示
    dataIndex: 'bookName',
    key: 'bookName',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (text: string) => text === "on" ? (<Tag color="red">借出</Tag>) : (<Tag color="green">已还</Tag>),
  },
  {
    title: '借阅人',
    dataIndex: 'borrowUser',
    key: 'borrowUser',
    width: 80
  },
  {
    title: '借阅时间',
    dataIndex: 'borrowAt',
    key: 'borrowAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
  {
    title: '归还时间',
    dataIndex: 'backAt',
    key: 'backAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];

export default function Borrow() {
  //数据，和部分初始化，任何状态的更新都会重新渲染页面
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [bookList, setBookList] = useState<BookType[]>([]);
  //需要修改userlist的类型
  const [userList, setUserList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  });


  async function fetchData(value?: BorrowQueryType) {
    const res = await getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...value,
    }); //带着当前页和页面大小传给后端，获取对应数据，set到data里
    console.log("这是res:", res)
    //提取需要的信息，更新给data
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }));
    console.log("这是newdata", newData);
    setData(newData);
    setPagination({ ...pagination, total: res.total });
  };

  //render渲染完之后加载，如果[]内的东西有改变，继续加载useEffect内的
  useEffect(() => {
    //渲染之后更新页面信息
    fetchData();
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //搜索功能
  const handleSearchFinish = async (values: BorrowQueryType) => {
    //console.log(values) //搜索框里的value
    const res = await getBorrowList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize
    }); //带着选好的value，以及设定好的当前页和pagesize，传给后端，获取对应数据，放到res里
    const newData = res.data.map((item: BorrowType) => ({
      ...item,
      bookName: item.book.name,
      borrowUser: item.user.nickName,
    }));
    setData(newData);
    setPagination(prev => ({ ...prev, current: 1, total: res.total })) //prev指的是先前配置, 查询完之后更新分页的数据，保证在第一页，还有总数
  }

  //清空选择内容
  const handleSearchReset = () => {
    //console.log(form.getFieldsValue())
    form.resetFields();
  };

  //编辑book
  const handleBookEdit = (id: string) => {
    router.push(`/borrow/edit/${id}`);
  };

  //分页, 有then就不用await，不要同时用
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    const query = form.getFieldsValue(); // query是对应查询form里的value
    getBorrowList({ //用新的条件去获取新的数据
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    }).then(res => { //res代表上边getBookList的返回结果，更新给data，下面这点其实可以不用写
      const newData = res.data.map((item: BorrowType) => ({
        ...item,
        bookName: item.book.name,
        borrowUser: item.user.nickName,
      }));
      setData(newData);
      setPagination(pagination); //和上边那个2选1用就行
    });
  };

  //删除
  const handleBorrowDelete = (id: string) => {
    Modal.confirm({
      title: "确定删除?",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await borrowDelete(id);
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
          <Button type="link" onClick={() => { handleBookEdit(row._id) }}>编辑</Button>
          <Button type="link" danger onClick={() => { handleBorrowDelete(row._id) }}>删除</Button>
        </Space>
      )
    }
  }
  ]

  return (
    <Content
      title="借阅列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/borrow/add")
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
          author: '',
          category: ''
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="书籍名称">
              <Select
                allowClear
                showSearch
                //开始按名字搜索
                optionFilterProp="label"
                options={bookList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="status" label="状态" >
              <Select allowClear options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="user" label="借阅人" >
              <Select
                allowClear
                showSearch
                placeholder="请选择"
                options={userList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
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

      {/*书籍页面显示*/}
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
