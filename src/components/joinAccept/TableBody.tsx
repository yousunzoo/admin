import { IJoinListData } from "@/types/joinAccept";
import ModalLayout from "../common/ModalLayout";
import { MouseEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccpetJoinPB } from "@/app/apis/joinAccept";
import ButtonModal from "../common/ButtonModal";
import Image from "next/image";

const TH_STYLE = "rounded-[1px] h-[52px] border-r-1 border-[#E0E0E0] font-normal py-1 px-2";

function TableBody({ item, index, page }: { item: IJoinListData; index: number; page: number }) {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    content: "",
    confirmText: "",
    cancelText: "",
    confirmFn: () => void 0,
    cancelFn: () => void 0,
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation(AccpetJoinPB, {
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries(["joinList"]);
    },
    onError: () => {},
  });

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const buttonEl = e.target as HTMLButtonElement;
    const accept = buttonEl.id === "Accept";

    setModalContent({
      content: `${buttonEl.innerText} 하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      confirmFn: () => {
        mutate({ approve: accept, id: item.id.toString() });
      },
      cancelFn: () => {
        setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <tbody className="h-[52px] border-t-1 border-[#E0E0E0] text-center">
        <tr>
          <td className={`${TH_STYLE} w-[52px] border-l-1`}>{page * 10 + index}</td>
          <td className={`${TH_STYLE} w-[200px]`}>{item.email}</td>
          <td className={`${TH_STYLE} w-[90px]`}>{item.name}</td>
          <td className={`${TH_STYLE} w-[170px]`}>{item.phoneNumber.replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3")}</td>
          <td className={`${TH_STYLE} w-[240px]`}>{item.branchName}</td>
          <td className={`${TH_STYLE} w-[120px]`}>
            <button
              onClick={() => setIsCardOpen(true)}
              className="h-full w-full rounded-[8px] bg-[#2A4457] text-sm text-white"
            >
              명함 확인
            </button>
          </td>
          <td onClick={handleClick} className={`${TH_STYLE} grid w-[212px] grid-cols-2 gap-2 px-2 text-sm text-white`}>
            <button id="Accept" className="rounded-[8px] bg-[#27508C]">
              승인
            </button>
            <button id="Reject" className="rounded-[8px] bg-[#642626]">
              거절
            </button>
          </td>
        </tr>
      </tbody>
      {isCardOpen && (
        <ModalLayout handleCloseModal={() => setIsCardOpen(false)}>
          <Image src={item.businessCard} alt="businessCard" width={800} height={800} />
        </ModalLayout>
      )}
      {isModalOpen && <ButtonModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} modalContents={modalContent} />}
    </>
  );
}

export default TableBody;
