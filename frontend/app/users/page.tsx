"use client";

import Header from "@/app/_components/Header";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Badge,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useCurrentUser, useUsers } from "@/app/_contexts/user";
import UserTable from "@/app/_components/UserTable";
import AddUserButton from "@/app/_components/AddUserButton";

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

export default function ListUser() {
  const { currentUser } = useCurrentUser();
  const { users } = useUsers();

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
          bgGradient="linear(to-bl, brand.secondary, transparent)"
          opacity={0.15}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            <Badge
              bg="white"
              color="brand.primary"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              管理画面
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
              ユーザー一覧
            </Heading>
            {users && (
              <Text fontSize="lg" color="whiteAlpha.900">
                全 {users.items.length} 名のユーザーが登録されています
              </Text>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="50vh" py={12}>
        <Container maxW="900px">
          {users && currentUser ? (
            <Stack spacing={6} animation={`${fadeInUp} 0.6s ease-out 0.1s backwards`}>
              {currentUser.role === "Admin" && <AddUserButton />}
              <UserTable users={users.items} currentUser={currentUser} />
            </Stack>
          ) : (
            <Box
              bg="white"
              p={10}
              border="1px solid"
              borderColor="brand.paper"
              textAlign="center"
            >
              <Text color="brand.textMuted">
                ユーザーの一覧を取得できませんでした
              </Text>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
