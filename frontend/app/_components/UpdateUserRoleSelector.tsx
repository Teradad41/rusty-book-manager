"use client";

import { Select, useToast } from "@chakra-ui/react";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "./auth";
import { User } from "../_types/user";
import { useSWRConfig } from "swr";
import { put } from "../_lib/client";
import { FC } from "react";

type UpdateUserRoleSelectorProps = {
  user: User;
  isCurrentUser: boolean;
};

const UpdateUserRoleSelector: FC<UpdateUserRoleSelectorProps> = ({
  user,
  isCurrentUser,
}: UpdateUserRoleSelectorProps) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const handleUpdateRole = async (role: string) => {
    const res = await put({
      destination: `/api/v1/users/${user.id}/role`,
      token: accessToken,
      body: { role: role },
    });

    if (res.ok) {
      toast({
        title: "ユーザーのロールを更新しました",
        description: `${user.name}のロールを${role}に変更しました`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      mutate(["/api/v1/users", accessToken]);
    } else {
      toast({
        title: "ユーザーのロールを更新できませんでした",
        description: "サーバーからエラー応答が返却されました。",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Select
      disabled={isCurrentUser}
      defaultValue={user.role}
      onChange={(e) => {
        handleUpdateRole(e.target.value);
      }}
      size="sm"
      borderRadius="none"
      borderColor="brand.paper"
      borderWidth="2px"
      bg="white"
      _hover={{
        borderColor: isCurrentUser ? "brand.paper" : "brand.textLight",
      }}
      _focus={{
        borderColor: "brand.primary",
        boxShadow: "none",
      }}
      _disabled={{
        opacity: 0.6,
        cursor: "not-allowed",
      }}
      fontWeight="500"
      fontSize="sm"
    >
      {["Admin", "User"].map((r) => (
        <option
          key={`${user.id}-${r}`}
          value={r}
          label={r}
        />
      ))}
    </Select>
  );
};

export default UpdateUserRoleSelector;
