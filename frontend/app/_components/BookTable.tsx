import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBook, FiUser } from "react-icons/fi";
import NextLink from "next/link";
import { FC } from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
};

type BookTableProps = {
  data: Book;
  appendButton?: React.ReactNode;
};

const BookTable: FC<BookTableProps> = ({ data, appendButton }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverShadow = useColorModeValue("xl", "dark-lg");

  return (
    <LinkBox
      as={Card}
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        shadow: hoverShadow,
        borderColor: "blue.400",
      }}
      cursor="pointer"
    >
      <Stack spacing={0}>
        <CardBody>
          <Flex align="center" gap={2} mb={3}>
            <Icon as={FiBook} color="blue.500" boxSize={5} />
            <Heading size="md" noOfLines={2}>
              <LinkOverlay as={NextLink} href={`/books/${data.id}`}>
                {data.title}
              </LinkOverlay>
            </Heading>
          </Flex>
          <Flex align="center" gap={2} color="gray.600">
            <Icon as={FiUser} boxSize={4} />
            <Text fontSize="sm" noOfLines={1}>
              {data.author}
            </Text>
          </Flex>
        </CardBody>

        {appendButton && (
          <CardFooter pt={0} pb={4}>
            {appendButton}
          </CardFooter>
        )}
      </Stack>
    </LinkBox>
  );
};

export default BookTable;
