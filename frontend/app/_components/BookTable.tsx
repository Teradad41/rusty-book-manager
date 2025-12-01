"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Flex,
  Icon,
  Box,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import NextLink from "next/link";
import { FC } from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
};

type BookTableProps = {
  data: Book;
  appendButton?: React.ReactNode;
};

const BookTable: FC<BookTableProps> = ({ data, appendButton }) => {
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
        transform: "translateY(-6px)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        "& .book-spine": {
          width: "6px",
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
        width="3px"
        bg="brand.primary"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      />

      <Stack spacing={0} h="full">
        <CardBody py={5} px={6}>
          <Heading
            className="book-title"
            size="md"
            mb={3}
            noOfLines={2}
            fontFamily="heading"
            fontWeight="400"
            fontSize="lg"
            lineHeight="1.4"
            transition="color 0.3s"
          >
            <LinkOverlay as={NextLink} href={`/books/${data.id}`}>
              {data.title}
            </LinkOverlay>
          </Heading>

          <Flex
            align="center"
            gap={2}
            color="brand.textMuted"
            pt={3}
            borderTop="1px solid"
            borderColor="brand.paper"
          >
            <Icon as={FiUser} boxSize={3} />
            <Text fontSize="sm" noOfLines={1}>
              {data.author}
            </Text>
          </Flex>
        </CardBody>

        {appendButton && (
          <CardFooter
            pt={0}
            pb={5}
            px={6}
            borderTop="1px solid"
            borderColor="brand.paper"
          >
            <Box w="full">{appendButton}</Box>
          </CardFooter>
        )}
      </Stack>
    </LinkBox>
  );
};

export default BookTable;
