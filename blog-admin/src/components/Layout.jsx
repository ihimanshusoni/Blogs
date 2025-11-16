import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box minH="100vh" bg="linear-gradient(180deg, #f5f7fb 0%, #ffffff 60%)">
      <Flex
        as="header"
        bg="white"
        px={{ base: 4, md: 10 }}
        py={4}
        shadow="xs"
        align="center"
        gap={4}
        flexWrap="wrap"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Heading size="md" as={RouterLink} to="/blogs">
          Blog Admin
        </Heading>
        <Spacer display={{ base: "none", md: "block" }} />
        {isAuthenticated && (
          <Button
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={handleLogout}
            w={{ base: "full", sm: "auto" }}
          >
            Logout
          </Button>
        )}
      </Flex>
      <Container maxW="6xl" px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
        <Box mb={{ base: 6, md: 10 }}>
          <Heading size="lg" mb={2}>
            Tech Blog Control Center
          </Heading>
          <Text color="gray.600">
            Create, edit, and publish your articles with a sleek, responsive
            workspace built for speed.
          </Text>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
