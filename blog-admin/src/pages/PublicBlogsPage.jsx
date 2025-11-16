import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Badge,
  Wrap,
  WrapItem,
  Button,
  Alert,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { fetchPublishedBlogs } from "../api/blogs.js";

function BlogCardSkeleton() {
  return (
    <Box bg="white" borderRadius="2xl" shadow="lg" p={6}>
      <Skeleton height="28px" mb={4} />
      <SkeletonText noOfLines={3} spacing={3} />
      <Skeleton height="36px" mt={6} w="40%" />
    </Box>
  );
}

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPublishedBlogs();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error_) {
        setError(
          error_.response?.data?.message ||
            error_.message ||
            "Failed to load blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <Stack spacing={10}>
      <Stack spacing={3} textAlign="center">
        <Heading size="2xl">Tech Blog Stories</Heading>
        <Text fontSize="lg" color="gray.600">
          Fresh perspectives from the Control Center, curated for public
          reading.
        </Text>
      </Stack>

      {error && (
        <Alert status="error" borderRadius="lg">
          {error}
        </Alert>
      )}

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {Array.from({ length: 4 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      ) : blogs.length === 0 ? (
        <Box textAlign="center" color="gray.500">
          No published stories yet. Check back soon.
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {blogs.map((blog) => (
            <Box
              key={blog.slug}
              bg="white"
              borderRadius="2xl"
              shadow="lg"
              p={6}
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Heading size="md">{blog.title}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Stack>
                {blog.excerpt && (
                  <Text color="gray.700" noOfLines={4}>
                    {blog.excerpt}
                  </Text>
                )}
                {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                  <Wrap spacing={2}>
                    {blog.tags.map((tag) => (
                      <WrapItem key={tag}>
                        <Badge colorScheme="purple" variant="subtle">
                          {tag}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
                <Button
                  as={RouterLink}
                  to={`/blog/${blog.slug}`}
                  colorScheme="blue"
                  alignSelf="flex-start"
                >
                  Read Story
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
