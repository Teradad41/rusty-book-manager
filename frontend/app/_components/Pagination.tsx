"use client";

import {
  Button,
  Flex,
  Text,
  Icon,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

type PaginationProps = {
  limit: number;
  offset: number;
  total: number;
};

const Pagination: FC<PaginationProps> = ({
  limit,
  offset,
  total,
}: PaginationProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (limit: number, offset: number) => {
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());
    return `${pathname}?${params.toString()}`;
  };

  const last = Math.min(offset + limit, total);
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      shadow="sm"
    >
      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
        <Button
          leftIcon={<Icon as={FiChevronLeft} />}
          isDisabled={offset <= 0}
          onClick={() =>
            replace(createPageURL(limit, Math.max(offset - limit, 0)))
          }
          colorScheme="blue"
          variant="outline"
          size="md"
          borderRadius="lg"
          _hover={{
            transform: "translateX(-2px)",
          }}
          transition="all 0.2s"
        >
          前へ
        </Button>

        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {offset + 1} - {last}
          </Text>
          <Text fontSize="sm" color="gray.500">
            /
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            {total}
          </Text>
          <Text fontSize="xs" color="gray.500" ml={2}>
            (ページ {currentPage} / {totalPages})
          </Text>
        </Flex>

        <Button
          rightIcon={<Icon as={FiChevronRight} />}
          isDisabled={last == total}
          onClick={() => replace(createPageURL(limit, last))}
          colorScheme="blue"
          variant="outline"
          size="md"
          borderRadius="lg"
          _hover={{
            transform: "translateX(2px)",
          }}
          transition="all 0.2s"
        >
          次へ
        </Button>
      </Flex>
    </Box>
  );
};

export default Pagination;
