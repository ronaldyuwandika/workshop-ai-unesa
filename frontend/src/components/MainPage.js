import { useEffect } from "react";
import { VStack } from '@chakra-ui/react';
import Navbar from './Navbar';
import Header from './Header';
import About from './About';
import Chat from './Chat';
import Contact from './Contact';
import Footer from './Footer';

import Aos from "aos";
import "aos/dist/aos.css";

const MainPage = () => {
  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  return (
    <VStack pt={2}>
      <Navbar />
      <Header />
      <About />
      <Chat />
      <Contact />
      <Footer />
    </VStack>
  );
};

export default MainPage;
