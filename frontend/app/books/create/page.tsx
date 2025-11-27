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
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

type BookInput = {
  title: string;
  isbn: string;
  author: string;
  description: string;
};

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
            <Badge colorScheme="green" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              新規登録
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, green.500, teal.500)"
              bgClip="text"
            >
              新しい蔵書を登録する
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
                    <FormControl isInvalid={!!errors.isbn} isRequired>
                      <FormLabel htmlFor="isbn" fontWeight="semibold">
                        ISBN
                      </FormLabel>
                      <Input
                        id="isbn"
                        size="lg"
                        borderRadius="lg"
                        placeholder="ISBN (ISBN-10またはISBN-13)"
                        focusBorderColor="blue.500"
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
                      <FormLabel htmlFor="title" fontWeight="semibold">
                        タイトル
                      </FormLabel>
                      <Input
                        id="title"
                        size="lg"
                        borderRadius="lg"
                        placeholder="書籍タイトル"
                        focusBorderColor="blue.500"
                        {...register("title", { required: "タイトルは必須です" })}
                      />
                      <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.author} isRequired>
                      <FormLabel htmlFor="author" fontWeight="semibold">
                        著者名
                      </FormLabel>
                      <Input
                        id="author"
                        size="lg"
                        borderRadius="lg"
                        placeholder="著者名"
                        focusBorderColor="blue.500"
                        {...register("author", { required: "著者名は必須です" })}
                      />
                      <FormErrorMessage>{errors.author?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.description} isRequired>
                      <FormLabel htmlFor="description" fontWeight="semibold">
                        書籍概要
                      </FormLabel>
                      <Textarea
                        id="description"
                        size="lg"
                        borderRadius="lg"
                        placeholder="書籍の概要"
                        focusBorderColor="blue.500"
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

                    <Button
                      type="submit"
                      size="lg"
                      leftIcon={<Icon as={FiSave} />}
                      bgGradient="linear(to-r, green.500, teal.500)"
                      color="white"
                      _hover={{
                        bgGradient: "linear(to-r, green.600, teal.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.2s"
                      isLoading={isSubmitting}
                      loadingText="登録中..."
                      borderRadius="lg"
                    >
                      蔵書を新規登録する
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
