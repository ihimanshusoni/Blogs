import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Stack,
  Heading,
  Alert,
  SimpleGrid,
  Text,
  Divider,
} from "@chakra-ui/react";
import { createBlog, fetchBlog, updateBlog } from "../api/blogs.js";

export default function BlogFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      if (!isEdit) return;
      setLoading(true);
      setError("");
      try {
        const blog = await fetchBlog(id);
        setTitle(blog.title || "");
        setSlug(blog.slug || "");
        setExcerpt(blog.excerpt || "");
        setContent(blog.content || "");
        setTags(
          Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || ""
        );
        setPublished(Boolean(blog.published));
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
  }, [id, isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      published,
    };

    try {
      if (isEdit) {
        await updateBlog(id, payload);
      } else {
        await createBlog(payload);
      }
      navigate("/blogs");
    } catch (error_) {
      setError(
        error_.response?.data?.message ||
          error_.message ||
          "Failed to save blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="5xl"
      bg="white"
      shadow="xl"
      borderRadius="2xl"
      p={{ base: 5, md: 10 }}
      borderWidth="1px"
      borderColor="gray.100"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={4}
        spacing={4}
      >
        <Box>
          <Heading size="lg" mb={1}>
            {isEdit ? "Edit Blog" : "New Blog"}
          </Heading>
          <Text color="gray.500">
            Fill in the core story details and toggle publish when you are ready
            to go live.
          </Text>
        </Box>
        <Button as={RouterLink} to="/blogs" variant="ghost">
          ← Back to dashboard
        </Button>
      </Stack>

      {error && (
        <Alert status="error" mb={4}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Building resilient APIs"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Slug</FormLabel>
              <Input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="auto-generate or custom slug"
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel>Excerpt</FormLabel>
            <Textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary shown in lists"
              rows={3}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Main blog content (Markdown/plain text)"
              rows={12}
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <FormControl>
              <FormLabel>Tags (comma separated)</FormLabel>
              <Input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="react, javascript, backend"
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <FormLabel mb={1}>Published</FormLabel>
                <Text fontSize="sm" color="gray.500">
                  Publish now or save as draft to finish later.
                </Text>
              </Box>
              <Switch
                isChecked={published}
                onChange={(event) => setPublished(event.target.checked)}
                size="lg"
              />
            </FormControl>
          </SimpleGrid>

          <Divider />

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            alignSelf={{ base: "stretch", md: "flex-start" }}
            w={{ base: "full", md: "auto" }}
            size="lg"
          >
            {isEdit ? "Save Changes" : "Create Blog"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
