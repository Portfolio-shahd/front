import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  Text,
  Field,
  Alert,
  Grid,
  GridItem,
  Icon,
  Link,
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

  // Formspree endpoint URL
  const FORMSPREE_URL = 'https://formspree.io/f/mdklzedg';

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
    
    // Clear response when user starts typing
    if (response) {
      setResponse(null);
    }
  };

  const validateForm = (): boolean => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToFormspree = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          // Optional: Add a subject line
          _subject: `New contact form submission from ${formData.name}`,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Formspree returns different response structure
        const data = await response.json();
        
        setResponse({
          success: true,
          message: 'Thank you for your message! We\'ll get back to you soon.'
        });
        
        // Reset form on success
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        
        // Handle Formspree validation errors
        if (errorData.errors) {
          const formspreeErrors: { [key: string]: string } = {};
          
          errorData.errors.forEach((error: any) => {
            if (error.field) {
              formspreeErrors[error.field] = error.message;
            }
          });
          
          setErrors(formspreeErrors);
          setResponse({
            success: false,
            message: 'Please fix the errors below and try again.'
          });
        } else {
          setResponse({
            success: false,
            message: errorData.error || 'Failed to send message. Please try again.'
          });
        }
      }
    } catch (error) {
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Connection blocked. Please try again later.';
        } else {
          errorMessage = 'Failed to send message. Please try again.';
        }
      }
      
      setResponse({
        success: false,
        message: errorMessage
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setResponse(null);
    setErrors({});

    await submitToFormspree();
    setIsSubmitting(false);
  };

  // Contact info data
  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.95a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      value: "shahdnajjar50@gmail.com",
      href: "mailto:shahdnajjar50@gmail.com"
    },
    {
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone",
      value: "+216 94 377 760",
      href: "tel:+21694377760"
    }
  ];

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

        {/* Response Alert */}
        {response && (
          <Box mb={6} maxW={{ base: "100%", md: "full" }} mx="auto">
            <Alert.Root status={response.success ? "success" : "error"}>
              <Alert.Indicator />
              <Alert.Title>
                {response.success ? "Message Sent!" : "Error"}
              </Alert.Title>
              <Alert.Description>{response.message}</Alert.Description>
            </Alert.Root>
          </Box>
        )}

        {/* Two Column Layout */}
        <Grid 
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
          gap={{ base: 8, lg: 12 }} 
          maxW="6xl" 
          mx="auto"
        >
          
          {/* Left Column - Contact Information */}
          <GridItem display="flex" alignItems="center">
            <VStack align="start" gap={8} w="full" justify="center" h="full">
              <Box>
                <Heading
                  color="#3D0301"
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="bold"
                  mb={6}
                >
                  Let's <Text as="span" color="#B03052">Talk</Text> for Something Special
                </Heading>
                <Text 
                  color="#3D0301" 
                  fontSize="lg" 
                  lineHeight="relaxed" 
                  opacity={0.8}
                >
                  I specialize in building sleek, feature-rich Web applications 
                  that combine innovation, user-friendly design, and performance to exceed 
                  expectations.
                </Text>
              </Box>

              <VStack align="start" gap={6} w="full">
                {contactInfo.map((item, index) => (
                  <HStack 
                    key={index} 
                    align="start" 
                    gap={4} 
                    w="full"
                    role="group"
                    _hover={{ transform: 'translateX(4px)' }}
                    transition="all 0.3s"
                  >
                    <Box
                      w={12}
                      h={12}
                      bg="#D76C82"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      _groupHover={{ transform: 'scale(1.1)' }}
                      transition="transform 0.3s"
                    >
                      <Box color="white" w={6} h={6}>
                        {item.icon}
                      </Box>
                    </Box>
                    <Box>
                      <Text 
                        color="#3D0301" 
                        fontWeight="semibold" 
                        fontSize="lg" 
                        mb={1}
                      >
                        {item.title}
                      </Text>
                      {item.href ? (
                        <Link
                          href={item.href}
                          color="#B03052" 
                          _hover={{ color: '#D76C82' }} 
                          transition="color 0.3s" 
                          fontSize="lg"
                          textDecoration="none"
                        >
                          {item.value}
                        </Link>
                      ) : (
                        <Text color="#3D0301" opacity={0.8} fontSize="lg">
                          {item.value}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </GridItem>

          {/* Right Column - Contact Form */}
          <GridItem>
            <Box
              bg="#EBE8DB"
              borderRadius="3xl"
              px={{ base: 4, md: 8 }}
              py={{ base: 6, md: 10 }}
              border="2px solid #cbabb1ff"
              boxShadow="0 8px 32px rgba(61, 3, 1, 0.1)"
              transition="all 0.3s"
              _hover={{ borderColor: '#c4a6aeff' }}
              h="fit-content"
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
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </VStack>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;