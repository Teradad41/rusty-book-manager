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
	Divider,
	Flex,
	Heading,
	Icon,
	Spacer,
	Stack,
	Text,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { FiBook, FiFileText, FiHash, FiUser } from "react-icons/fi";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "@/app/_components/auth";
import CheckoutButton from "@/app/_components/CheckoutButton";
import CheckoutHistory from "@/app/_components/CheckoutHistory";
import Header from "@/app/_components/Header";
import { useBook } from "@/app/_contexts/book";
import { useCurrentUser } from "@/app/_contexts/user";
import { del } from "@/app/_lib/client";

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

	const isOwner = book?.owner?.id === currentUser?.id;

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

	const bgGradient = useColorModeValue(
		"linear(to-br, blue.50, purple.50)",
		"linear(to-br, gray.900, gray.800)",
	);
	const cardBg = useColorModeValue("white", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	return (
		<>
			<Header />
			<Box minH="100vh" bgGradient={bgGradient}>
				<Container maxW="container.xl" py={8}>
					<Flex align="center" mb={6} gap={4}>
						<Box flex="1">
							<Badge
								colorScheme="blue"
								fontSize="sm"
								mb={2}
								px={3}
								py={1}
								borderRadius="full"
							>
								書籍詳細
							</Badge>
							<Heading
								as="h1"
								size="2xl"
								bgGradient="linear(to-r, blue.500, purple.500)"
								bgClip="text"
								noOfLines={2}
							>
								{book?.title}
							</Heading>
						</Box>
					</Flex>

					<Stack spacing={6}>
						<Card
							bg={cardBg}
							borderColor={borderColor}
							borderWidth="1px"
							borderRadius="xl"
							overflow="hidden"
							shadow="lg"
						>
							<CardBody>
								<Flex mb={6} gap={4} flexWrap="wrap">
									{book && <CheckoutButton book={book} />}
									<Spacer />
									<ButtonGroup gap={2}>
										<Button
											as={isOwner ? NextLink : undefined}
											href={isOwner ? `/books/${params.id}/edit` : undefined}
											leftIcon={<EditIcon />}
											colorScheme="blue"
											variant="outline"
											isDisabled={!isOwner}
											title={
												!isOwner ? "この本の所有者のみ編集できます" : undefined
											}
										>
											編集
										</Button>
										<Button
											leftIcon={<DeleteIcon />}
											colorScheme="red"
											variant="outline"
											onClick={onOpenDelete}
											isDisabled={!isOwner}
											title={
												!isOwner ? "この本の所有者のみ削除できます" : undefined
											}
										>
											削除
										</Button>
									</ButtonGroup>
								</Flex>

								<AlertDialog
									isOpen={isOpenDelete}
									leastDestructiveRef={cancelRef}
									onClose={onCloseDelete}
								>
									<AlertDialogOverlay>
										<AlertDialogContent borderRadius="xl">
											<AlertDialogHeader fontWeight="bold" fontSize="xl">
												蔵書の削除
											</AlertDialogHeader>
											<AlertDialogBody>
												本当に蔵書「{book?.title}」を削除しますか？
											</AlertDialogBody>
											<AlertDialogFooter>
												<Button
													ref={cancelRef}
													onClick={onCloseDelete}
													variant="ghost"
												>
													キャンセル
												</Button>
												<Button
													colorScheme="red"
													onClick={onClickDeleteSubmit}
													ml={3}
												>
													削除する
												</Button>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialogOverlay>
								</AlertDialog>

								<Stack spacing={6} divider={<Divider />}>
									<Box>
										<Flex align="center" gap={2} mb={2}>
											<Icon as={FiBook} color="blue.500" boxSize={5} />
											<Text
												fontWeight="semibold"
												fontSize="lg"
												color="gray.700"
											>
												タイトル
											</Text>
										</Flex>
										<Text fontSize="md" pl={7}>
											{book?.title}
										</Text>
									</Box>

									<Box>
										<Flex align="center" gap={2} mb={2}>
											<Icon as={FiUser} color="purple.500" boxSize={5} />
											<Text
												fontWeight="semibold"
												fontSize="lg"
												color="gray.700"
											>
												著者
											</Text>
										</Flex>
										<Text fontSize="md" pl={7}>
											{book?.author}
										</Text>
									</Box>

									<Box>
										<Flex align="center" gap={2} mb={2}>
											<Icon as={FiHash} color="green.500" boxSize={5} />
											<Text
												fontWeight="semibold"
												fontSize="lg"
												color="gray.700"
											>
												ISBN
											</Text>
										</Flex>
										<Text fontSize="md" fontFamily="mono" pl={7}>
											{book?.isbn}
										</Text>
									</Box>

									<Box>
										<Flex align="center" gap={2} mb={2}>
											<Icon as={FiFileText} color="orange.500" boxSize={5} />
											<Text
												fontWeight="semibold"
												fontSize="lg"
												color="gray.700"
											>
												書籍の概要
											</Text>
										</Flex>
										<Text fontSize="md" pl={7} lineHeight="tall">
											{book?.description}
										</Text>
									</Box>

									<Box>
										<Flex align="center" gap={2} mb={2}>
											<Icon as={FiUser} color="teal.500" boxSize={5} />
											<Text
												fontWeight="semibold"
												fontSize="lg"
												color="gray.700"
											>
												この本の所有者
											</Text>
										</Flex>
										<Text fontSize="md" pl={7}>
											{book?.owner?.name}
										</Text>
									</Box>
								</Stack>
							</CardBody>
						</Card>

						{book?.id && <CheckoutHistory bookId={book?.id} />}
					</Stack>
				</Container>
			</Box>
		</>
	);
}
