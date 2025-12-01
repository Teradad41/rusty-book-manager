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
  Alert,
  AlertIcon,
  AlertDescription,
  Icon,
  VStack,
  Container,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN_KEY } from "../_components/auth";
import useLocalStorageState from "use-local-storage-state";
import { SubmitHandler, useForm } from "react-hook-form";
import { post } from "../_lib/client";

type LoginInput = {
  email: string;
  password: string;
};

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

  return (
    <Flex
      minH="100vh"
      bg="brand.ivory"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        width="50%"
        height="70%"
        bg="brand.cream"
        transform="rotate(-12deg)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-30%"
        left="-15%"
        width="60%"
        height="80%"
        bg="brand.paper"
        borderRadius="50%"
        opacity={0.5}
        zIndex={0}
      />

      {/* Gold accent line */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="4px"
        bgGradient="linear(to-r, brand.primary, brand.accent, brand.secondary)"
      />

      <Container maxW="container.lg" py={12} position="relative" zIndex={1}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="center"
          minH="calc(100vh - 96px)"
          gap={16}
        >
          {/* Left side - Branding */}
          <VStack
            flex={1}
            spacing={8}
            align={{ base: "center", lg: "flex-start" }}
            textAlign={{ base: "center", lg: "left" }}
            animation={`${fadeInUp} 0.8s ease-out`}
          >
            <Box
              animation={`${float} 6s ease-in-out infinite`}
            >
              <Box
                bg="brand.primary"
                p={5}
                display="inline-block"
                boxShadow="0 20px 40px rgba(28, 69, 50, 0.3)"
              >
                <Icon as={FiBookOpen} boxSize={16} color="white" />
              </Box>
            </Box>

            <Box>
              <Text
                fontSize="xs"
                color="brand.accent"
                letterSpacing="0.3em"
                textTransform="uppercase"
                fontWeight="600"
                mb={2}
              >
                Library Management System
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontFamily="heading"
                fontWeight="400"
                color="brand.text"
                lineHeight="1.1"
                letterSpacing="-0.03em"
              >
                Rusty Book
                <br />
                <Text as="span" color="brand.primary">
                  Manager
                </Text>
              </Heading>
            </Box>

            <Text
              fontSize="lg"
              color="brand.textMuted"
              maxW="400px"
              lineHeight="1.8"
            >
              あなたの蔵書コレクションを美しく管理。
              <br />
              本との新しい出会いを。
            </Text>

            {/* Decorative books illustration */}
            <Flex gap={2} mt={4}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  w="12px"
                  h={`${60 + i * 15}px`}
                  bg={
                    i % 3 === 0
                      ? "brand.primary"
                      : i % 3 === 1
                      ? "brand.accent"
                      : "brand.secondary"
                  }
                  opacity={0.8 - i * 0.1}
                  transform={`rotate(${i * 2 - 4}deg)`}
                  transition="transform 0.3s"
                  _hover={{
                    transform: `rotate(${i * 2 - 4}deg) translateY(-5px)`,
                  }}
                />
              ))}
            </Flex>
          </VStack>

          {/* Right side - Login Form */}
          <Box
            flex={1}
            w="full"
            maxW="440px"
            animation={`${fadeInUp} 0.8s ease-out 0.2s backwards`}
          >
            <Box
              bg="white"
              p={{ base: 8, md: 12 }}
              border="1px solid"
              borderColor="brand.paper"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                bg: "linear-gradient(135deg, brand.primary 0%, brand.accent 100%)",
                zIndex: -1,
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              _hover={{
                _before: {
                  opacity: 1,
                },
              }}
            >
              <Box mb={8}>
                <Text
                  fontSize="xs"
                  color="brand.textLight"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  mb={2}
                >
                  Welcome Back
                </Text>
                <Heading
                  as="h2"
                  fontSize="3xl"
                  fontFamily="heading"
                  fontWeight="400"
                  color="brand.text"
                >
                  ログイン
                </Heading>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={6}>
                  {error && (
                    <Alert
                      status="error"
                      bg="red.50"
                      border="1px solid"
                      borderColor="red.200"
                      borderRadius="none"
                    >
                      <AlertIcon color="red.500" />
                      <AlertDescription fontSize="sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormControl
                    id="email"
                    isInvalid={errors.email ? true : false}
                    isRequired
                  >
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      メールアドレス
                    </FormLabel>
                    <Input
                      type="email"
                      size="lg"
                      placeholder="your@email.com"
                      {...register("email", { required: true })}
                    />
                  </FormControl>

                  <FormControl
                    id="password"
                    isInvalid={errors.password ? true : false}
                    isRequired
                  >
                    <FormLabel
                      fontSize="xs"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      color="brand.textMuted"
                    >
                      パスワード
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password", { required: true })}
                      />
                      <InputRightElement h="full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          color="brand.textMuted"
                          _hover={{ color: "brand.primary" }}
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    bg="brand.primary"
                    color="white"
                    rightIcon={<Icon as={FiArrowRight} />}
                    isLoading={isSubmitting}
                    loadingText="ログイン中..."
                    _hover={{
                      bg: "brand.primaryLight",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 30px rgba(28, 69, 50, 0.3)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    fontSize="sm"
                    letterSpacing="0.1em"
                    py={7}
                  >
                    ログイン
                  </Button>
                </Stack>
              </form>

              {/* Decorative corner accent */}
              <Box
                position="absolute"
                bottom={4}
                right={4}
                w="40px"
                h="40px"
                borderRight="2px solid"
                borderBottom="2px solid"
                borderColor="brand.accent"
                opacity={0.3}
              />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
