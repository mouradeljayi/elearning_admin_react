import {
  Box,
  useColorModeValue,
  Button,
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
import AddDocs from "./AddDocs";
import AddLinks from "./AddLinks";
import AddVideos from "./AddVideos";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

function AddMedia() {
  const location = useLocation();

  const [mediaFrag, setMediaFrag] = useState(0);

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  console.log('ID Module FROM ADD MEDIA',location.state.idModule)

  return (
    <Box mt='5px'>
      <Box mb={10} w="90%">
        <Heading fontSize={{ base: "2xl", sm: "3xl" }}>Espace médias</Heading>
      </Box>
      {/* <Flex direction="row" >
        <Button
          borderRadius={"20px 20px 0px 0px"}
          mr={2}
          _hover={"none"}
          background={mediaFrag === 0 ? "#FFD140" : "#edf2f7"}
          onClick={() => setMediaFrag(0)}
        >
          <Box >
            <Text fontSize={isNotSmallerScreen?'lg':'xs'}>Ajouts Documents</Text>
          </Box>
        </Button>
        <Button
          borderRadius={"20px 20px 0px 0px"}
          mr={2}
          _hover={"none"}
          background={mediaFrag === 1 ? "#FFD140" : "#edf2f7"}
          onClick={() => setMediaFrag(1)}
        >
          <Text fontSize={isNotSmallerScreen?'lg':'xs'}>Ajouter Videos</Text>
        </Button>
        <Button
          borderRadius={"20px 20px 0px 0px"}
          mr={2}
          _hover={"none"}
          background={mediaFrag === 2 ? "#FFD140" : "#edf2f7"}
          onClick={() => setMediaFrag(2)}
        >
          <Text fontSize={isNotSmallerScreen?'lg':'xs'}>Ajouter Liens</Text>
        </Button>
      </Flex>
      <Flex
        position="absolute"
        top={9}
        w="100%"
        h="500px"
        p={5}
        background="#edf2f7"
        borderRadius={"0 15px 15px 15px"}
        direction="column"
      >
        <Box overflowY="auto" maxHeight="100%" mt={4}>
          {mediaFrag === 0 ? (
            <AddDocs id_Module={location.state.idModule}/>
          ) : mediaFrag === 1 ? (
            <AddVideos />
          ) : (
            <AddLinks />
          )}
        </Box>
      </Flex> */}

      <Tabs variant="enclosed">
        <TabList>
          <Tab _selected={{ color: "yellow", bg: "#1a365d" }}>
            Ajouts Documents
          </Tab>
          <Tab _selected={{ color: "yellow", bg: "#1a365d" }}>
            Ajouts Videos
          </Tab>
          <Tab _selected={{ color: "yellow", bg: "#1a365d" }}>Ajouts Liens</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box
              mt="5px"
              w={"full"}
              maxW="full"
              bg={useColorModeValue("white", "gray.700")}
              rounded={"lg"}
              p={6}
              my={5}
            >
              <AddDocs id_Module={location.state.idModule} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              mt="5px"
              w={"full"}
              maxW="full"
              bg={useColorModeValue("white", "gray.700")}
              rounded={"lg"}
              p={6}
              my={5}
            >
              <AddVideos id_Module={location.state.idModule} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              mt="5px"
              w={"full"}
              maxW="full"
              bg={useColorModeValue("white", "gray.700")}
              rounded={"lg"}
              p={6}
              my={5}
            >
              <AddLinks id_Module={location.state.idModule} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default AddMedia;
