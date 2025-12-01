"use client";

import { FC, useRef } from "react";
import { ACCESS_TOKEN_KEY } from "./auth";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useLocalStorageState from "use-local-storage-state";
import { User } from "../_types/user";
import { del } from "../_lib/client";
import { useSWRConfig } from "swr";

type DeleteUserButtonProps = {
  user: User;
};

const DeleteUserButton: FC<DeleteUserButtonProps> = ({
  user,
}: DeleteUserButtonProps) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { isOpen, onOpen, onClose } = useDisclosure({ id: "delete-user" });
  const toast = useToast();
  const cancelRef = useRef(null);
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    const res = await del({
      destination: `/api/v1/users/${user.id}`,
      token: accessToken,
    });

    if (res.ok) {
      toast({
        title: "ユーザーを削除しました",
        description: `ユーザー「${user.name}」を削除しました`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
      mutate(["/api/v1/users", accessToken]);
    } else {
      toast({
        title: "ユーザーを削除できませんでした",
        description: "サーバーからエラー応答が返却されました。",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="ユーザーを削除"
        icon={<DeleteIcon />}
        onClick={onOpen}
        variant="ghost"
        size="sm"
        color="brand.textMuted"
        _hover={{
          bg: "red.50",
          color: "red.500",
        }}
        transition="all 0.2s"
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay bg="blackAlpha.600">
          <AlertDialogContent borderRadius="none" mx={4}>
            <AlertDialogHeader
              fontFamily="heading"
              fontWeight="400"
              fontSize="2xl"
              pt={8}
              pb={2}
            >
              ユーザーの削除
            </AlertDialogHeader>
            <AlertDialogBody color="brand.textMuted" pb={6}>
              ユーザー「{user.name}」を削除しますか？
              <br />
              この操作は取り消せません。
            </AlertDialogBody>
            <AlertDialogFooter pb={8}>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="ghost"
              >
                キャンセル
              </Button>
              <Button
                bg="brand.secondary"
                color="white"
                onClick={handleDelete}
                ml={3}
                _hover={{
                  bg: "brand.secondaryDark",
                }}
              >
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteUserButton;
