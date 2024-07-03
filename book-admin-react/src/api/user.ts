import request from "@/utils/request";
import qs from "qs";

import { UserQueryType, UserType } from "../type";

export async function getUserList(params?: UserQueryType) {
  return request.get(`/api/users?${qs.stringify(params)}`);
}

export async function userAdd(params: UserType) {
  return request.post("/api/users", params);
}

export async function userDelete(id: string) {
  return request.delete(`/api/users/${id}`);
}

//最新的mock api不用传id进去了； `/api/users/${params._id}`
export async function userUpdate(params: UserType) {
  return request.put("/api/users", params);
}

//详细信息
export async function getUserDetail(id: string) {
  return request.get(`/api/users/${id}`);
}

//登录
export async function login(params: Pick<UserType, "name" | "password">) {
  return request.post("/api/login", params);
}

//登出
export async function logout() {
  return request.get("/api/logout");
}