import { useState } from "react";
import {
  Flex,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Alert,
  Text,
  Box,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { loginRequest } from "../api/auth.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      const token = data.token || data.accessToken || data.jwt;
      if (!token) {
        throw new Error("Token not found in response");
      }
      login(token);
      navigate("/blogs");
    } catch (error_) {
      console.error("Login failed", error_);
      let friendlyMessage = "Something went wrong. Please try again.";
      if (error_.response) {
        const status = error_.response.status;
        if (status === 400 || status === 401) {
          friendlyMessage = "Invalid email or password.";
        } else if (status >= 500) {
          friendlyMessage =
            "Server is unavailable right now. Please try later.";
        }
      } else if (error_.request) {
        friendlyMessage = "Unable to reach the server. Check your connection.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient={{
        base: "linear(to-b, brand.50, white)",
        md: "linear(to-r, brand.50, white)",
      }}
    >
      <Flex
        as="nav"
        bg="whiteAlpha.900"
        px={{ base: 4, md: 10 }}
        py={4}
        align="center"
        gap={4}
        shadow="xs"
        position="sticky"
        top={0}
        zIndex={5}
      >
        <Heading size="md" as={RouterLink} to="/">
          Tech Stories
        </Heading>
        <Spacer />
        <Button as={RouterLink} to="/" variant="ghost" size="sm">
          View Public Site
        </Button>
        <Button as={RouterLink} to="/signup" variant="outline" size="sm">
          Create Account
        </Button>
        <Button
          as={RouterLink}
          to="/blogs"
          colorScheme="blue"
          size="sm"
          variant="solid"
        >
          Admin Dashboard
        </Button>
      </Flex>
      <Flex
        maxW="6xl"
        w="full"
        bg="white"
        borderRadius="2xl"
        shadow="xl"
        overflow="hidden"
        direction={{ base: "column", lg: "row" }}
        mx="auto"
        mt={{ base: 6, md: 10 }}
        px={{ base: 4, md: 0 }}
      >
        <Box
          flex="1"
          bgGradient="linear(to-b, brand.600, brand.500)"
          color="white"
          p={{ base: 8, md: 10 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={6}
        >
          <Heading size="lg" lineHeight="short">
            Share expert tech insights that inspire your community.
          </Heading>
          <Text color="whiteAlpha.800">
            Craft, edit, and publish blogs with a streamlined admin experience
            optimized for productivity on any device.
          </Text>
          <Divider borderColor="whiteAlpha.400" />
          <Stack spacing={2} fontSize="sm" color="whiteAlpha.800">
            <Text>✔️ Secure admin access</Text>
            <Text>✔️ Instant publishing workflow</Text>
            <Text>✔️ Responsive dashboard</Text>
          </Stack>
        </Box>
        <Box flex="1" p={{ base: 6, md: 10 }} bg="gray.50">
          <Card w="full" bg="whiteAlpha.900" backdropFilter="blur(6px)">
            <CardBody>
              <Stack spacing={3} textAlign="center" mb={4}>
                <Heading size="lg">Welcome back</Heading>
                <Text color="gray.600">Sign in to manage your tech blogs</Text>
              </Stack>
              {error && (
                <Alert status="error" mb={4}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@example.com"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={loading}
                    loadingText="Logging in"
                    size="lg"
                  >
                    Login
                  </Button>
                  <Button as={RouterLink} to="/signup" variant="ghost">
                    Need an account? Sign up
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
