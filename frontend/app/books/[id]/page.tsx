"use client";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FiBook, FiFileText, FiHash, FiUser, FiArrowLeft } from "react-icons/fi";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import CheckoutButton from "@/app/_components/CheckoutButton";
import CheckoutHistory from "@/app/_components/CheckoutHistory";
import Header from "@/app/_components/Header";
import { useBook } from "@/app/_contexts/book";
import { useCurrentUser } from "@/app/_contexts/user";
import { del } from "@/app/_lib/client";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const router = useRouter();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure({ id: "delete-book" });
  const cancelRef = useRef(null);

  const { book } = useBook(params.id);
  const { currentUser } = useCurrentUser();

  // 所有者か管理者のみ更新・削除ができる
  const isEditable = book?.owner?.id === currentUser?.id || currentUser?.role === "Admin";

  const onClickDeleteSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await del({
      destination: `/api/v1/books/${params.id}`,
      token: accessToken,
    });
    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        bg="brand.primary"
        color="white"
        py={{ base: 12, md: 16 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="0"
          right="0"
          w="30%"
          h="100%"
          bgGradient="linear(to-bl, brand.accent, transparent)"
          opacity={0.15}
        />

        <Container maxW="1400px" position="relative">
          <Box animation={`${fadeInUp} 0.6s ease-out`}>
            {/* Back link */}
            <Flex
              as={NextLink}
              href="/"
              align="center"
              gap={2}
              color="whiteAlpha.700"
              fontSize="sm"
              mb={6}
              _hover={{ color: "white" }}
              transition="color 0.2s"
              w="fit-content"
            >
              <Icon as={FiArrowLeft} color="inherit" />
              <Text color="inherit">蔵書一覧に戻る</Text>
            </Flex>

            <Badge
              bg="white"
              color="brand.primary"
              fontSize="xs"
              px={3}
              py={1}
              mb={4}
            >
              書籍詳細
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="heading"
              fontWeight="400"
              letterSpacing="-0.02em"
              lineHeight="1.2"
              mb={4}
              maxW="800px"
              color="white"
            >
              {book?.title}
            </Heading>

            <Text fontSize="lg" color="whiteAlpha.900">
              {book?.author}
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg="brand.ivory" minH="50vh" py={12}>
        <Container maxW="1400px">
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={8}
          >
            {/* Left Column - Book Details */}
            <GridItem>
              <Card
                bg="white"
                border="1px solid"
                borderColor="brand.paper"
                borderRadius="none"
                overflow="hidden"
                animation={`${fadeInUp} 0.6s ease-out 0.1s backwards`}
              >
                <CardBody p={{ base: 6, md: 10 }}>
                  <Stack spacing={8}>
                    {/* Title */}
                    <Box>
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FiBook} color="brand.primary" boxSize={4} />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="0.1em"
                          textTransform="uppercase"
                          color="brand.textMuted"
                        >
                          タイトル
                        </Text>
                      </Flex>
                      <Text
                        fontSize="xl"
                        fontFamily="heading"
                        color="brand.text"
                      >
                        {book?.title}
                      </Text>
                    </Box>

                    {/* Author */}
                    <Box>
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FiUser} color="brand.secondary" boxSize={4} />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="0.1em"
                          textTransform="uppercase"
                          color="brand.textMuted"
                        >
                          著者
                        </Text>
                      </Flex>
                      <Text fontSize="lg" color="brand.text">
                        {book?.author}
                      </Text>
                    </Box>

                    {/* ISBN */}
                    <Box>
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FiHash} color="brand.accent" boxSize={4} />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="0.1em"
                          textTransform="uppercase"
                          color="brand.textMuted"
                        >
                          ISBN
                        </Text>
                      </Flex>
                      <Text
                        fontSize="lg"
                        fontFamily="mono"
                        color="brand.text"
                        letterSpacing="0.05em"
                      >
                        {book?.isbn}
                      </Text>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FiFileText} color="brand.primary" boxSize={4} />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="0.1em"
                          textTransform="uppercase"
                          color="brand.textMuted"
                        >
                          書籍の概要
                        </Text>
                      </Flex>
                      <Text
                        fontSize="md"
                        color="brand.text"
                        lineHeight="1.9"
                        whiteSpace="pre-wrap"
                      >
                        {book?.description}
                      </Text>
                    </Box>

                    {/* Owner */}
                    <Box
                      pt={6}
                      borderTop="1px solid"
                      borderColor="brand.paper"
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FiUser} color="brand.textMuted" boxSize={4} />
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          letterSpacing="0.1em"
                          textTransform="uppercase"
                          color="brand.textMuted"
                        >
                          この本の所有者
                        </Text>
                      </Flex>
                      <Text fontSize="md" color="brand.text">
                        {book?.owner?.name}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>

              {/* Checkout History */}
              {book?.id && (
                <Box
                  mt={8}
                  animation={`${fadeInUp} 0.6s ease-out 0.3s backwards`}
                >
                  <CheckoutHistory bookId={book?.id} />
                </Box>
              )}
            </GridItem>

            {/* Right Column - Actions */}
            <GridItem>
              <Card
                bg="white"
                border="1px solid"
                borderColor="brand.paper"
                borderRadius="none"
                position="sticky"
                top="100px"
                animation={`${fadeInUp} 0.6s ease-out 0.2s backwards`}
              >
                <CardBody p={{ base: 6, md: 8 }}>
                  <Stack spacing={6}>
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color="brand.textMuted"
                        mb={4}
                      >
                        アクション
                      </Text>

                      {book && <CheckoutButton book={book} />}
                    </Box>

                    <Box pt={6} borderTop="1px solid" borderColor="brand.paper">
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        color="brand.textMuted"
                        mb={4}
                      >
                        管理
                      </Text>

                      <ButtonGroup spacing={3} w="full">
                        <Button
                          as={isEditable ? NextLink : undefined}
                          href={isEditable ? `/books/${params.id}/edit` : undefined}
                          leftIcon={<EditIcon />}
                          variant="outline"
                          flex={1}
                          isDisabled={!isEditable}
                          title={!isEditable ? "この本の所有者もしくは管理者のみ編集できます" : undefined}
                        >
                          編集
                        </Button>
                        <Button
                          leftIcon={<DeleteIcon />}
                          variant="outline"
                          flex={1}
                          onClick={onOpenDelete}
                          isDisabled={!isEditable}
                          borderColor="brand.secondary"
                          color="brand.secondary"
                          _hover={{
                            bg: "brand.secondary",
                            color: "white",
                          }}
                          title={!isEditable ? "この本の所有者もしくは管理者のみ削除できます" : undefined}
                        >
                          削除
                        </Button>
                      </ButtonGroup>

                      {!isEditable && (
                        <Text
                          fontSize="xs"
                          color="brand.textLight"
                          mt={3}
                          textAlign="center"
                        >
                          ※ 編集・削除は所有者および管理者のみ可能です
                        </Text>
                      )}
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Delete Dialog */}
          <AlertDialog
            isOpen={isOpenDelete}
            leastDestructiveRef={cancelRef}
            onClose={onCloseDelete}
          >
            <AlertDialogOverlay>
              <AlertDialogContent borderRadius="none" mx={4}>
                <AlertDialogHeader
                  fontFamily="heading"
                  fontWeight="400"
                  fontSize="2xl"
                  pt={8}
                >
                  蔵書の削除
                </AlertDialogHeader>
                <AlertDialogBody color="brand.textMuted">
                  本当に蔵書「{book?.title}」を削除しますか？
                  <br />
                  この操作は取り消せません。
                </AlertDialogBody>
                <AlertDialogFooter pb={8} pt={6}>
                  <Button
                    ref={cancelRef}
                    onClick={onCloseDelete}
                    variant="ghost"
                  >
                    キャンセル
                  </Button>
                  <Button
                    bg="brand.secondary"
                    color="white"
                    onClick={onClickDeleteSubmit}
                    ml={3}
                    _hover={{
                      bg: "brand.secondaryDark",
                    }}
                  >
                    削除する
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Container>
      </Box>
    </>
  );
}
