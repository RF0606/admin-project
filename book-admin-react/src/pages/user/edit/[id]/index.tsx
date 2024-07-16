import { getUserDetail } from "@/api/user";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserEdit() {
  const router = useRouter();
  const id = router.query.id;
  const [data, setData] = useState();

  useEffect(()=>{
    (async () => {
      await getUserDetail(id as string).then((res) => {
        setData(res.data);
      });
    })();
  },[id]);

  return <UserForm title="用户编辑" editData={data}/>;
}