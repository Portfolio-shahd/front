import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/ui/navbar";
import LandingPage from "./sections/LandingPage/LandingPage";
import AboutMe from "./sections/About/About";
import Skills from "./sections/Skills/Skills";
import Projects from "./sections/Projects/Projects";
import Contact from "./sections/Contact/Contact";
import Footer from "./components/ui/footer";
import ContactsAdminPage from "./pages/ContactsAdmin";

// Main Portfolio Component
const Portfolio = () => (
  <Box w="100%" maxW="100vw" overflowX="hidden">
    {/* Navbar en haut */}
    <Navbar />
    {/* Landing Page Section */}
    <Box id="home">
      <LandingPage />
    </Box>
    {/* About Me Section */}
    <Box id="aboutme">
      <AboutMe />
    </Box>
    {/* Skills Section */}
    <Box id="skills">
      <Skills />
    </Box>
    {/* Projects Section */}
    <Box id="myprojects">
      <Projects />
    </Box>
    {/* Contact Section */}
    <Box id="contact">
      <Contact />
    </Box>
    {/* Footer Section */}
    <Footer />
  </Box>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/seeshahdoudascontact" element={<ContactsAdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;