"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import AuthProvider from "./_components/auth";
import { theme } from "./_theme";
import { FC } from "react";

const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        <ChakraProvider theme={theme}>
          <CacheProvider>{children}</CacheProvider>
        </ChakraProvider>
      ) : (
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <CacheProvider>{children}</CacheProvider>
          </ChakraProvider>
        </AuthProvider>
      )}
    </>
  );
};

export default Providers;
