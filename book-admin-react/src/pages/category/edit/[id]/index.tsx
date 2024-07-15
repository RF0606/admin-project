import { getCategoryDetail } from "@/api/category";
import CategoryForm from "@/components/CategoryForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryEdit() {
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await getCategoryDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router]);


  return <CategoryForm title="分类编辑" editData={data}/>;
}
