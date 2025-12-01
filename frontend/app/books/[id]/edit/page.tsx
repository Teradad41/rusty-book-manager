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
  Card,
  CardBody,
  Icon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

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

export default function EditBook({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const { book } = useBook(params.id);
  const [input, setInput] = useState({
    title: "",
    isbn: "",
    author: "",
    description: "",
  });

  useEffect(() => {
    if (book) {
      setInput({
        title: book.title || "",
        isbn: book.isbn || "",
        author: book.author || "",
        description: book.description || "",
      });
    }
  }, [book]);

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

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.accent"
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
          bgGradient="linear(to-bl, brand.primary, transparent)"
          opacity={0.2}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            {/* Back link */}
            <Flex
              as={NextLink}
              href={`/books/${params.id}`}
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
              <Text color="inherit">書籍詳細に戻る</Text>
            </Flex>

            <Badge
              bg="white"
              color="brand.accent"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              編集モード
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
              蔵書を編集する
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              {book?.title}
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
              <Stack spacing={8}>
                <FormControl id="isbn" isRequired>
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
                    name="isbn"
                    size="lg"
                    value={input.isbn}
                    onChange={handleChange}
                    placeholder="ISBN10またはISBN13を入力"
                    fontFamily="mono"
                  />
                </FormControl>

                <FormControl id="title" isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                  >
                    書籍タイトル
                  </FormLabel>
                  <Input
                    name="title"
                    size="lg"
                    value={input.title}
                    onChange={handleChange}
                    placeholder="書籍タイトル"
                  />
                </FormControl>

                <FormControl id="author" isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                  >
                    著者
                  </FormLabel>
                  <Input
                    name="author"
                    size="lg"
                    value={input.author}
                    onChange={handleChange}
                    placeholder="著者名"
                  />
                </FormControl>

                <FormControl id="description" isRequired>
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
                    name="description"
                    size="lg"
                    value={input.description}
                    onChange={handleChange}
                    placeholder="1024文字以内で入力してください"
                    rows={6}
                  />
                </FormControl>

                <Box pt={4}>
                  <Button
                    onClick={onClickSubmit}
                    size="lg"
                    w="full"
                    leftIcon={<Icon as={FiSave} />}
                    bg="brand.primary"
                    color="white"
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
                    蔵書を更新する
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </>
  );
}
