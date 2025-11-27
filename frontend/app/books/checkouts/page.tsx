"use client";

import BookTable from "@/app/_components/BookTable";
import Header from "@/app/_components/Header";
import ReturnButton from "@/app/_components/ReturnButton";
import { useCheckouts } from "@/app/_contexts/checkout";
import { useCurrentUser } from "@/app/_contexts/user";
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

export default function CheckedOutBookList() {
  const { checkouts } = useCheckouts();
  const { currentUser } = useCurrentUser();

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const emptyStateBg = useColorModeValue("white", "gray.700");

  return (
    <>
      <Header></Header>
      <Box minH="100vh" bgGradient={bgGradient}>
        <Container maxW="container.xl" py={8}>
          <Box mb={8} textAlign="center">
            <Badge colorScheme="orange" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              貸出管理
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, orange.500, red.500)"
              bgClip="text"
            >
              貸出中の蔵書
            </Heading>
            {checkouts && checkouts.length > 0 && (
              <Text fontSize="lg" color="gray.600">
                現在 {checkouts.length} 冊が貸し出されています
              </Text>
            )}
          </Box>

          {checkouts && checkouts?.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {checkouts?.map((co) => {
                return (
                  <Box key={co.id}>
                    <BookTable
                      key={co.book.id}
                      data={co.book}
                      appendButton={
                        currentUser?.id === co.checkedOutBy.id ? (
                          <ReturnButton checkout={co} />
                        ) : undefined
                      }
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          ) : (
            <Box
              bg={emptyStateBg}
              p={8}
              borderRadius="xl"
              textAlign="center"
              shadow="lg"
            >
              <Text color="gray.500" fontSize="lg">
                現在貸出中の蔵書はありません
              </Text>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
