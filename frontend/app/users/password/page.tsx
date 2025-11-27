"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Box,
  Badge,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";
import { put } from "@/app/_lib/client";

type UserPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export default function UpdateUserPassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UserPasswordInput>();

  const onSubmit: SubmitHandler<UserPasswordInput> = async (values) => {
    const res = await put({
      destination: "/api/v1/users/me/password",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      toast({
        title: "パスワードを変更しました",
        description: "新しいパスワードへの変更が完了しました",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/");
    } else {
      toast({
        title: "パスワードを変更できません",
        description:
          "パスワードの変更に失敗しました。現在のパスワードを確認するか、管理者に連絡してください。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <>
      <Header></Header>
      <Box minH="100vh" bgGradient={bgGradient}>
        <Container maxW="container.xl" py={8}>
          <Box mb={8} textAlign="center">
            <Badge colorScheme="red" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              セキュリティ
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, red.500, pink.500)"
              bgClip="text"
            >
              パスワード変更
            </Heading>
          </Box>

          <Container maxW="container.md">
            <Card
              bg={cardBg}
              borderColor={borderColor}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              shadow="lg"
            >
              <CardBody p={8}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={6}>
                    <FormControl isInvalid={!!errors.currentPassword} isRequired>
                      <FormLabel htmlFor="currentPassword" fontWeight="semibold">
                        現在のパスワード
                      </FormLabel>
                      <InputGroup size="lg">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          borderRadius="lg"
                          placeholder="現在のパスワードを入力してください"
                          focusBorderColor="blue.500"
                          {...register("currentPassword", {
                            required: "入力必須です",
                          })}
                        />
                        <InputRightElement h="full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowCurrentPassword(
                                (showCurrentPassword) => !showCurrentPassword
                              )
                            }
                          >
                            {showCurrentPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.currentPassword?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.newPassword} isRequired>
                      <FormLabel htmlFor="newPassword" fontWeight="semibold">
                        新しいパスワード
                      </FormLabel>
                      <InputGroup size="lg">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          borderRadius="lg"
                          placeholder="新しいパスワードを入力してください"
                          focusBorderColor="blue.500"
                          {...register("newPassword", {
                            required: "入力必須です",
                          })}
                        />
                        <InputRightElement h="full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowNewPassword((showNewPassword) => !showNewPassword)
                            }
                          >
                            {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      leftIcon={<Icon as={FiLock} />}
                      bgGradient="linear(to-r, red.500, pink.500)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, red.600, pink.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.2s"
                      isLoading={isSubmitting}
                      loadingText="変更中..."
                      borderRadius="lg"
                    >
                      パスワードを変更
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          </Container>
        </Container>
      </Box>
    </>
  );
}
