import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Input,
  Grid,
  GridItem,
  Spinner,
  Alert,
  Card,
} from '@chakra-ui/react';
import { Search, Mail, Calendar, User } from 'lucide-react';
import env from 'react-dotenv';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const ContactsAdminPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  // File: src/pages/ContactsAdminPage.tsx
const fetchContacts = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${env.VITE_API_URL}/api/contacts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    
    const data = await response.json();
    setContacts(data);
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box
      minH="100vh"
      bg="#EBE8DB"
      position="relative"
      py={{ base: 10, md: 20 }}
      overflow="hidden"
    >
      {/* Background decorative elements */}
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

      <Container maxW={{ base: "95%", md: "7xl" }} position="relative" zIndex={10}>
        {/* Header Section */}
        <VStack gap={{ base: 4, md: 6 }} mb={{ base: 8, md: 16 }} textAlign="center">
          <Heading
            color="#3D0301"
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '6xl' }}
            fontWeight="bold"
          >
            Contact <Text as="span" color="#B03052">Messages</Text>
          </Heading>
          <Box w="80px" h="4px" bg="#D76C82" borderRadius="full" />
        </VStack>

        {/* Search and Stats */}
        <VStack gap={{ base: 4, md: 6 }} mb={{ base: 6, md: 8 }}>
          <HStack
            bg="#EBE8DB"
            borderRadius="full"
            border="2px solid #D76C82"
            px={{ base: 4, md: 6 }}
            py={{ base: 2, md: 3 }}
            maxW={{ base: "100%", md: "500px" }}
            w="full"
          >
            <Search size={20} color="#D76C82" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              border="none"
              bg="transparent"
              color="#3D0301"
              _focus={{ boxShadow: "none" }}
              _placeholder={{ color: "#3D0301", opacity: 0.6 }}
            />
          </HStack>

          <HStack gap={{ base: 4, md: 8 }} flexWrap="wrap" justify="center">
            <Badge
              bg="#D76C82"
              color="#EBE8DB"
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
            >
              Total: {contacts.length}
            </Badge>
            <Badge
              bg="#B03052"
              color="#EBE8DB"
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
            >
              Filtered: {filteredContacts.length}
            </Badge>
          </HStack>

          <Button
            bg="#D76C82"
            color="#EBE8DB"
            borderRadius="full"
            px={{ base: 4, md: 6 }}
            py={{ base: 2, md: 3 }}
            _hover={{ bg: "#C95A78", transform: "translateY(-2px)" }}
            transition="all 0.3s"
            onClick={fetchContacts}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Refresh"}
          </Button>
        </VStack>

        {/* Error Alert */}
        {error && (
          <Box mb={{ base: 6, md: 8 }}>
            <Alert.Root status="error">
              <Alert.Indicator />
              <Box>
                <Alert.Title>Error Loading Contacts</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Box>
            </Alert.Root>
          </Box>
        )}

        {/* Loading State */}
        {loading ? (
          <VStack gap={4} py={10}>
            <Spinner size="xl" color="#D76C82" />
            <Text color="#3D0301" fontSize="lg">Loading contacts...</Text>
          </VStack>
        ) : (
          /* Contacts Grid */
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={{ base: 4, md: 6 }}
          >
            {filteredContacts.length === 0 ? (
              <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                <Box
                  bg="#FFF2EF"
                  borderRadius="2xl"
                  border="2px solid #D76C82"
                  p={{ base: 6, md: 8 }}
                  textAlign="center"
                >
                  <Text color="#3D0301" fontSize="lg" fontWeight="medium">
                    {contacts.length === 0 ? "No contacts found" : "No contacts match your search"}
                  </Text>
                </Box>
              </GridItem>
            ) : (
              filteredContacts.map((contact) => (
                <GridItem key={contact.id}>
                  <Card.Root
                    bg="#FFF2EF"
                    borderRadius="2xl"
                    border="2px solid rgba(215, 108, 130, 0.3)"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-8px)',
                      borderColor: '#D76C82',
                      boxShadow: '0 12px 40px rgba(215, 108, 130, 0.2)',
                    }}
                    h="full"
                  >
                    <Card.Body p={{ base: 4, md: 6 }}>
                      <VStack align="start" gap={{ base: 3, md: 4 }} h="full">
                        {/* Header with name and date */}
                        <VStack align="start" gap={2} w="full">
                          <HStack justify="space-between" w="full" align="start">
                            <HStack>
                              <User size={16} color="#D76C82" />
                              <Text
                                color="#3D0301"
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="bold"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                whiteSpace="nowrap"
                              >
                                {contact.name}
                              </Text>
                            </HStack>
                            <Badge
                              bg="#D76C82"
                              color="#EBE8DB"
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              #{contact.id}
                            </Badge>
                          </HStack>

                          <HStack>
                            <Mail size={14} color="#B03052" />
                            <Text
                              color="#B03052"
                              fontSize={{ base: "xs", md: "sm" }}
                              textOverflow="ellipsis"
                              overflow="hidden"
                              whiteSpace="nowrap"
                            >
                              {contact.email}
                            </Text>
                          </HStack>

                          <HStack>
                            <Calendar size={14} color="#3D0301" />
                            <Text
                              color="#3D0301"
                              fontSize={{ base: "xs", md: "sm" }}
                              opacity={0.7}
                            >
                              {formatDate(contact.createdAt)}
                            </Text>
                          </HStack>
                        </VStack>

                        {/* Message content */}
                        <Box
                          flex={1}
                          bg="rgba(235, 232, 219, 0.5)"
                          borderRadius="xl"
                          p={{ base: 3, md: 4 }}
                          border="1px solid rgba(215, 108, 130, 0.2)"
                        >
                          <Text
                            color="#3D0301"
                            fontSize={{ base: "sm", md: "sm" }}
                            lineHeight="relaxed"
                            overflow="hidden"
                            display="-webkit-box"
                            css={{
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {contact.message}
                          </Text>
                        </Box>

                        {/* Action button */}
                        <Box w="full">
                          <Button
                            bg="#D76C82"
                            color="#EBE8DB"
                            size="sm"
                            borderRadius="full"
                            px={4}
                            _hover={{ bg: "#C95A78" }}
                            transition="all 0.3s"
                            w="full"
                            onClick={() => window.open(`mailto:${contact.email}`, '_self')}
                          >
                            Reply via Email
                          </Button>
                        </Box>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </GridItem>
              ))
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ContactsAdminPage;