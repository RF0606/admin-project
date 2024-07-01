import { BorrowQueryType, BorrowType } from "@/type";
import request from "@/utils/request";
import qs from "qs";

export async function getBorrowList(params?: BorrowQueryType) {
    return request.get(`/api/borrows?${qs.stringify(params)}`);
}

export async function borrowAdd(params: BorrowType) {
    return request.post("/api/borrows", params);
}

export async function borrowDelete(id: string) {
    return request.delete(`/api/borrows/${id}`);
}