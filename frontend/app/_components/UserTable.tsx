"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import type { User } from "../_types/user";
import DeleteUserButton from "./DeleteUserButton";
import UpdateUserRoleSelector from "./UpdateUserRoleSelector";
import type { FC } from "react";

type UserTableProps = {
  users: User[];
  currentUser: User;
};

const UserTable: FC<UserTableProps> = ({
  users,
  currentUser,
}: UserTableProps) => {
  const isAdmin = currentUser.role === "Admin";

  return (
    <Card
      bg="white"
      border="1px solid"
      borderColor="brand.paper"
      borderRadius="none"
      overflow="hidden"
    >
      <CardBody p={0}>
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg="brand.cream">
              <Tr>
                <Th
                  fontSize="xs"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color="brand.textMuted"
                  borderBottomWidth="2px"
                  borderColor="brand.paper"
                  py={4}
                >
                  名前
                </Th>
                <Th
                  fontSize="xs"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color="brand.textMuted"
                  borderBottomWidth="2px"
                  borderColor="brand.paper"
                  py={4}
                >
                  メールアドレス
                </Th>
                <Th
                  fontSize="xs"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color="brand.textMuted"
                  borderBottomWidth="2px"
                  borderColor="brand.paper"
                  py={4}
                >
                  ロール
                </Th>
                {isAdmin && (
                  <Th
                    borderBottomWidth="2px"
                    borderColor="brand.paper"
                    py={4}
                  />
                )}
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr
                  key={user.id}
                  _hover={{ bg: "brand.cream" }}
                  transition="background 0.2s"
                >
                  <Td
                    fontWeight="500"
                    borderColor="brand.paper"
                    py={4}
                  >
                    {user.name}
                    {user.id === currentUser.id && (
                      <Badge
                        bg="brand.primary"
                        color="white"
                        ml={2}
                        fontSize="2xs"
                      >
                        あなた
                      </Badge>
                    )}
                  </Td>
                  <Td
                    color="brand.textMuted"
                    borderColor="brand.paper"
                    py={4}
                  >
                    {user.email}
                  </Td>
                  <Td borderColor="brand.paper" py={4}>
                    {isAdmin ? (
                      <UpdateUserRoleSelector
                        user={user}
                        isCurrentUser={user.id === currentUser.id}
                      />
                    ) : (
                      <Badge
                        bg={user.role === "Admin" ? "brand.accent" : "brand.cream"}
                        color={user.role === "Admin" ? "white" : "brand.text"}
                        fontSize="2xs"
                        px={2}
                        py={1}
                      >
                        {user.role}
                      </Badge>
                    )}
                  </Td>
                  {isAdmin && (
                    <Td borderColor="brand.paper" py={4}>
                      {user.id !== currentUser.id && (
                        <DeleteUserButton user={user} />
                      )}
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default UserTable;
