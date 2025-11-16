import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Heading,
  Text,
  Stack,
  Tag,
  Wrap,
  WrapItem,
  Button,
  Alert,
  Skeleton,
  SkeletonText,
  Divider,
  List,
  ListItem,
  Code,
  Link as ChakraLink,
  Image,
} from "@chakra-ui/react";
import { fetchPublishedBlog } from "../api/blogs.js";

function BlogHeroSkeleton() {
  return (
    <Stack spacing={4}>
      <Skeleton height="40px" w="70%" />
      <Skeleton height="20px" w="40%" />
      <Skeleton height="120px" />
    </Stack>
  );
}

export default function PublicBlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPublishedBlog(slug);
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
  }, [slug]);

  if (loading) {
    return (
      <Box bg="white" borderRadius="2xl" shadow="xl" p={{ base: 6, md: 10 }}>
        <BlogHeroSkeleton />
        <SkeletonText mt={6} noOfLines={10} spacing={4} />
      </Box>
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
    return (
      <Box textAlign="center" color="gray.500">
        Story not found.
      </Box>
    );
  }

  const markdownComponents = {
    h1: (props) => <Heading as="h1" size="xl" mt={8} {...props} />,
    h2: (props) => <Heading as="h2" size="lg" mt={8} {...props} />,
    h3: (props) => <Heading as="h3" size="md" mt={6} {...props} />,
    p: (props) => (
      <Text
        mt={4}
        fontSize="lg"
        lineHeight="taller"
        color="gray.700"
        {...props}
      />
    ),
    ul: (props) => <List styleType="disc" pl={6} mt={4} {...props} />,
    ol: (props) => <List styleType="decimal" pl={6} mt={4} {...props} />,
    li: (props) => <ListItem mt={2} {...props} />,
    code: ({ inline, children, ...props }) =>
      inline ? (
        <Code colorScheme="purple" {...props}>
          {children}
        </Code>
      ) : (
        <Box
          as="pre"
          bg="gray.900"
          color="gray.100"
          p={4}
          borderRadius="lg"
          overflowX="auto"
          mt={4}
        >
          <Code whiteSpace="pre" {...props}>
            {children}
          </Code>
        </Box>
      ),
    a: ({ href, children, ...props }) => (
      <ChakraLink href={href} color="blue.500" isExternal {...props}>
        {children}
      </ChakraLink>
    ),
    blockquote: (props) => (
      <Box
        borderLeftWidth="4px"
        borderColor="blue.200"
        bg="blue.50"
        p={4}
        borderRadius="lg"
        mt={4}
        color="blue.900"
        {...props}
      />
    ),
    hr: () => <Divider my={8} />,
    img: ({ alt, src }) => (
      <Image src={src} alt={alt} borderRadius="xl" mt={6} />
    ),
  };

  return (
    <Stack spacing={8}>
      <Button as={RouterLink} to="/" variant="ghost" alignSelf="flex-start">
        ← Back to stories
      </Button>
      <Box bg="white" borderRadius="2xl" shadow="xl" p={{ base: 6, md: 10 }}>
        <Stack spacing={5}>
          <Stack spacing={2}>
            <Heading size="2xl">{blog.title}</Heading>
            <Text color="gray.500">
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Stack>
          {blog.excerpt && (
            <Text fontSize="xl" color="gray.700">
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
          <Box className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {blog.content || ""}
            </ReactMarkdown>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
