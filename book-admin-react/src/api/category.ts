import request from "@/utils/request";
import qs from 'qs'

import { CategoryQueryType, CategoryType } from "../type";

// api的地址写道next.config里面了

// 获取category列表
export async function getCategoryList(params?: CategoryQueryType) {
    const res = request.get(`/api/categories?${qs.stringify(params)}`);
    return res;
}

//创建category
export async function categoryAdd(params: CategoryType) {
    return request.post("/api/categories", params);
}

// 更新category
export const categoryUpdate = (id: string, params: CategoryType) => {
    return request.put(`/api/categories/${id}`, params);
};

// 获取详情
export const getCategoryDetail = (id: string) => {
    return request.get(`/api/categories/${id}`);
};


// 删除category
export async function categoryDelete(id:string){
    return request.delete(`/api/categories/${id}`);
}