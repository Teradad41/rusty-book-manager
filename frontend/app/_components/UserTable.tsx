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
  useColorModeValue,
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
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tableHeadBg = useColorModeValue("gray.50", "gray.600");
  const rowHoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      shadow="lg"
    >
      <CardBody p={0}>
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg={tableHeadBg}>
              <Tr>
                <Th fontSize="sm" fontWeight="bold">
                  名前
                </Th>
                <Th fontSize="sm" fontWeight="bold">
                  メールアドレス
                </Th>
                <Th fontSize="sm" fontWeight="bold">
                  ロール
                </Th>
                {isAdmin && <Th></Th>}
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr
                  key={user.id}
                  _hover={{ bg: rowHoverBg }}
                  transition="background 0.2s"
                >
                  <Td fontWeight="medium">
                    {user.name}
                    {user.id === currentUser.id && (
                      <Badge colorScheme="blue" ml={2} fontSize="xs">
                        あなた
                      </Badge>
                    )}
                  </Td>
                  <Td color="gray.600">{user.email}</Td>
                  <Td>
                    {isAdmin ? (
                      <UpdateUserRoleSelector
                        user={user}
                        isCurrentUser={user.id === currentUser.id}
                      />
                    ) : (
                      <Badge colorScheme={user.role === "Admin" ? "purple" : "gray"}>
                        {user.role}
                      </Badge>
                    )}
                  </Td>
                  {isAdmin && (
                    <Td>
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
