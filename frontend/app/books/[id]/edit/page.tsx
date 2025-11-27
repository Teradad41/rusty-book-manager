"use client";

import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import Header from "@/app/_components/Header";
import { useBook } from "@/app/_contexts/book";
import { put } from "@/app/_lib/client";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  Box,
  Badge,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function EditBook({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const { book } = useBook(params.id);
  const [input, setInput] = useState(
    book ?? {
      title: "",
      isbn: "",
      author: "",
      description: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const onClickSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await put({
      destination: `/api/v1/books/${params.id}`,
      token: accessToken,
      body: input,
    });

    if (res.ok) {
      router.push(`/books/${params.id}`);
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
            <Badge colorScheme="blue" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              編集モード
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, blue.500, cyan.500)"
              bgClip="text"
            >
              蔵書を編集する
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
                <Stack spacing={6}>
                  <FormControl id="isbn" isRequired>
                    <FormLabel fontWeight="semibold">ISBN</FormLabel>
                    <Flex gap={2}>
                      <Input
                        id="isbn"
                        name="isbn"
                        size="lg"
                        borderRadius="lg"
                        value={input.isbn}
                        onChange={handleChange}
                        placeholder="ISBN10またはISBN13を入力"
                        focusBorderColor="blue.500"
                      />
                      <Button
                        leftIcon={<Icon as={FiRefreshCw} />}
                        colorScheme="gray"
                        variant="outline"
                        size="lg"
                        borderRadius="lg"
                      >
                        自動入力
                      </Button>
                    </Flex>
                  </FormControl>

                  <FormControl id="title" isRequired>
                    <FormLabel fontWeight="semibold">書籍タイトル</FormLabel>
                    <Input
                      id="title"
                      name="title"
                      size="lg"
                      borderRadius="lg"
                      value={input.title}
                      onChange={handleChange}
                      focusBorderColor="blue.500"
                    />
                  </FormControl>

                  <FormControl id="author" isRequired>
                    <FormLabel fontWeight="semibold">著者</FormLabel>
                    <Input
                      id="author"
                      name="author"
                      size="lg"
                      borderRadius="lg"
                      value={input.author}
                      onChange={handleChange}
                      focusBorderColor="blue.500"
                    />
                  </FormControl>

                  <FormControl id="description" isRequired>
                    <FormLabel fontWeight="semibold">書籍概要</FormLabel>
                    <Textarea
                      id="description"
                      name="description"
                      size="lg"
                      borderRadius="lg"
                      value={input.description}
                      onChange={handleChange}
                      placeholder="1024文字以内で入力してください"
                      rows={6}
                      focusBorderColor="blue.500"
                    />
                  </FormControl>

                  <Button
                    onClick={onClickSubmit}
                    size="lg"
                    leftIcon={<Icon as={FiSave} />}
                    bgGradient="linear(to-r, blue.500, cyan.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, cyan.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                    borderRadius="lg"
                  >
                    蔵書を更新する
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </Container>
        </Container>
      </Box>
    </>
  );
}
