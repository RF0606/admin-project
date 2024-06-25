import request from "@/utils/request";
import qs from 'qs'

import { BookQueryType, BookType } from "./../type";

// 获取图书list，用来从后端获取book的数据，需要传参的数据类型 定义为BookQueryType
export async function getBookList(params?: BookQueryType) {
    const res = request.get(`/api/books?${qs.stringify(params)}`); //重写了restful的那几个方法
    //返回的res是promise类型的，包括data,success,total,object
    return res;
}

//添加图书
export async function bookAdd(params: BookType) {
    return request.post("/api/books", params);
  }