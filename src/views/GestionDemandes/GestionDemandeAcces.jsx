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
import RegisterDemande from "./RegisterDemande";
import { useMediaQuery } from "@chakra-ui/react";
import axiosClient from "../../axios-client";
import DemandeAccesAuxModule from "./DemandeAccesAuxModule";
import DemandeReactivationAuxModule from "./DemandeReactivationAuxModule";
import { useStateContext } from "../../context/ContextProvider";

function GestionDemandeAcces() {

  // current user
  const { user } = useStateContext();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const [frgAcces, setFrgAcces] = useState(false);

  const handleChange = (event) => {
    if (event.target.checked) {
      console.log("✅ Checkbox is checked");
    } else {
      console.log("⛔️ Checkbox is NOT checked");
    }
    setFrgAcces(!frgAcces);
  };

  const [listDemandeAccesModule, setListDemandeAccesModule] = useState()
  const [listReacticationAccesModule, setListReacticationAccesModule] = useState()

  useEffect(() => {

    if (user.role === 'RESPO') {
      axiosClient.get(`/acces/getDemamdAccesByResponsable/?idResponsable=${user.id}`).then((res) => setListDemandeAccesModule(res.data.length))
      axiosClient.get(`/acces/getDemamdReactivationByResponsable/?idResponsable=${user.id}`).then((res) => setListReacticationAccesModule(res.data.length))
    }
    
    if (user.role === 'SUPERADMIN' || user.role === "MASTER" || user.role === 'ADMIN') {
      axiosClient.get(`/acces/getAllDemamdAcces/`).then((res) => setListDemandeAccesModule(res.data.length))
      axiosClient.get(`/acces/getAllDemamdReactivation/`).then((res) => setListReacticationAccesModule(res.data.length))
    }
  }, [user.id])

  const [vari, setVari] = useState(0);

  return (
    <Box mt='5px'>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
          Espace demandes
        </Heading>
      </Box>
      <Stack>
        <Tabs variant="enclosed">
          <TabList>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Demandes Inscription
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
              <RegisterDemande />
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
                <DemandeAccesAuxModule />
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
                <DemandeReactivationAuxModule />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Box>
  );
}

export default GestionDemandeAcces;
