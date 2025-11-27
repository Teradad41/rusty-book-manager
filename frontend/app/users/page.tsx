"use client";

import Header from "@/app/_components/Header";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCurrentUser, useUsers } from "@/app/_contexts/user";
import UserTable from "@/app/_components/UserTable";
import AddUserButton from "@/app/_components/AddUserButton";

export default function ListUser() {
  const { currentUser } = useCurrentUser();
  const { users } = useUsers();

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
            <Badge colorScheme="purple" fontSize="sm" mb={2} px={3} py={1} borderRadius="full">
              管理画面
            </Badge>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
            >
              ユーザー一覧
            </Heading>
            {users && (
              <Text fontSize="lg" color="gray.600">
                全 {users.items.length} 名のユーザーが登録されています
              </Text>
            )}
          </Box>

          <Container maxW="container.md">
            {users && currentUser ? (
              <Stack spacing={6}>
                {currentUser.role === "Admin" && <AddUserButton />}
                <UserTable users={users.items} currentUser={currentUser} />
              </Stack>
            ) : (
              <Box
                bg={useColorModeValue("white", "gray.700")}
                p={8}
                borderRadius="xl"
                textAlign="center"
                shadow="lg"
              >
                <Text color="gray.500">
                  ユーザーの一覧を取得できませんでした
                </Text>
              </Box>
            )}
          </Container>
        </Container>
      </Box>
    </>
  );
}
