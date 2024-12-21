import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Icon from "@chakra-ui/icon";
import { HStack } from "@chakra-ui/layout";
import { Text, Link } from "@chakra-ui/react";
import styled from "styled-components";

const ContactSection = styled.div`
  #icons {
    transition: transform 0.2s !important;
    cursor: pointer;
  }
  #icons:hover {
    transform: scale(1.2) !important;
  }
`;

function Contact() {
  return (
    <ContactSection>
      <Text fontSize="4xl" fontWeight="bold" m="5">
        Contact Me!
      </Text>
      <HStack spacing="10" justifyContent="center" mb="10">
        <Link
          id="icons"
          href="https://www.linkedin.com/in/wendyywng/"
          isExternal
        >
          <Icon
            as={FaLinkedin}
            boxSize="50"
            color="pink.500"
            _dark={{
              color: "pink.200",
            }}
          />
        </Link>
        <Link id="icons" href="https://github.com/wendyyng" isExternal>
          <Icon
            as={FaGithub}
            boxSize="50"
            color="pink.500"
            _dark={{
              color: "pink.200",
            }}
          />
        </Link>
        <Link id="icons" href="mailto:yw.wendy.ng@gmail.com" isExternal>
          <Icon
            as={MdEmail}
            boxSize="50"
            color="pink.500"
            _dark={{
              color: "pink.200",
            }}
          />
        </Link>
      </HStack>
    </ContactSection>
  );
}

export default Contact;
