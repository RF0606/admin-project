import request from "@/utils/request";
import qs from "qs";

import { UserQueryType, UserType } from "../type";

export async function getUserList(params?: UserQueryType) {
  return request.get(`/api/users?${qs.stringify(params)}`);
}

// 添加
export async function userAdd(params: UserType) {
  return request.post("/api/users", params);
}

// 删除
export async function userDelete(id: string) {
  return request.delete(`/api/users/${id}`);
}

// 更新
export async function userUpdate(id: string, params: UserType) {
  return request.put(`/api/users/${id}`, params);
}

// 详细信息
export async function getUserDetail(id: string) {
  return request.get(`/api/users/${id}`);
}

// 登录
export async function login(params: Pick<UserType, "name" | "password">) {
  return request.post("/api/login", params);
}

// 登出
export async function logout() {
  return request.get("/api/logout");
}