"use client";

import React, { useEffect, useState } from "react";
import { getFaqList } from "../apis/faq";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "antd";
import ListSection from "@/components/common/ListSection";
import { useRouter } from "next/navigation";

function FaqPage() {
  const router = useRouter();
  const [totalData, setTotalData] = useState(0);
  const [nowPage, setNowPage] = useState(0);

  const { data: faqList, isSuccess } = useQuery(["faq", nowPage], () => {
    return getFaqList(nowPage);
  });

  const onChange = (page: number) => {
    setNowPage(page - 1);
  };

  useEffect(() => {
    if (isSuccess && faqList) {
      setTotalData(faqList.totalElements);
    }
  }, [isSuccess, faqList]);

  const createHandler = () => {
    router.push(`/faq/createFaq`);
  };
  if (!faqList) return;
  return (
    <div className="flex h-full flex-col">
      <ListSection noticeList={faqList.list} nowPage={nowPage} isNotice={false} />
      <div className="relative flex w-full justify-end px-4 py-4">
        <Pagination
          className="absolute left-1/2 top-1/2 mt-auto -translate-x-1/2 -translate-y-1/2 py-2 text-center"
          onChange={onChange}
          defaultCurrent={1}
          total={totalData}
        />
        <button
          onClick={createHandler}
          className="h-[40px] w-[100px] rounded-sm bg-[#425C6F] font-bold text-white hover:bg-primary-normal"
        >
          작성하기
        </button>
      </div>
    </div>
  );
}

export default FaqPage;
