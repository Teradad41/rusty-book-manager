"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import { Book } from "../_types/book";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import { post, put } from "../_lib/client";
import { useCurrentUser } from "../_contexts/user";
import { Button, Icon } from "@chakra-ui/react";
import { useSWRConfig } from "swr";
import { FC } from "react";
import { FiBookOpen, FiCornerUpLeft, FiClock } from "react-icons/fi";

export type CheckoutButtonProps = {
  book: Book;
};

const CheckoutButton: FC<CheckoutButtonProps> = ({
  book,
}: CheckoutButtonProps) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { mutate } = useSWRConfig();

  const onClickCheckoutSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await post({
      destination: `/api/v1/books/${book.id}/checkouts`,
      token: accessToken,
    });

    if (res.ok) {
      mutate([`/api/v1/books/${book.id}`, accessToken]);
      mutate([`/api/v1/books/${book.id}/checkout-history`, accessToken]);
      router.refresh();
    }
  };

  const onClickReturningSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await put({
      destination: `/api/v1/books/${book.id}/checkouts/${book.checkout?.id}/returned`,
      token: accessToken,
    });

    if (res.ok) {
      mutate([`/api/v1/books/${book.id}`, accessToken]);
      mutate([`/api/v1/books/${book.id}/checkout-history`, accessToken]);
      router.refresh();
    }
  };

  return !book.checkout ? (
    <Button
      w="full"
      size="lg"
      bg="brand.primary"
      color="white"
      leftIcon={<Icon as={FiBookOpen} />}
      onClick={onClickCheckoutSubmit}
      _hover={{
        bg: "brand.primaryLight",
        transform: "translateY(-2px)",
        boxShadow: "0 10px 30px rgba(28, 69, 50, 0.3)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      py={7}
    >
      この書籍を借りる
    </Button>
  ) : book.checkout?.checkedOutBy.id === currentUser?.id ? (
    <Button
      w="full"
      size="lg"
      bg="brand.accent"
      color="white"
      leftIcon={<Icon as={FiCornerUpLeft} />}
      onClick={onClickReturningSubmit}
      _hover={{
        bg: "brand.accentLight",
        transform: "translateY(-2px)",
        boxShadow: "0 10px 30px rgba(182, 141, 64, 0.3)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      py={7}
    >
      この書籍を返却する
    </Button>
  ) : (
    <Button
      w="full"
      size="lg"
      isDisabled
      bg="brand.paper"
      color="brand.textMuted"
      leftIcon={<Icon as={FiClock} />}
      py={7}
      cursor="not-allowed"
    >
      {`${book.checkout?.checkedOutBy.name}さんが貸出中`}
    </Button>
  );
};

export default CheckoutButton;
