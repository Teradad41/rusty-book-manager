"use client";

import {
  Card,
  Stack,
  CardBody,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  LinkBox,
  LinkOverlay,
  Tag,
  CardFooter,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiBook, FiUser, FiCheckCircle } from "react-icons/fi";
import Header from "./_components/Header";
import { FC } from "react";
import NextLink from "next/link";
import { Book } from "./_types/book";
import { useBooks } from "./_contexts/book";
import { NextPage } from "next";
import Pagination from "./_components/Pagination";

const BOOKS_PER_PAGE = 12;

const Home: NextPage = ({
  searchParams,
}: {
  searchParams?: {
    limit?: string;
    offset?: string;
  };
}) => {
  const currentLimit = Number(searchParams?.limit) || BOOKS_PER_PAGE;
  const currentOffset = Number(searchParams?.offset) || 0;

  const { books } = useBooks({ limit: currentLimit, offset: currentOffset });
  const limit = books?.limit ?? BOOKS_PER_PAGE;
  const offset = books?.offset ?? 0;
  const total = books?.total ?? 0;

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, gray.800)"
  );

  return (
    <>
      <Header></Header>
      <Box minH="100vh" bgGradient={bgGradient}>
        <Container maxW="container.xl" py={8}>
          <Box mb={8} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
            >
              蔵書コレクション
            </Heading>
            <Text fontSize="lg" color="gray.600">
              全 {total} 冊の書籍が登録されています
            </Text>
          </Box>

          <Pagination limit={limit} offset={offset} total={total} />

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
            spacing={6}
            my={8}
          >
            {books?.items.map((book) => (
              <BookCard key={book.id} data={book} />
            ))}
          </SimpleGrid>

          <Pagination limit={limit} offset={offset} total={total} />
        </Container>
      </Box>
    </>
  );
};

export default Home;

type BookTableProps = {
  data: Book;
};

const BookCard: FC<BookTableProps> = ({ data }: BookTableProps) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverShadow = useColorModeValue(
    "xl",
    "dark-lg"
  );
  const statusColorScheme = data.checkout ? "orange" : "green";

  return (
    <LinkBox
      as={Card}
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        shadow: hoverShadow,
        borderColor: data.checkout ? "orange.400" : "blue.400",
      }}
      cursor="pointer"
      h="full"
    >
      <Stack spacing={0} h="full">
        <Box
          bg={data.checkout ? "orange.50" : "blue.50"}
          py={4}
          px={6}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Flex align="center" gap={2} mb={2}>
            <Icon as={FiBook} color={data.checkout ? "orange.500" : "blue.500"} boxSize={5} />
            <Badge colorScheme={statusColorScheme} fontSize="xs" px={2} py={1} borderRadius="full">
              {data.checkout ? "貸出中" : "利用可能"}
            </Badge>
          </Flex>
        </Box>

        <CardBody flex="1">
          <Heading size="md" mb={3} noOfLines={2}>
            <LinkOverlay as={NextLink} href={`/books/${data.id}`}>
              {data.title}
            </LinkOverlay>
          </Heading>
          <Flex align="center" gap={2} color="gray.600">
            <Icon as={FiUser} boxSize={4} />
            <Text fontSize="sm" noOfLines={1}>
              {data.author}
            </Text>
          </Flex>
        </CardBody>

        {data.checkout && (
          <CardFooter pt={0} pb={4}>
            <Flex align="center" gap={2} w="full">
              <Icon as={FiCheckCircle} color="orange.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600" noOfLines={1}>
                {data.checkout?.checkedOutBy?.name} さんが借りています
              </Text>
            </Flex>
          </CardFooter>
        )}
      </Stack>
    </LinkBox>
  );
};
