import {
  Box,
  Button,
  useColorModeValue,
  Flex,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import TableLinks from "./TableLinks";
import TableDocs from "./TableDocs";
import TableVideos from "./TableVideos";
import { AddIcon } from "@chakra-ui/icons";

function TableMedia() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mediaFrag, setMediaFrag] = useState(0);

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const toAddMediaPage = (idM) => {
    navigate("/ajout_medias", {
      state: {
        idModule: idM,
      },
    });
  };

   console.log(location.state.idChapitre)

  return (
    <Box mt='5px'>
      <Box mb={10} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
          Espace médias
        </Heading>
      </Box>
      {/* <Flex justifyContent="end" m={0} alignItems="center">
          <Button
            bg="#1a365d"
            color="yellow.300"
            _hover={{
              bg: "yellow.300",
              color: "#1a365d"
            }}
            size="md"
            onClick={() => toAddMediaPage(location.state.idModule)}
            leftIcon={<AddIcon/>}
          >
            Ajouter Médias
          </Button>
      </Flex> */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab _selected={{ color: "white", bg: "#3182ce" }}>Documents</Tab>
          <Tab _selected={{ color: "white", bg: "#3182ce" }}>Videos</Tab>
          <Tab _selected={{ color: "white", bg: "#3182ce" }}>Liens</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box
              w={"full"}
              maxW="full"
              bg={useColorModeValue("white", "gray.700")}
              rounded={"lg"}
              px={6}
              py={2}
            >
              <TableDocs idChapitre={location.state.idChapitre} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              w={"full"}
              maxW="full"
              bg={useColorModeValue("white", "gray.700")}
              rounded={"lg"}
              px={6}
              py={2}
            >
              <TableVideos idModule={location.state.idChapitre}/>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              w={'full'}
              maxW='full'
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'lg'}
              px={6}
              py={2}
            >
              <TableLinks idModule={location.state.idChapitre} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TableMedia;
