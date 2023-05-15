import {
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    TabList,
    useColorModeValue,
    Text,
    Heading,
    Tabs,
    Tab,
    TabPanels,
    TabPanel,
    Stack,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import DemandeAcces from "./DemandeAcces";
  import DemandeActivation from "./DemandeActivation";
  import ActivationModuleApprenant from "./ActivationModuleApprenant";
  import axiosClient from "../../axios-client";
import { useLocation } from "react-router-dom";

function GestionAccesModule() {

    const location = useLocation()

    const [listDemandeAccesModule, setListDemandeAccesModule] = useState()
    const [listReacticationAccesModule, setListReacticationAccesModule] = useState()
  
    useEffect(() => {
      axiosClient.get(`/acces/getDemamdAcces/?idModule=${location.state.idModule}`).then((res) => setListDemandeAccesModule(res.data.length))
      axiosClient.get(`/acces/getDemamdReactivation/?idModule=${location.state.idModule}`).then((res) => setListReacticationAccesModule(res.data.length))
    }, [])

    console.log('my id module : ',location.state.idModule);

  return (
    <Box mt='5px'>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
          Gestion des accès
        </Heading>
      </Box>
      <Stack>
        <Tabs variant="enclosed">
          <TabList>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Accès
            </Tab>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Demandes Accès aux modules
              {listDemandeAccesModule > 0 &&
                <Badge rounded="full" bg="#df2e38" style={{ padding: "2px 7px 2px 6px" }} color="white" ml='2'>{listDemandeAccesModule}</Badge>}
            </Tab>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Demandes l'activation des modules
              {listReacticationAccesModule > 0 &&
                <Badge rounded="full" bg="#df2e38" style={{ padding: "2px 7px 2px 6px" }} color="white" ml='2'>{listReacticationAccesModule}</Badge>}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ActivationModuleApprenant id_Module={location.state.idModule}/>
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
                <DemandeAcces id_Module={location.state.idModule}/>
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
                <DemandeActivation id_Module={location.state.idModule}/>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Box>
  )
}

export default GestionAccesModule