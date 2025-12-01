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
  Card,
  CardBody,
  Stack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiLock, FiShield } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";
import { put } from "@/app/_lib/client";

type UserPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
        position: "top-right",
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
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.text"
        color="white"
        py={{ base: 10, md: 14 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          w="30%"
          h="100%"
          bgGradient="linear(to-bl, brand.secondary, transparent)"
          opacity={0.2}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            <Badge
              bg="white"
              color="brand.text"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              <Icon as={FiShield} mr={1} />
              セキュリティ
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
              fontWeight="400"
              letterSpacing="-0.02em"
              mb={3}
              color="white"
            >
              パスワード変更
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.800">
              アカウントのセキュリティを保護するために、定期的なパスワード変更をお勧めします
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="50vh" py={12}>
        <Container maxW="600px">
          <Card
            bg="white"
            border="1px solid"
            borderColor="brand.paper"
            borderRadius="none"
            animation={`${fadeInUp} 0.6s ease-out 0.1s backwards`}
          >
            <CardBody p={{ base: 6, md: 10 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={8}>
                  <FormControl isInvalid={!!errors.currentPassword} isRequired>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      現在のパスワード
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="現在のパスワードを入力"
                        {...register("currentPassword", {
                          required: "入力必須です",
                        })}
                      />
                      <InputRightElement h="full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          color="brand.textMuted"
                          _hover={{ color: "brand.primary" }}
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
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      新しいパスワード
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="新しいパスワードを入力"
                        {...register("newPassword", {
                          required: "入力必須です",
                        })}
                      />
                      <InputRightElement h="full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          color="brand.textMuted"
                          _hover={{ color: "brand.primary" }}
                        >
                          {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
                  </FormControl>

                  <Box pt={4}>
                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      leftIcon={<Icon as={FiLock} />}
                      bg="brand.primary"
                      color="white"
                      isLoading={isSubmitting}
                      loadingText="変更中..."
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
                      パスワードを変更
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </>
  );
}
