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
  SimpleGrid,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

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

export default function CheckedOutBookList() {
  const { checkouts } = useCheckouts();
  const { currentUser } = useCurrentUser();

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.secondary"
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
          opacity={0.2}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            <Badge
              bg="white"
              color="brand.secondary"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              貸出管理
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
              全体の貸出状況
            </Heading>
            {checkouts && checkouts.length > 0 && (
              <Text fontSize="lg" color="whiteAlpha.900">
                現在 {checkouts.length} 冊が全体で貸し出されています
              </Text>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="50vh" py={12}>
        <Container maxW="1400px">
          {checkouts && checkouts?.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {checkouts?.map((co, index) => (
                <Box
                  key={co.id}
                  animation={`${fadeInUp} 0.5s ease-out ${index * 0.05}s backwards`}
                >
                  <BookTable
                    data={co.book}
                    appendButton={
                      currentUser?.id === co.checkedOutBy.id ? (
                        <ReturnButton checkout={co} />
                      ) : undefined
                    }
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box
              bg="white"
              p={12}
              border="1px solid"
              borderColor="brand.paper"
              textAlign="center"
              animation={`${fadeInUp} 0.6s ease-out`}
            >
              <Text color="brand.textMuted" fontSize="lg">
                現在全体で貸出中の蔵書はありません
              </Text>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
