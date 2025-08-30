// File: sections/Projects/Projects.tsx
import { useState } from 'react';
import {
  Box,
  Container,
  Text,
  Heading,
  VStack,
  HStack,
  Grid,
  GridItem,
  Button,
  Badge,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogTitle,
} from '@chakra-ui/react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Application desktop de Gestion de Restaurant',
    description: 'Développement d\'une application de bureau pour la gestion des commandes, des tables, du menu et de la facturation dans un restaurant. Interface utilisateur conçue avec JavaFX et base de données relationnelle MySQL pour stocker les informations clients, plats et commandes.',
    category: 'Desktop Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 2,
    title: 'Paradice – Application web de Gestion de Stock',
    description: 'Développement d\'une application web interne pour une entreprise de fabrication de glace. Elle Petite description pour le projet 2',
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 3,
    title: 'Cosmos Delivery – Application Web de Livraison',
    description: 'Développement d\'une application web complète de gestion de livraisons. L\'application gère plusieurs rôles : Client, Service Client, Livreur, Administrateur. Back-end construit avec Node.js et Express.js, base de données PostgreSQL. Documentation interactive générée avec Swagger. Tests d\'API réalisés avec Postman. Interface utilisateur développée en React.js.',
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 4,
    title: 'INAT-Institut national agronomique de Tunisie',
    description: "Conception et développement d'un site web WordPress sur mesure avec des fonctionnalités avancées. Intégration de plugins personnalisés, optimisation du référencement (SEO) et mise en place d'un design responsive moderne, adapté aux besoins spécifiques de l'INAT.",
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 5,
    title: 'BellaShop – Plateforme E-commerce',
    description: 'Développement d\'une plateforme e-commerce complète avec gestion des produits, panier d\'achat, système de paiement sécurisé, et interface d\'administration. Architecture moderne avec technologies web récentes.',
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 6,
    title: 'Procod Tunisie – Site Web',
    description: "Développement d'une plateforme web sur mesure pour PROCOD Tunisie, spécialisée dans les solutions de traçabilité et les consommables industriels. Site responsive avec gestion avancée des produits et commandes, optimisation SEO, et expérience utilisateur fluide adaptée aux professionnels.",
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 7,
    title: 'Thermecatex – Site Web Corporate',
    description: "Conception et développement d'un site web corporate moderne pour THERMECATEX, entreprise spécialisée dans la fabrication et maintenance d'appareils sous pression et le traitement des eaux industrielles. Design responsive, présentation claire des services et interface optimisée pour la conversion client.",
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
  {
    id: 8,
    title: 'Portfolio Website',
    description: 'A personal portfolio showcasing creative projects with a focus on modern aesthetics.',
    category: 'Web Development',
    image: 'https://via.placeholder.com/400x300',
    link: '#',
  },
];

const Projects = () => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Desktop Development', 'Web Development'];

  const filteredProjects = filter === 'All' ? projects : projects.filter((project) => project.category === filter);

  return (
    <Box
      minH={{ base: "auto", md: "100vh" }}
      bg="#EBE8DB"
      position="relative"
      py={{ base: 10, md: 20 }}
      overflow="hidden"
      id="myprojects"
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
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
          >
            My Projects
          </Heading>
          <Box
            w="80px"
            h="4px"
            bg="#D76C82"
            borderRadius="full"
          />
        </VStack>

        <HStack gap={{ base: 2, md: 4 }} justify="center" mb={{ base: 8, md: 12 }} flexWrap="wrap">
          {categories.map((category) => (
            <Button
              key={category}
              bg={filter === category ? '#D76C82' : '#EBE8DB'}
              borderRadius="full"
              border="1px solid #D76C82"
              color={filter === category ? '#EBE8DB' : '#3D0301'}
              fontWeight="semibold"
              px={{ base: 4, md: 6 }}
              py={{ base: 1, md: 2 }}
              _hover={{ 
                bg: filter === category ? '#C95A78' : '#E5E2D5'
              }}
              transition="all 0.3s"
              onClick={() => setFilter(category)}
              size={{ base: "sm", md: "md" }}
            >
              {category}
            </Button>
          ))}
        </HStack>

        <Grid
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={{ base: 4, md: 8 }}
        >
          {filteredProjects.map((project) => (
            <GridItem key={project.id}>
              <DialogRoot>
                <DialogTrigger asChild>
                  <Box
                    bg="#FFF2EF"
                    borderRadius="2xl"
                    border="1px solid rgba(247, 165, 165, 0.5)"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    p={{ base: 4, md: 6 }}
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(247, 165, 165, 0.3)',
                    }}
                    cursor="pointer"
                    h={{ base: "380px", md: "450px" }}
                    display="flex"
                    flexDirection="column"
                  >
                    <Box
                      w="full"
                      h={{ base: "150px", md: "200px" }}
                      bg="#FFF2EF"
                      borderRadius="xl"
                      mb={{ base: 2, md: 4 }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                      flexShrink={0}
                    >
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                      ) : (
                        <Text color="#FFF2EF" opacity={0.8} fontSize={{ base: "xs", md: "sm" }}>
                          Project Preview
                        </Text>
                      )}
                    </Box>
                    <VStack align="start" gap={{ base: 2, md: 3 }} flex="1" justify="space-between">
                      <VStack align="start" gap={{ base: 2, md: 3 }} flex="1">
                        <Badge
                          bg="#FFDBB6"
                          color="#5D688A"
                          px={{ base: 2, md: 3 }}
                          py={1}
                          borderRadius="full"
                          fontSize={{ base: "xs", md: "xs" }}
                        >
                          {project.category}
                        </Badge>
                        <Heading color="#5D688A" fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                          {project.title}
                        </Heading>
                        <Text color="#5D688A" opacity={0.7} fontSize={{ base: "xs", md: "sm" }}>
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </DialogTrigger>
                
                <DialogContent
                  bg="#FFF2EF"
                  borderRadius="2xl"
                  border="1px solid #F7A5A5"
                  boxShadow="0 8px 32px rgba(93, 104, 138, 0.1)"
                  maxW={{ base: "90%", md: "xl" }}
                  mx="auto"
                >
                  <DialogHeader>
                    <DialogTitle color="#5D688A" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                      {project.title}
                    </DialogTitle>
                    <DialogCloseTrigger color="#5D688A" />
                  </DialogHeader>
                  <DialogBody pb={6}>
                    <VStack gap={{ base: 3, md: 4 }} align="start">
                      {project.image && (
                        <Box
                          w="full"
                          h={{ base: "200px", md: "300px" }}
                          bg="#F7A5A5"
                          borderRadius="xl"
                          overflow="hidden"
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                      <Badge
                        bg="#FFDBB6"
                        color="#5D688A"
                        px={{ base: 2, md: 3 }}
                        py={1}
                        borderRadius="full"
                        fontSize={{ base: "xs", md: "xs" }}
                      >
                        {project.category}
                      </Badge>
                      <Text color="#5D688A" opacity={0.7} fontSize={{ base: "sm", md: "md" }}>
                        {project.description}
                      </Text>
                      <Button
                        as="a"
                        bg="#F7A5A5"
                        color="#FFF2EF"
                        borderRadius="full"
                        px={{ base: 4, md: 6 }}
                        py={{ base: 1, md: 2 }}
                        _hover={{ bg: "#F59494" }}
                        size={{ base: "sm", md: "md" }}
                      >
                        View Project
                      </Button>
                    </VStack>
                  </DialogBody>
                </DialogContent>
              </DialogRoot>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Projects;