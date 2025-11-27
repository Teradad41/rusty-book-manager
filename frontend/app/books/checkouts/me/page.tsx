"use client";

import BookTable from "@/app/_components/BookTable";
import Header from "@/app/_components/Header";
import ReturnButton from "@/app/_components/ReturnButton";
import { useMyCheckouts } from "@/app/_contexts/checkout";
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
  const { checkouts } = useMyCheckouts();

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
            <Badge colorScheme="purple" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              マイページ
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, purple.500, pink.500)"
              bgClip="text"
            >
              借りている蔵書
            </Heading>
            {checkouts && checkouts.length > 0 && (
              <Text fontSize="lg" color="gray.600">
                現在 {checkouts.length} 冊を借りています
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
                      appendButton={<ReturnButton checkout={co} />}
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
                現在借りている蔵書はありません
              </Text>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
