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
  Heading,
  Badge,
  Icon,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import { useBookCheckouts } from "../_contexts/checkout";
import type { FC } from "react";

type CheckoutHistoryProps = {
  bookId: string;
};

const CheckoutHistory: FC<CheckoutHistoryProps> = ({
  bookId,
}: CheckoutHistoryProps) => {
  const { checkouts } = useBookCheckouts(bookId);

  return (
    <Card
      bg="white"
      border="1px solid"
      borderColor="brand.paper"
      borderRadius="none"
      overflow="hidden"
    >
      <CardBody p={{ base: 6, md: 8 }}>
        <Flex align="center" gap={3} mb={6}>
          <Icon as={FiClock} color="brand.accent" boxSize={5} />
          <Heading
            as="h3"
            fontSize="lg"
            fontFamily="heading"
            fontWeight="400"
          >
            貸出履歴
          </Heading>
          {checkouts && checkouts.length > 0 && (
            <Badge
              bg="brand.cream"
              color="brand.text"
              fontSize="xs"
              px={2}
              py={1}
            >
              {checkouts.length} 件
            </Badge>
          )}
        </Flex>

        {checkouts && checkouts.length > 0 ? (
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                    borderBottomWidth="2px"
                    borderColor="brand.paper"
                  >
                    貸出日
                  </Th>
                  <Th
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                    borderBottomWidth="2px"
                    borderColor="brand.paper"
                  >
                    返却日
                  </Th>
                  <Th
                    fontSize="xs"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    color="brand.textMuted"
                    borderBottomWidth="2px"
                    borderColor="brand.paper"
                  >
                    貸出者
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {checkouts?.map((co) => (
                  <Tr
                    key={co.id}
                    _hover={{ bg: "brand.cream" }}
                    transition="background 0.2s"
                  >
                    <Td
                      fontFamily="mono"
                      fontSize="sm"
                      borderColor="brand.paper"
                    >
                      {co.checkedOutAt}
                    </Td>
                    <Td borderColor="brand.paper">
                      {co.returnedAt ? (
                        <Text fontFamily="mono" fontSize="sm">
                          {co.returnedAt}
                        </Text>
                      ) : (
                        <Badge
                          bg="brand.secondary"
                          color="white"
                          fontSize="2xs"
                        >
                          貸出中
                        </Badge>
                      )}
                    </Td>
                    <Td
                      fontWeight="500"
                      borderColor="brand.paper"
                    >
                      {co.checkedOutBy.name}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            py={8}
            textAlign="center"
            color="brand.textMuted"
          >
            <Text>まだ貸出履歴はありません</Text>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default CheckoutHistory;
