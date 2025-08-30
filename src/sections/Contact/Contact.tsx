// File: src/sections/Contact/Contact.tsx
import React, { useState } from 'react';
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

  // Hardcode API URL to avoid any build issues
  const API_URL = 'https://back-prm4.onrender.com';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    
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
    
    // Clear response when user starts typing
    if (response) {
      setResponse(null);
    }
  };

  const validateForm = (): boolean => {
    console.log('Validating form with data:', formData);
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message || !formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Separate function for API call to make debugging easier
  const submitToApi = async () => {
    console.log('=== STARTING API CALL ===');
    console.log('API URL:', `${API_URL}/api/contacts`);
    console.log('Payload:', JSON.stringify(formData, null, 2));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout reached, aborting...');
        controller.abort();
      }, 15000); // 15 second timeout

      console.log('Making fetch request...');
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Fetch completed. Response status:', response.status);
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
      console.error('=== API CALL ERROR ===');
      console.error('Error details:', error);
      
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Connection blocked. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setResponse({
        success: false,
        message: errorMessage
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Event:', e);
    console.log('Event type:', e.type);
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form data before validation:', formData);
    
    // Validate form before submitting
    if (!validateForm()) {
      console.log('Form validation FAILED');
      return;
    }

    console.log('Form validation PASSED, proceeding with API call');
    setIsSubmitting(true);
    setResponse(null);
    setErrors({});

    await submitToApi();
    setIsSubmitting(false);
  };

  // Alternative submit handler for button click
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('=== BUTTON CLICKED (as backup) ===');
    console.log('Button event:', e);
    
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring click');
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      console.log('Button validation FAILED');
      return;
    }

    console.log('Button validation PASSED');
    setIsSubmitting(true);
    setResponse(null);
    setErrors({});

    await submitToApi();
    setIsSubmitting(false);
  };

  // Test function for debugging
  const testApiConnection = async () => {
    console.log('=== TESTING API CONNECTION ===');
    try {
      const testResponse = await fetch(`${API_URL}/api/contacts/test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      const testData = await testResponse.json();
      console.log('Test response:', testData);
      alert('Test successful! Check console for details.');
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed! Check console for details.');
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

        {/* Debug info */}
        <Box mb={4} p={4} bg="yellow.100" borderRadius="md" fontSize="sm">
          <Text><strong>Debug Info:</strong></Text>
          <Text>API URL: {API_URL}</Text>
          <Text>Form Data: {JSON.stringify(formData)}</Text>
          <Text>Is Submitting: {isSubmitting.toString()}</Text>
          <Text>Errors: {JSON.stringify(errors)}</Text>
          <Text>Component Loaded: ✓</Text>
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
                <Field.Label color="#3D0301" fontWeight="medium">Name *</Field.Label>
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
                  _placeholder={{ color: '#3D0301', opacity: 0.6 }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.name && (
                  <Field.ErrorText color="#B03052">{errors.name}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label color="#3D0301" fontWeight="medium">Email *</Field.Label>
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
                  _placeholder={{ color: '#3D0301', opacity: 0.6 }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.email && (
                  <Field.ErrorText color="#B03052">{errors.email}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errors.message}>
                <Field.Label color="#3D0301" fontWeight="medium">Message *</Field.Label>
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
                  _placeholder={{ color: '#3D0301', opacity: 0.6 }}
                  size={{ base: "md", md: "lg" }}
                  required
                />
                {errors.message && (
                  <Field.ErrorText color="#B03052">{errors.message}</Field.ErrorText>
                )}
              </Field.Root>

              <VStack w="full" gap={2}>
                <Button
                  type="submit"
                  bg="#D76C82"
                  color="#EBE8DB"
                  borderRadius="full"
                  px={{ base: 4, md: 8 }}
                  py={{ base: 4, md: 6 }}
                  fontWeight="semibold"
                  _hover={{ bg: '#C95A78', transform: 'translateY(-2px)' }}
                  _disabled={{ 
                    bg: '#D76C82', 
                    opacity: 0.6, 
                    cursor: 'not-allowed',
                    transform: 'none'
                  }}
                  transition="all 0.3s"
                  boxShadow="lg"
                  w="full"
                  size={{ base: "md", md: "lg" }}
                  disabled={isSubmitting}
                  onClick={handleButtonClick}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                {/* Backup button that bypasses form submission */}
                <Button
                  bg="blue.500"
                  color="white"
                  size="sm"
                  w="full"
                  onClick={async () => {
                    console.log('=== BACKUP BUTTON CLICKED ===');
                    if (!validateForm()) return;
                    setIsSubmitting(true);
                    await submitToApi();
                    setIsSubmitting(false);
                  }}
                  disabled={isSubmitting}
                >
                  Send (Backup Method)
                </Button>
                
                {/* Test button for debugging */}
                <Button
                  onClick={testApiConnection}
                  bg="gray.500"
                  color="white"
                  size="sm"
                  w="full"
                >
                  Test API Connection
                </Button>
              </VStack>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;