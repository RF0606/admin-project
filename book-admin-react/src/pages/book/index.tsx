import { Button, Col, Form, Image, Input, Row, Select, Space, Table, TablePaginationConfig, Tooltip } from "antd";
import dayjs from 'dayjs'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.css"
import { getBookList } from "@/api/book";
import { BookQueryType } from "@/type";
import Content from "@/components/Content";

const COLUMNS = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover',
    width: 150,
    render: (text: string) => {
      return <Image
        width={50}
        src={text}
        alt=""
      />
    }
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    width: 120
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 80
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    width: 200,
    render: (text: string) => {
      return <Tooltip title={text} placement="topLeft">
        {text}
      </Tooltip>
    }
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    width: 80
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 130,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  },
];

export default function Home() {

  //数据，和部分初始化，任何状态的更新都会重新渲染页面
  const [form] = Form.useForm()
  const router = useRouter()
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    total: 0
  })

  //render渲染完之后加载，如果[]内的东西有改变，继续加载useEffect内的
  useEffect(() => {
    //渲染之后更新页面信息
    async function fetchData() {
      const res = await getBookList({ current: 1, pageSize: pagination.pageSize }) //带着当前页和页面大小传给后端，获取对应数据，set到data里
      console.log(res)
      const { data } = res
      setData(data)
      setPagination(prev => ({ ...prev, current: 1, total: res.total }))
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  //搜索功能
  const handleSearchFinish = async (values: BookQueryType) => {
    //console.log(values) //搜索框里的value
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize }) //带着选好的value，以及设定好的当前页和pagesize，传给后端，获取对应数据，放到res里
    setData(res.data)
    setPagination(prev => ({ ...prev, current: 1, total: res.total })) //prev指的是先前配置, 查询完之后更新分页的数据，保证在第一页，还有总数
  }

  //清空选择内容
  const handleSearchReset = () => {
    //console.log(form.getFieldsValue())
    form.resetFields()
  }

  //编辑book
  const handleBookEdit = () => {
    router.push('/book/edit/id')
  }

  //分页, 有then就不用await，不要同时用
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue() // query是对应查询form里的value
    getBookList({ //用新的条件去获取新的数据
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    }).then(res => { //res代表上边getBookList的返回结果，更新给data，下面这点其实可以不用写
      setData(res.data);
      setPagination(pagination); //和上边那个2选1用就行
    }
    )
  }

  //在书籍后边添加编辑和删除
  const columns = [...COLUMNS,
  {
    title: '操作', key: "action", render: (_: any, row: any) => {
      return <Space>
        <Button type="link" onClick={handleBookEdit}>编辑</Button>
        <Button type="link" danger>删除</Button>
      </Space>
    }
  }
  ]

  return (
    <Content
      title="图书列表"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/book/add")
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
            <Form.Item name="name" label="名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="author" label="作者" >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="category" label="分类" >
              <Select
                allowClear
                showSearch
                placeholder="请选择"
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                  { value: 'disabled', label: 'Disabled', disabled: true },
                ]}
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
