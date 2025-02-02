import { getBookDetail } from "@/api/book";
import BookForm from "@/components/BookForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BookEdit() {
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getBookDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router]);

  return <BookForm title="图书编辑" editData = {data}/>;
}
