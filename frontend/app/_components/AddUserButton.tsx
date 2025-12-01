"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import React, { FC, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex,
  useToast,
  FormErrorMessage,
  Stack,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FiUserPlus } from "react-icons/fi";
import useLocalStorageState from "use-local-storage-state";
import { SubmitHandler, useForm } from "react-hook-form";
import { post } from "../_lib/client";
import { useSWRConfig } from "swr";

type UserInput = {
  name: string;
  email: string;
  password: string;
};

const AddUserButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (values) => {
    const res = await post({
      destination: "/api/v1/users",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      setUserInput(values);
      reset();
      onClose();
      setIsSuccessModalOpen(true);
      mutate(["/api/v1/users", accessToken]);
    } else {
      toast({
        title: "ユーザーを作成できませんでした",
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
      <Flex justifyContent="flex-end">
        <Button
          leftIcon={<Icon as={FiUserPlus} />}
          bg="brand.primary"
          color="white"
          onClick={onOpen}
          _hover={{
            bg: "brand.primaryLight",
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s"
        >
          ユーザーを追加
        </Button>
      </Flex>

      {/* ユーザー追加モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="none" mx={4}>
          <ModalHeader
            fontFamily="heading"
            fontWeight="400"
            fontSize="2xl"
            pt={8}
            pb={2}
          >
            新しいユーザーを追加
          </ModalHeader>
          <ModalCloseButton top={6} right={6} />
          <ModalBody pb={8}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6}>
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                  >
                    ユーザー名
                  </FormLabel>
                  <Input
                    size="lg"
                    placeholder="ユーザー名"
                    {...register("name", {
                      required: "ユーザー名は必須です",
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email} isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                  >
                    メールアドレス
                  </FormLabel>
                  <Input
                    size="lg"
                    placeholder="email@example.com"
                    {...register("email", {
                      required: "Eメールアドレスは必須です",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Eメールアドレス形式で入力してください",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password} isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                  >
                    パスワード
                  </FormLabel>
                  <Input
                    size="lg"
                    type="password"
                    placeholder="パスワード"
                    {...register("password", { required: "パスワードは必須です" })}
                  />
                  <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <Flex gap={3} pt={4}>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    flex={1}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    bg="brand.primary"
                    color="white"
                    flex={1}
                    _hover={{
                      bg: "brand.primaryLight",
                    }}
                  >
                    作成する
                  </Button>
                </Flex>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 成功メッセージモーダル */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        size="md"
      >
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="none" mx={4}>
          <ModalHeader
            fontFamily="heading"
            fontWeight="400"
            fontSize="2xl"
            pt={8}
            pb={2}
          >
            ユーザーを作成しました
          </ModalHeader>
          <ModalCloseButton top={6} right={6} />
          <ModalBody pb={4}>
            <Box
              bg="brand.cream"
              p={6}
            >
              <Stack spacing={3}>
                <Box>
                  <Text
                    fontSize="xs"
                    color="brand.textMuted"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    mb={1}
                  >
                    ユーザー名
                  </Text>
                  <Text fontWeight="600">{userInput?.name}</Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    color="brand.textMuted"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    mb={1}
                  >
                    メールアドレス
                  </Text>
                  <Text fontWeight="600">{userInput?.email}</Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    color="brand.textMuted"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    mb={1}
                  >
                    パスワード
                  </Text>
                  <Text fontFamily="mono" fontWeight="600">{userInput?.password}</Text>
                </Box>
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter pb={8}>
            <Button
              w="full"
              bg="brand.primary"
              color="white"
              onClick={() => {
                setUserInput(null);
                setIsSuccessModalOpen(false);
              }}
              _hover={{
                bg: "brand.primaryLight",
              }}
            >
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserButton;
