// File: src/sections/Contact/Contact.tsx
import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Input,
  Textarea,
  Button,
  Text,
  Field,
  Alert,
} from '@chakra-ui/react';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  errors?: { [key: string]: string };
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Use Vite's environment variable directly
  const API_URL = (import.meta as any).VITE_API_URL || 'https://back-prm4.onrender.com';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    setErrors({});

    console.log('Submitting to:', `${API_URL}/api/contacts`);
    console.log('Form data:', formData);

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setResponse(data);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResponse(data);
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setResponse({
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      minH={{ base: "auto", md: "100vh" }}
      bg="#EBE8DB"
      position="relative"
      py={{ base: 10, md: 20 }}
      overflow="hidden"
    >
      <Box position="absolute" inset={0}>
        <Box
          position="absolute"
          top={{ base: "40px", md: "80px" }}
          left={{ base: "20px", md: "40px" }}
          w={{ base: "80px", md: "128px" }}
          h={{ base: "80px", md: "128px" }}
          bg="#B03052"
          opacity={0.1}
          borderRadius="full"
          filter="blur(48px)"
        />
        <Box
          position="absolute"
          bottom={{ base: "40px", md: "80px" }}
          right={{ base: "20px", md: "80px" }}
          w={{ base: "100px", md: "160px" }}
          h={{ base: "100px", md: "160px" }}
          bg="#D76C82"
          opacity={0.1}
          borderRadius="full"
          filter="blur(48px)"
        />
      </Box>

      <Container maxW={{ base: "90%", md: "7xl" }} position="relative" zIndex={10}>
        <VStack gap={{ base: 4, md: 6 }} mb={{ base: 8, md: 16 }} textAlign="center">
          <Heading
            color="#3D0301"
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '6xl' }}
            fontWeight="bold"
          >
            Get in <Text as="span" color="#B03052">Touch</Text>
          </Heading>
          <Box w="80px" h="4px" bg="#D76C82" borderRadius="full" />
        </VStack>

        {/* Debug info - remove this in production */}
        <Box mb={4} p={4} bg="yellow.100" borderRadius="md" fontSize="sm">
          <Text><strong>Debug Info:</strong></Text>
          <Text>API URL: {API_URL}</Text>
          <Text>Environment: {(import.meta as any).env.MODE}</Text>
        </Box>

        {/* Response Alert */}
        {response && (
          <Box mb={6} maxW={{ base: "100%", md: "600px" }} mx="auto">
            <Alert.Root status={response.success ? "success" : "error"}>
              <Alert.Indicator />
              <Alert.Title>
                {response.success ? "Message Sent!" : "Error"}
              </Alert.Title>
              <Alert.Description>{response.message}</Alert.Description>
            </Alert.Root>
          </Box>
        )}

        <Box
          bg="#EBE8DB"
          borderRadius="3xl"
          px={{ base: 4, md: 8 }}
          py={{ base: 6, md: 10 }}
          border="2px solid #cbabb1ff"
          boxShadow="0 8px 32px rgba(61, 3, 1, 0.1)"
          maxW={{ base: "100%", md: "600px" }}
          mx="auto"
          transition="all 0.3s"
          _hover={{ borderColor: '#c4a6aeff' }}
        >
          <form onSubmit={handleSubmit}>
            <VStack gap={{ base: 4, md: 6 }} align="start">
              <Field.Root invalid={!!errors.name}>
                <Field.Label>Name</Field.Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  bg="#FFF2EF"
                  border="1px solid #d4b3baff"
                  borderRadius="md"
                  color="#3D0301"
                  _focus={{ borderColor: '#B03052', boxShadow: '0 0 0 1px #B03052' }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.name && (
                  <Field.ErrorText>{errors.name}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  bg="#FFF2EF"
                  border="1px solid #d4b3baff"
                  borderRadius="md"
                  color="#3D0301"
                  _focus={{ borderColor: '#B03052', boxShadow: '0 0 0 1px #B03052' }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.email && (
                  <Field.ErrorText>{errors.email}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.message}>
                <Field.Label>Message</Field.Label>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  bg="#FFF2EF"
                  border="1px solid #d4b3baff"
                  borderRadius="md"
                  color="#3D0301"
                  rows={5}
                  _focus={{ borderColor: '#B03052', boxShadow: '0 0 0 1px #B03052' }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.message && (
                  <Field.ErrorText>{errors.message}</Field.ErrorText>
                )}
              </Field.Root>

              <Button
                type="submit"
                bg="#D76C82"
                color="#EBE8DB"
                borderRadius="full"
                px={{ base: 4, md: 8 }}
                py={{ base: 4, md: 6 }}
                fontWeight="semibold"
                _hover={{ bg: '#C95A78', transform: 'translateY(-2px)' }}
                transition="all 0.3s"
                boxShadow="lg"
                w="full"
                size={{ base: "md", md: "lg" }}
                loading={isSubmitting}
                loadingText="Sending..."
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;