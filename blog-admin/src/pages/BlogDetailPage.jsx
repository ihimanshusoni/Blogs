import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Stack,
  Tag,
  Wrap,
  WrapItem,
  Button,
  Flex,
  Badge,
  Divider,
  Alert,
  Spinner,
} from "@chakra-ui/react";
import { fetchBlog } from "../api/blogs.js";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBlog(id);
        setBlog(data);
      } catch (error_) {
        setError(
          error_.response?.data?.message ||
            error_.message ||
            "Failed to load blog"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        {error}
      </Alert>
    );
  }

  if (!blog) {
    return <Text>No blog found.</Text>;
  }

  const publishedLabel = blog.published ? "Published" : "Draft";
  const publishedColor = blog.published ? "green" : "gray";
  const createdDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString()
    : null;
  const updatedDate = blog.updatedAt
    ? new Date(blog.updatedAt).toLocaleDateString()
    : null;

  return (
    <Stack spacing={8}>
      <Flex
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={4}
      >
        <Button as={RouterLink} to="/blogs" variant="ghost">
          ← Back to blogs
        </Button>
        <Button
          as={RouterLink}
          to={`/blogs/${blog._id || blog.id}/edit`}
          colorScheme="blue"
        >
          Edit Blog
        </Button>
      </Flex>

      <Box p={{ base: 5, md: 10 }} bg="white" shadow="xl" borderRadius="2xl">
        <Stack spacing={4}>
          <Flex align="center" gap={3} wrap="wrap">
            <Heading size="2xl">{blog.title}</Heading>
            <Badge colorScheme={publishedColor} fontSize="md">
              {publishedLabel}
            </Badge>
          </Flex>
          {blog.slug && <Text color="gray.500">Slug: /{blog.slug}</Text>}
          {(createdDate || updatedDate) && (
            <Text color="gray.600" fontSize="sm">
              {createdDate && `Created ${createdDate}`}
              {createdDate && updatedDate ? " • " : ""}
              {updatedDate && `Updated ${updatedDate}`}
            </Text>
          )}
          {blog.excerpt && (
            <Text fontSize="lg" color="gray.700">
              {blog.excerpt}
            </Text>
          )}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <Wrap spacing={2}>
              {blog.tags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag colorScheme="purple" variant="subtle">
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          )}
          <Divider />
          <Text whiteSpace="pre-wrap" fontSize="lg" lineHeight="tall">
            {blog.content}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}
