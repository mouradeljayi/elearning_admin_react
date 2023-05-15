import {
  Box,
  Heading,
  Center,
  Text,
  Flex,
  HStack,
  Spacer,
} from "@chakra-ui/react";

import cachet from "../../assets/img/cachet.png";
import cadre from "../../assets/img/cadre.jpg";

function Certificat() {
  // bg="#ECF0F1"
  return (
    <Center w="100%">
      <Center
        bg={`url(${cadre})`}
        bgSize="cover"
        bgPos="center"
        w="100%"
        color="black"
        maxWidth="800px"
        height={"600px"}
      >
        <Box>
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"}>
              CERTIFICAT DE REUSSITE
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading
              fontFamily="serif"
              fontStyle={"italic"}
              as="h1"
              size={"md"}
            >
              Ce certificat atteste que
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" as="h1" size={"md"}>
              Mr/Mme Er-raghi Karima
            </Heading>
            {/* <Box  w="100px"
                    h="100px"
                    bg={`url(${paiperleckImage})`}
                    bgSize="100%" bgPos="right" 
                    bgRepeat="no-repeat">
                    
                    

                </Box> */}
          </Center>

          <br />
          <Center>
            <Text fontFamily="serif" fontSize={20}>
              a validé avec succés le module
            </Text>
          </Center>
          <Center>
            <Heading fontFamily="serif" as="h2" size={"lg"}>
              L'importance de la Securité au Travail
            </Heading>
          </Center>
          <br />
          <br />

          <Flex alignItems={"center"}>
            <Box>
              DATE:{" "}
              <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
                28 Mars 2023{" "}
              </span>
            </Box>
            <Spacer />
            <Box
              w="100px"
              h="100px"
              bg={`url(${cachet})`}
              bgSize="cover"
              bgPos="center"
            ></Box>
            {/* <TimbreCirculaire/> */}
            <Spacer />
            <Flex alignItems={"center"}>
              <Box>SIGNATURE:</Box>
              <Box>
                <Text ml={1}>WWQ3RTIDHSQ</Text>
                <Box style={{ fontWeight: "bold" }}>Mr Teddy Tuzo</Box>

                <Text
                  style={{ textDecoration: "underline" }}
                  fontFamily="serif"
                  fontStyle={"italic"}
                  fontSize="xs"
                >
                  Directeur Paiperleck
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Center>
    </Center>
  );
}

export default Certificat;
