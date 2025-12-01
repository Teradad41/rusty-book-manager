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
  LinkBox,
  LinkOverlay,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiUser, FiClock } from "react-icons/fi";
import Header from "./_components/Header";
import { FC } from "react";
import NextLink from "next/link";
import { Book } from "./_types/book";
import { useBooks } from "./_contexts/book";
import { NextPage } from "next";
import Pagination from "./_components/Pagination";

const BOOKS_PER_PAGE = 12;

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

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.primary"
        color="white"
        py={{ base: 12, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="0"
          right="0"
          w="40%"
          h="100%"
          bgGradient="linear(to-bl, brand.accent, transparent)"
          opacity={0.15}
        />
        <Box
          position="absolute"
          bottom="-50%"
          left="-10%"
          w="40%"
          h="100%"
          bg="brand.primaryLight"
          borderRadius="50%"
          opacity={0.3}
        />

        <Container maxW="1400px" position="relative">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={8}
          >
            <Box animation={`${fadeInUp} 0.6s ease-out`}>
              <Text
                fontSize="xs"
                letterSpacing="0.3em"
                textTransform="uppercase"
                color="brand.accentLight"
                fontWeight="600"
                mb={3}
              >
                Library Collection
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontFamily="heading"
                fontWeight="400"
                letterSpacing="-0.02em"
                lineHeight="1.1"
                mb={4}
                color="white"
              >
                蔵書コレクション
              </Heading>
              <Text
                fontSize="lg"
                color="whiteAlpha.900"
                maxW="500px"
                lineHeight="1.8"
              >
                知識の海へようこそ。あなたの探している一冊がここにあります。
              </Text>
            </Box>

            <Box
              bg="white"
              color="brand.text"
              px={8}
              py={6}
              textAlign="center"
              minW="200px"
              animation={`${fadeInUp} 0.6s ease-out 0.2s backwards`}
            >
              <Text
                fontSize="5xl"
                fontFamily="heading"
                fontWeight="400"
                color="brand.primary"
                lineHeight="1"
              >
                {total}
              </Text>
              <Text
                fontSize="xs"
                letterSpacing="0.2em"
                textTransform="uppercase"
                color="brand.textMuted"
                fontWeight="600"
                mt={1}
              >
                Books Available
              </Text>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="60vh" py={12}>
        <Container maxW="1400px">
          <Pagination limit={limit} offset={offset} total={total} />

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={6}
            my={10}
          >
            {books?.items.map((book, index) => (
              <Box
                key={book.id}
                animation={`${fadeInUp} 0.5s ease-out ${index * 0.05}s backwards`}
              >
                <BookCard data={book} />
              </Box>
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
  const isCheckedOut = !!data.checkout;

  return (
    <LinkBox
      as={Card}
      bg="white"
      border="1px solid"
      borderColor="brand.paper"
      borderRadius="none"
      overflow="hidden"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        "& .book-spine": {
          width: "8px",
          bg: isCheckedOut ? "brand.secondary" : "brand.primary",
        },
        "& .book-title": {
          color: "brand.primary",
        },
      }}
      cursor="pointer"
      h="full"
      position="relative"
    >
      {/* Book spine effect */}
      <Box
        className="book-spine"
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        width="4px"
        bg={isCheckedOut ? "brand.secondaryLight" : "brand.primaryLight"}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      />

      <Stack spacing={0} h="full">
        {/* Status Badge */}
        <Box px={6} pt={5} pb={3}>
          <Badge
            bg={isCheckedOut ? "brand.secondary" : "brand.primary"}
            color="white"
            fontSize="2xs"
            px={3}
            py={1}
          >
            {isCheckedOut ? "貸出中" : "利用可能"}
          </Badge>
        </Box>

        <CardBody pt={2} pb={6} px={6} flex="1" display="flex" flexDirection="column">
          <Heading
            className="book-title"
            size="md"
            mb={4}
            noOfLines={2}
            fontFamily="heading"
            fontWeight="400"
            fontSize="xl"
            lineHeight="1.4"
            transition="color 0.3s"
          >
            <LinkOverlay as={NextLink} href={`/books/${data.id}`}>
              {data.title}
            </LinkOverlay>
          </Heading>

          <Box flex="1" />

          <Box
            pt={4}
            borderTop="1px solid"
            borderColor="brand.paper"
          >
            <Flex align="center" gap={2} color="brand.textMuted">
              <Icon as={FiUser} boxSize={3} />
              <Text fontSize="sm" noOfLines={1}>
                {data.author}
              </Text>
            </Flex>
          </Box>

          {isCheckedOut && (
            <Flex
              align="center"
              gap={2}
              mt={3}
              color="brand.secondary"
              fontSize="xs"
            >
              <Icon as={FiClock} boxSize={3} />
              <Text noOfLines={1}>
                {data.checkout?.checkedOutBy?.name} が借りています
              </Text>
            </Flex>
          )}
        </CardBody>
      </Stack>
    </LinkBox>
  );
};
