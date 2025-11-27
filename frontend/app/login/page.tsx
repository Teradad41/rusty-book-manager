"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  Icon,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiBook } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN_KEY } from "../_components/auth";
import useLocalStorageState from "use-local-storage-state";
import { SubmitHandler, useForm } from "react-hook-form";
import { post } from "../_lib/client";

type LoginInput = {
  email: string;
  password: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [_accessToken, setAccessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const onSubmit: SubmitHandler<LoginInput> = async (input) => {
    const res = await post({ destination: "/auth/login", body: input });

    if (res.ok) {
      const json = await res.json();
      setAccessToken(json.accessToken);
      router.push("/");
    } else {
      setError("メールアドレスまたはパスワードが間違っています。");
    }
  };

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, gray.800)"
  );

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
    >
      <Container maxW="md">
        <VStack spacing={8} py={12}>
          <VStack spacing={4} textAlign="center">
            <Box
              bg={useColorModeValue("blue.500", "blue.600")}
              p={4}
              borderRadius="2xl"
              boxShadow="lg"
            >
              <Icon as={FiBook} boxSize={12} color="white" />
            </Box>
            <Heading
              fontSize="4xl"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
            >
              ログイン
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Rusty Book Manager にようこそ！📚
            </Text>
          </VStack>

          <Box
            w="full"
            bg={useColorModeValue("white", "gray.700")}
            boxShadow="2xl"
            borderRadius="2xl"
            p={8}
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={6}>
                {error && (
                  <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormControl
                  id="email"
                  isInvalid={errors.email ? true : false}
                  isRequired
                >
                  <FormLabel fontWeight="semibold">メールアドレス</FormLabel>
                  <Input
                    type="email"
                    size="lg"
                    borderRadius="lg"
                    focusBorderColor="blue.500"
                    {...register("email", { required: true })}
                  />
                </FormControl>

                <FormControl
                  id="password"
                  isInvalid={errors.password ? true : false}
                  isRequired
                >
                  <FormLabel fontWeight="semibold">パスワード</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      borderRadius="lg"
                      focusBorderColor="blue.500"
                      {...register("password", { required: true })}
                    />
                    <InputRightElement h="full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, purple.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  isLoading={isSubmitting}
                  loadingText="ログイン中..."
                  borderRadius="lg"
                >
                  ログイン
                </Button>
              </Stack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
