import { getBorrowDetail } from "@/api/borrow";
import BorrowForm from "@/components/BorrowForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrowEdit() {
  const router = useRouter();
  const [data, setData] = useState();
  
  useEffect(() => {
    if (router.query.id) {
      const borrowId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
      getBorrowDetail(borrowId).then((res) => {
        setData(res.data);
      });
    }
  }, [router.query.id]);

  return <BorrowForm title="借阅编辑" editData={data} />;
}
