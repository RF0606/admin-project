export const ITEMS = [
    {
        label: "图书管理",
        key: "book",
        children: [
            { label: "图书列表", key: "/book" },
            { label: "图书添加", key: "/book/add" },
        ],
    },
    {
        label: "借阅管理",
        key: "borrow",
        children: [
            { label: "借阅列表", key: "/borrow" },
            { label: "借阅添加", key: "/borrow/add" },
        ],
    },
    {
        label: "分类管理",
        key: "category",
        children: [
            { label: "分类列表", key: "/category" },
            { label: "分类添加", key: "/category/add" },
        ],
    },
    {
        label: "用户管理",
        key: "user",
        children: [
            { label: "用户列表", key: "/user" },
            { label: "用户添加", key: "/user/add" },
        ],
    },
];
