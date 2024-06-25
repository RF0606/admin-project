import { BookQueryType } from "@/type/book";
import request from "@/utils/request";
import axios from "axios";
import qs from 'qs'
// 写了一个方法，用来从后端获取book的数据，需要传参的数据类型 定义为BookQueryType
export async function getBookList(params?: BookQueryType) {
    const res = request.get(`/api/books?${qs.stringify(params)}`); //重写了restful的那几个方法
    //返回的res是promise类型的，包括data,success,total,object
    return res;
}