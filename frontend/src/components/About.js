import React from "react";
import {
  Image,
  Container,
  Flex,
  Stack,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import styled from "styled-components";

const AboutSection = styled.div`
   #about-container{
    display: flex;
    flex-direction: column;
   } 
    @media only screen and (min-width: 950px) {
        #about-container{
            flex-direction: row
            
        }
    }
}
`;

function About() {
  return (
    <Stack py={20} pb={5}>
      <AboutSection>
        <Flex id="about-container">
          <Flex alignItems="center" justifyContent="center" mb={8}>
            <Image
              borderRadius="full"
              boxSize="300px"
              src=""
            />
          </Flex>
          <Box>
            <Container>
              <Text fontSize="3xl" fontWeight="bold">
                About Me
              </Text>
              <Text fontSize="5x1">
                Hello, I am a seasoned Senior Infrastructure Engineer with a knack for rapid learning and a passionfor collaboration. 
                My broad spectrum of knowledge is complemented by my expertise in managinglarge-scale infrastructure environments. 
                I thrive in dynamic settings and am always ready toleverage my skills to tackle new challenges.
              </Text>
              <br />
              <VStack spacing="3px" align="start">
                <Text fontSize="3xl" fontWeight="bold">
                  Education
                </Text>
                <Text fontSize="5x1">
                  Software Engineering, SMK Telkom Malang
                </Text>
                {/* <Text fontSize="5x1">Post-Graduate Diploma, Accounting - University of British Columbia</Text> */}
              </VStack>
            </Container>
          </Box>
        </Flex>
      </AboutSection>
    </Stack>
  );
}

export default About;
