"use client"

import type React from "react"

import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { CacheProvider } from "@chakra-ui/next-js"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  )
}
