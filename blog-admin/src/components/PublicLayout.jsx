import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function PublicLayout({ children }) {
  return (
    <Box minH="100vh" bg="linear-gradient(180deg, #fdfbfb 0%, #ebedee 60%)">
      <Flex
        as="header"
        bg="white"
        px={{ base: 4, md: 10 }}
        py={4}
        shadow="sm"
        align="center"
        gap={4}
        flexWrap="wrap"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Heading size="md" as={RouterLink} to="/">
          Tech Stories
        </Heading>
        <Spacer display={{ base: "none", md: "block" }} />
        <Button
          as={RouterLink}
          to="/login"
          variant="solid"
          colorScheme="blue"
          size="sm"
        >
          Admin Login
        </Button>
      </Flex>
      <Container maxW="6xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        {children}
      </Container>
    </Box>
  );
}
