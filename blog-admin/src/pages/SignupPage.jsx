import { useState } from "react";
import {
  Box,
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
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { registerRequest } from "../api/auth.js";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerRequest(email, password);
      const token = data.token || data.accessToken || data.jwt;
      if (!token) {
        throw new Error("Token not found in response");
      }
      login(token);
      navigate("/blogs");
    } catch (error_) {
      console.error("Signup failed", error_);
      let friendlyMessage = "Something went wrong. Please try again.";
      if (error_.response) {
        const status = error_.response.status;
        if (status === 400 || status === 409) {
          friendlyMessage =
            error_.response.data?.error || "Email already registered.";
        } else if (status >= 500) {
          friendlyMessage = "Server is unavailable right now. Try later.";
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
        <Button as={RouterLink} to="/login" size="sm" variant="outline">
          Already have an account?
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
            Join the Tech Blog Control Center.
          </Heading>
          <Text color="whiteAlpha.800">
            Spin up your admin workspace to publish articles, manage drafts, and
            keep your stories in sync with the public site.
          </Text>
          <Divider borderColor="whiteAlpha.400" />
          <Stack spacing={2} fontSize="sm" color="whiteAlpha.800">
            <Text>✔️ Secure JWT-powered access</Text>
            <Text>✔️ Markdown-ready editor</Text>
            <Text>✔️ Real-time status dashboards</Text>
          </Stack>
        </Box>

        <Box flex="1" p={{ base: 6, md: 10 }} bg="gray.50">
          <Card w="full" bg="whiteAlpha.900" backdropFilter="blur(6px)">
            <CardBody>
              <Stack spacing={3} textAlign="center" mb={4}>
                <Heading size="lg">Create your account</Heading>
                <Text color="gray.600">
                  Start publishing with the Tech Blog Control Center
                </Text>
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
                      placeholder="you@example.com"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Re-enter password"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={loading}
                    loadingText="Creating account"
                    size="lg"
                  >
                    Sign Up
                  </Button>
                  <Button as={RouterLink} to="/login" variant="ghost">
                    Already have an account? Log in
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
