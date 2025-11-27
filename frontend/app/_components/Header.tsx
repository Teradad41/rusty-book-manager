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
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Icon,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FiBook, FiUser, FiSettings, FiLogOut, FiList, FiUserPlus, FiLock } from "react-icons/fi";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "./auth";
import { FC } from "react";
import { useCurrentUser } from "../_contexts/user";
import { post } from "../_lib/client";

const Header: FC = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();

  const onClickLogout = async () => {
    // TODO: components内でリクエストを飛ばさないようにしたい。外からpropsで渡す。
    await post({ destination: "/auth/logout", token: accessToken });
    router.push("/login");
  };

  const { currentUser } = useCurrentUser();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Box
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={4}
        align="center"
      >
        <Flex flex={1} align="center">
          <HStack
            as={NextLink}
            href="/"
            spacing={2}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            <Icon as={FiBook} boxSize={6} color="blue.500" />
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
              display={{ base: "none", sm: "block" }}
            >
              Rusty Book Manager
            </Text>
          </HStack>
        </Flex>

        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
        >
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="ghost"
              cursor="pointer"
              minW={0}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            >
              <HStack spacing={2}>
                <Avatar
                  size="sm"
                  name={currentUser?.name}
                  bg="blue.500"
                />
                <Box display={{ base: "none", md: "block" }}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {currentUser?.name}
                  </Text>
                  {currentUser?.role && (
                    <Badge colorScheme="blue" fontSize="xs">
                      {currentUser.role}
                    </Badge>
                  )}
                </Box>
              </HStack>
            </MenuButton>
            <MenuList shadow="lg" borderRadius="lg">
              <MenuGroup title="📚 メニュー">
                <MenuItem as={NextLink} href="/books/checkouts/me" icon={<Icon as={FiBook} />}>
                  借りている本
                </MenuItem>
                <MenuItem as={NextLink} href="/books/create" icon={<Icon as={FiUserPlus} />}>
                  蔵書の新規登録
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="⚙️ 管理メニュー">
                <MenuItem as={NextLink} href="/books/checkouts" icon={<Icon as={FiList} />}>
                  貸出中の蔵書一覧
                </MenuItem>
                <MenuItem as={NextLink} href="/users" icon={<Icon as={FiUser} />}>
                  ユーザー一覧
                </MenuItem>
              </MenuGroup>
              <MenuGroup title="👤 個人設定">
                <MenuItem as={NextLink} href="/users/password" icon={<Icon as={FiLock} />}>
                  パスワード変更
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem onClick={onClickLogout} icon={<Icon as={FiLogOut} />} color="red.500">
                ログアウト
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;
