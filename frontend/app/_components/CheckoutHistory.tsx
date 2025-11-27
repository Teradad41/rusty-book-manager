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
  Heading,
  Box,
  useColorModeValue,
  Badge,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import { useBookCheckouts } from "../_contexts/checkout";
import { FC } from "react";

type CheckoutHistoryProps = {
  bookId: string;
};

const CheckoutHistory: FC<CheckoutHistoryProps> = ({
  bookId,
}: CheckoutHistoryProps) => {
  const { checkouts } = useBookCheckouts(bookId);

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      shadow="lg"
    >
      <CardBody>
        <Flex align="center" gap={2} mb={4}>
          <Icon as={FiClock} color="blue.500" boxSize={6} />
          <Heading as="h3" size="lg">
            貸出履歴
          </Heading>
          {checkouts && checkouts.length > 0 && (
            <Badge colorScheme="blue" ml={2}>
              {checkouts.length} 件
            </Badge>
          )}
        </Flex>

        <TableContainer>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th fontSize="sm" fontWeight="bold">
                  貸出日
                </Th>
                <Th fontSize="sm" fontWeight="bold">
                  返却日
                </Th>
                <Th fontSize="sm" fontWeight="bold">
                  貸出者
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {checkouts?.map((co) => (
                <Tr
                  key={co.id}
                  _hover={{ bg: useColorModeValue("gray.50", "gray.600") }}
                  transition="background 0.2s"
                >
                  <Td>{co.checkedOutAt}</Td>
                  <Td>
                    {co.returnedAt ? (
                      co.returnedAt
                    ) : (
                      <Badge colorScheme="orange">貸出中</Badge>
                    )}
                  </Td>
                  <Td>
                    {co.checkedOutBy.name}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default CheckoutHistory;
