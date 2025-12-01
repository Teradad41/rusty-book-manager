"use client";

import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Icon,
  HStack,
  Container,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  FiBook,
  FiUser,
  FiLogOut,
  FiList,
  FiPlus,
  FiLock,
  FiChevronDown,
  FiBookOpen,
} from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "./auth";
import { FC } from "react";
import { useCurrentUser } from "../_contexts/user";
import { post } from "../_lib/client";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Header: FC = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const onClickLogout = async () => {
    await post({ destination: "/auth/logout", token: accessToken });
    router.push("/login");
  };

  const { currentUser } = useCurrentUser();

  return (
    <Box
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="brand.paper"
      position="sticky"
      top={0}
      zIndex={100}
      _before={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        bgGradient: "linear(to-r, brand.primary, brand.accent, brand.secondary)",
        backgroundSize: "200% 100%",
        animation: `${shimmer} 8s linear infinite`,
      }}
    >
      <Container maxW="1400px">
        <Flex py={4} align="center" justify="space-between">
          {/* Logo */}
          <HStack
            as={NextLink}
            href="/"
            spacing={3}
            cursor="pointer"
            _hover={{
              "& .logo-icon": {
                transform: "rotate(-5deg) scale(1.05)",
              },
              "& .logo-text": {
                color: "brand.primary",
              },
            }}
            transition="all 0.3s"
          >
            <Box
              className="logo-icon"
              bg="brand.primary"
              p={2}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Icon as={FiBookOpen} boxSize={6} color="white" />
            </Box>
            <Box display={{ base: "none", md: "block" }}>
              <Text
                className="logo-text"
                fontFamily="heading"
                fontSize="xl"
                color="brand.text"
                letterSpacing="-0.02em"
                transition="color 0.3s"
              >
                Rusty Book Manager
              </Text>
              <Text
                fontSize="2xs"
                color="brand.textLight"
                letterSpacing="0.2em"
                textTransform="uppercase"
                mt="-1"
              >
                Library Collection
              </Text>
            </Box>
          </HStack>

          {/* Navigation */}
          <HStack spacing={1} display={{ base: "none", lg: "flex" }}>
            <Button
              as={NextLink}
              href="/"
              variant="ghost"
              size="sm"
              fontWeight="500"
              fontSize="xs"
              letterSpacing="0.05em"
              px={4}
            >
              蔵書一覧
            </Button>
            <Button
              as={NextLink}
              href="/books/create"
              variant="ghost"
              size="sm"
              fontWeight="500"
              fontSize="xs"
              letterSpacing="0.05em"
              px={4}
            >
              新規登録
            </Button>
            <Button
              as={NextLink}
              href="/books/checkouts"
              variant="ghost"
              size="sm"
              fontWeight="500"
              fontSize="xs"
              letterSpacing="0.05em"
              px={4}
            >
              貸出状況
            </Button>
          </HStack>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              px={2}
              _hover={{ bg: "brand.cream" }}
            >
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={currentUser?.name}
                  bg="brand.primary"
                  color="white"
                  fontFamily="heading"
                />
                <Box display={{ base: "none", md: "block" }} textAlign="left">
                  <Text fontSize="sm" fontWeight="600" color="brand.text">
                    {currentUser?.name}
                  </Text>
                  {currentUser?.role && (
                    <Text
                      fontSize="2xs"
                      color="brand.textLight"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                    >
                      {currentUser.role}
                    </Text>
                  )}
                </Box>
                <Icon as={FiChevronDown} color="brand.textMuted" boxSize={4} />
              </HStack>
            </MenuButton>

            <MenuList minW="240px">
              <Box px={4} py={3} borderBottom="1px solid" borderColor="brand.paper">
                <Text fontSize="xs" color="brand.textLight" textTransform="uppercase" letterSpacing="0.1em">
                  マイライブラリ
                </Text>
              </Box>
              <MenuItem
                as={NextLink}
                href="/books/checkouts/me"
                icon={<Icon as={FiBook} color="brand.primary" />}
                py={3}
              >
                借りている本
              </MenuItem>
              <MenuItem
                as={NextLink}
                href="/books/create"
                icon={<Icon as={FiPlus} color="brand.primary" />}
                py={3}
              >
                蔵書の新規登録
              </MenuItem>

              <MenuDivider borderColor="brand.paper" />

              <Box px={4} py={3} borderBottom="1px solid" borderColor="brand.paper">
                <Text fontSize="xs" color="brand.textLight" textTransform="uppercase" letterSpacing="0.1em">
                  管理
                </Text>
              </Box>
              <MenuItem
                as={NextLink}
                href="/books/checkouts"
                icon={<Icon as={FiList} color="brand.secondary" />}
                py={3}
              >
                貸出中の蔵書一覧
              </MenuItem>
              <MenuItem
                as={NextLink}
                href="/users"
                icon={<Icon as={FiUser} color="brand.secondary" />}
                py={3}
              >
                ユーザー一覧
              </MenuItem>

              <MenuDivider borderColor="brand.paper" />

              <Box px={4} py={3} borderBottom="1px solid" borderColor="brand.paper">
                <Text fontSize="xs" color="brand.textLight" textTransform="uppercase" letterSpacing="0.1em">
                  アカウント
                </Text>
              </Box>
              <MenuItem
                as={NextLink}
                href="/users/password"
                icon={<Icon as={FiLock} color="brand.textMuted" />}
                py={3}
              >
                パスワード変更
              </MenuItem>
              <MenuItem
                onClick={onClickLogout}
                icon={<Icon as={FiLogOut} color="brand.secondary" />}
                py={3}
                color="brand.secondary"
                fontWeight="600"
              >
                ログアウト
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
