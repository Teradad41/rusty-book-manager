"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import { post } from "@/app/_lib/client";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Box,
  Badge,
  Card,
  CardBody,
  Stack,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

type BookInput = {
  title: string;
  isbn: string;
  author: string;
  description: string;
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

export default function CreateBook() {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>();

  const onSubmit: SubmitHandler<BookInput> = async (values) => {
    const res = await post({
      destination: "/api/v1/books",
      token: accessToken,
      body: values,
    });

    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.primary"
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
          bgGradient="linear(to-bl, brand.accent, transparent)"
          opacity={0.15}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            {/* Back link */}
            <Flex
              as={NextLink}
              href="/"
              align="center"
              gap={2}
              color="whiteAlpha.700"
              fontSize="sm"
              mb={6}
              _hover={{ color: "white" }}
              transition="color 0.2s"
              w="fit-content"
            >
              <Icon as={FiArrowLeft} color="inherit" />
              <Text color="inherit">蔵書一覧に戻る</Text>
            </Flex>

            <Badge
              bg="white"
              color="brand.primary"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              新規登録
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
              新しい蔵書を登録する
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              あなたのコレクションに本を追加しましょう
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="50vh" py={12}>
        <Container maxW="700px">
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
                  <FormControl isInvalid={!!errors.isbn} isRequired>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      ISBN
                    </FormLabel>
                    <Input
                      size="lg"
                      placeholder="ISBN (ISBN-10またはISBN-13)"
                      fontFamily="mono"
                      {...register("isbn", {
                        required: "ISBNは必須です",
                        maxLength: {
                          value: 13,
                          message:
                            "ISBNは最大で13文字まで入力可能です（ハイフンなし）",
                        },
                      })}
                    />
                    <FormErrorMessage>{errors.isbn?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.title} isRequired>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      タイトル
                    </FormLabel>
                    <Input
                      size="lg"
                      placeholder="書籍タイトル"
                      {...register("title", { required: "タイトルは必須です" })}
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.author} isRequired>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      著者名
                    </FormLabel>
                    <Input
                      size="lg"
                      placeholder="著者名"
                      {...register("author", { required: "著者名は必須です" })}
                    />
                    <FormErrorMessage>{errors.author?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.description} isRequired>
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      書籍概要
                    </FormLabel>
                    <Textarea
                      size="lg"
                      placeholder="書籍の概要"
                      {...register("description", {
                        required: "書籍概要は必須です",
                        maxLength: {
                          value: 2048,
                          message: "書籍概要は最大で2048文字まで入力可能です",
                        },
                      })}
                      rows={6}
                    />
                    <FormErrorMessage>
                      {errors.description?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Box pt={4}>
                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      leftIcon={<Icon as={FiSave} />}
                      bg="brand.primary"
                      color="white"
                      isLoading={isSubmitting}
                      loadingText="登録中..."
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
                      蔵書を新規登録する
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
