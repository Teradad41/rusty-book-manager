"use client";

import {
  Button,
  Flex,
  Text,
  Icon,
  Box,
  HStack,
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

  if (total === 0) return null;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="brand.paper"
      p={4}
    >
      <Flex align="center" justify="space-between" gap={4} flexWrap="wrap">
        <Button
          leftIcon={<Icon as={FiChevronLeft} />}
          isDisabled={offset <= 0}
          onClick={() =>
            replace(createPageURL(limit, Math.max(offset - limit, 0)))
          }
          variant="outline"
          size="sm"
          borderColor="brand.primary"
          color="brand.primary"
          _hover={{
            bg: "brand.primary",
            color: "white",
            transform: "translateX(-2px)",
          }}
          _disabled={{
            opacity: 0.4,
            cursor: "not-allowed",
            _hover: {
              bg: "transparent",
              transform: "none",
            },
          }}
          transition="all 0.2s"
        >
          前へ
        </Button>

        <HStack spacing={4}>
          <Text fontSize="sm" color="brand.textMuted">
            <Text as="span" fontWeight="600" color="brand.text">
              {offset + 1} - {last}
            </Text>
            {" "}/ {total} 件
          </Text>
          <Box
            bg="brand.cream"
            px={3}
            py={1}
          >
            <Text fontSize="xs" fontWeight="600" color="brand.textMuted" letterSpacing="0.05em">
              PAGE {currentPage} / {totalPages}
            </Text>
          </Box>
        </HStack>

        <Button
          rightIcon={<Icon as={FiChevronRight} />}
          isDisabled={last === total}
          onClick={() => replace(createPageURL(limit, last))}
          variant="outline"
          size="sm"
          borderColor="brand.primary"
          color="brand.primary"
          _hover={{
            bg: "brand.primary",
            color: "white",
            transform: "translateX(2px)",
          }}
          _disabled={{
            opacity: 0.4,
            cursor: "not-allowed",
            _hover: {
              bg: "transparent",
              transform: "none",
            },
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
