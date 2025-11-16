import { useEffect, useState } from "react";
import {
  Heading,
  Button,
  Flex,
  Spacer,
  Stack,
  Box,
  Text,
  Badge,
  Wrap,
  WrapItem,
  Alert,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  useBreakpointValue,
  ButtonGroup,
  Tag,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../api/blogs.js";

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const gridColumns = useBreakpointValue({ base: 1, lg: 2 });

  const loadBlogs = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchBlogs();
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
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

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await deleteBlog(id);
      setBlogs((prev) =>
        prev.filter((blog) => blog._id !== id && blog.id !== id)
      );
    } catch (error_) {
      alert(
        error_.response?.data?.message ||
          error_.message ||
          "Failed to delete blog"
      );
    }
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Blogs</StatLabel>
              <StatNumber>{blogs.length}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Published</StatLabel>
              <StatNumber>
                {blogs.filter((blog) => blog.published).length}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Drafts</StatLabel>
              <StatNumber>
                {blogs.filter((blog) => !blog.published).length}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="md">Latest entries</Heading>
          <Text color="gray.600" fontSize="sm">
            Track and manage your tech stories in one place.
          </Text>
        </Box>
        <Spacer display={{ base: "none", md: "block" }} />
        <Button
          as={RouterLink}
          to="/blogs/new"
          colorScheme="blue"
          w={{ base: "full", md: "auto" }}
        >
          New Blog
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Text>Loading...</Text>
      ) : blogs.length === 0 ? (
        <Text color="gray.600">No blogs yet. Create your first one.</Text>
      ) : (
        <SimpleGrid columns={gridColumns} gap={5}>
          {blogs.map((blog) => {
            const id = blog._id || blog.id;
            return (
              <Card key={id} shadow="lg" borderRadius="2xl">
                <CardBody>
                  <Stack spacing={3}>
                    <Flex align="center" wrap="wrap" gap={2}>
                      <Heading size="md">{blog.title}</Heading>
                      <Tag colorScheme={blog.published ? "green" : "gray"}>
                        {blog.published ? "Published" : "Draft"}
                      </Tag>
                    </Flex>
                    {blog.excerpt && (
                      <Text color="gray.600" noOfLines={3}>
                        {blog.excerpt}
                      </Text>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
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
                    <ButtonGroup spacing={3} flexWrap="wrap">
                      <Button
                        as={RouterLink}
                        to={`/blogs/${id}/edit`}
                        variant="outline"
                        colorScheme="blue"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}
