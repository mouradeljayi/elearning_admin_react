// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Link,
  Switch,
  Text,
  useColorMode,
  Heading,
  Stack,
  SimpleGrid,
  Progress,
  useColorModeValue,
  ButtonGroup,
  Card, CardHeader, CardBody, CardFooter

} from "@chakra-ui/react";
import Progres from './Progres'

import axiosClient from "../../axios-client";
import React, { useState, useEffect, useRef } from 'react';

// Custom components
import {
  FaCube,

  FaPenFancy,

} from "react-icons/fa";
import { useLocation, useParams } from 'react-router-dom';

import { IoDocumentsSharp } from "react-icons/io5";

function ApprenantDetail() {

  const [listModule, setListModule] = useState([])
  const [listFormation, setListFormation] = useState([])

  const [listProgres, setListProgres] = useState([])
  const [listAcces, setListAcces] = useState([])
  const [listCertificats, setListCertificats] = useState([])
  const [listResultat, setListResultat] = useState([])

  const [idA, setIdA] = useState(1)


  const getAccesbyApprenant = (idA, idM) => {
    console.log(idA + " " + idM);
    let a = "error"
    listAcces.map((val, key) => {
      if (val.apprenant === idA && val.module === idM) {
        if ((val.etat === false && val.encours === true && val.refus === false)) {
          a = "en cours"
        }
        if (val.etat === false && val.encours === false && val.refus === true) {
          a = "reactiver"
        }
        if (val.etat === true && val.encours === false && val.refus === false) {
          a = "commencer"
        }
        if ((val.etat === false && val.encours === true && val.refus === true)) {
          a = "en cours d'activation"
        }
      }
    })
    console.log(a);
    return a
  }
  const getProgresbyApprenant = (idA, idM) => {
    console.log(idA, " ", idM);
    let e = "error"
        let a
    listProgres.map((val, key) => {
      if (val.apprenant === idA && val.module === idM) {
        e = val.progres
        a = e.toFixed(0)
      }
    })
    console.log(a);

    return a
  }

  useEffect(() => {
    axiosClient.get('module/')
      .then((res) => {
        setListModule(res.data)
      })
  }, [])
  useEffect(() => {
    axiosClient.get('formation/')
      .then((res) => {
        setListFormation(res.data)
      })
  }, [])

  useEffect(() => {
    axiosClient.get('acces/')
      .then((res) => setListAcces(res.data))
  }, [])

  useEffect(() => {
    axiosClient.get('certificat/')
      .then((res) => setListCertificats(res.data))
  }, [])
  useEffect(() => {
    axiosClient.get('resultat/')
      .then((res) => setListResultat(res.data))
  }, [])



  useEffect(() => {
    axiosClient.get('progres/')
      .then((res) => setListProgres(res.data))
  }, [])

  const location = useLocation()
  const { colorMode } = useColorMode();

  const [avatarUrl, setAvatarUrl] = useState('');

  const { id } = useParams();
  const [apprenant, setApprenant] = useState('');

  useEffect(() => {
    axiosClient.get(`/apprenants/${location.state.idApprenant}/image`)
      .then(response => {
        setAvatarUrl(response.request.responseURL);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosClient.get(`/apprenants/${location.state.idApprenant}/`)
      .then(({ data }) => {
        setApprenant(data)
        console.log(data)
      })
  }, [])

  function truncateDescription(description) {
    const words = description.split(' ');
    const truncatedWords = words.slice(0, 15);
    return truncatedWords.join(' ') + (words.length > 15 ? '...' : '');
  }
  const [cpm, setCpm] = useState(0)

  function countModule() {
    let cmp = 0
    listAcces.map((val, key) => {
      if (val.apprenant === location.state.idApprenant) {
        if (!(val.etat === false && val.encours === true && val.refus === false)) {
          cmp++
        }
      }
    })
    return cmp
  }

  function certificatList(idR){
    let b="false"
    listCertificats.map((v, k) => {
      if (v.idResultat === idR) {
        b="true"
      }
      
    })
    return b
  }

  function countCertificats() {
    let cmp = 0
    let id
    listResultat.map((val, key) => {
      if (val.idUser === location.state.idApprenant) {
        id = val.idResult
        if (certificatList(id) === "true") {
          cmp++
        }
      }
    })
    return cmp
  }

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("white", "gray.700");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");

  return (
    <Box>
      <Flex shadow={'xl'} direction='column' pt={{ base: "30px", md: "30px", lg: "30px" }}>
        <Flex
          direction={{ sm: "column", md: "row" }}
          maxH='330px'
          justifyContent={{ sm: "center", md: "space-between" }}
          align='center'
          backdropFilter='blur(21px)'
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
          border='1.5px solid'
          borderColor={borderProfileColor}
          bg={bgProfile}
          p='24px'
          borderRadius='20px'>
          <Flex
            align='center'
            mb={{ sm: "10px", md: "0px" }}
            direction={{ sm: "column", md: "row" }}
            w={{ sm: "100%" }}
            textAlign={{ sm: "center", md: "start" }}>
            <Avatar
              src={avatarUrl}
              me={{ md: "22px" }}
              w='80px'
              h='80px'
              borderRadius='15px'
            />
            <Flex direction='column' maxWidth='100%' my={{ sm: "14px" }}>
              <Text
                fontSize={{ sm: "lg", lg: "xl" }}
                color={textColor}
                fontWeight='bold'
                ms={{ sm: "8px", md: "0px" }}>
                {apprenant.first_name} {apprenant.last_name}
              </Text>
              <Text
                fontSize={{ sm: "sm", md: "md" }}
                color={emailColor}
                fontWeight='semibold'>
                {apprenant.email}

              </Text>
            </Flex>
          </Flex>
          <Flex
            direction={{ sm: "column", lg: "row" }}
            w={{ sm: "100%", md: "50%", lg: "auto" }}>
            <Card p='0px' bg='transparent' variant='no-effects'>
              <Flex
                align='center'
                w={{ sm: "100%", lg: "200px" }}
                borderRadius='8px'
                justifyContent='center'
                py='10px'
                cursor='pointer'>
                <Icon color={'yellow.400'} as={FaCube} me='11px' boxSize='30px' />
                <Box>
                  <Text color={textColor} fontWeight='bold'>
                    Nombre de modules
                  </Text>
                  <Text fontSize={'xl'} color={textColor} fontWeight='bold'>
                    {countModule()}
                  </Text>
                </Box>
              </Flex>

            </Card>
            <Card p='0px' bg='transparent' variant='no-effects'>
              <Flex
                align='center'
                w={{ lg: "250px" }}
                borderRadius='15px'
                justifyContent='center'
                py='10px'
                mx={{ lg: "1rem" }}
                cursor='pointer'>
                <Icon color={'green.400'} as={IoDocumentsSharp} me='11px' boxSize='30px' />
                <Box>
                  <Text color={textColor} fontWeight='bold'>
                    Nombre de certificats
                  </Text>
                  <Text fontSize={'xl'} color={textColor} fontWeight='bold'>
                    {countCertificats()}
                  </Text>
                </Box>
              </Flex>
            </Card>

          </Flex>
        </Flex>
      </Flex >

      {listFormation.map((formation, index) => (
        <div key={index}>
          <Heading mt={5} size='md'>Formation {formation.titre}</Heading>
          <SimpleGrid  mt={5} spacing={4} columns={{ base: 1, md: 2 }} >

            {listModule.filter(val => val.formation === formation.id && (getAccesbyApprenant(apprenant.id, val.id) === "commencer" || getAccesbyApprenant(apprenant.id, val.id) === "reactiver" || getAccesbyApprenant(apprenant.id, val.id) === "en cours d'activation")).map((val, index) => (
             
              <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'

              >
                <Image
                  objectFit='cover'
                  maxW={{ base: '100%', sm: '150px' }} 
                  src={val.image}
                  alt='Caffe Latte'
                />
                <CardBody >
                  <Heading size='md'>{val.titre}</Heading>

                  <Text py='2' mb="8px">
                    {truncateDescription(val.description)}
                  </Text>
                  <Box >
                    {
                      getProgresbyApprenant(apprenant.id, val.id) === "error"
                        ? <Progress size='xs' isIndeterminate />
                        : getAccesbyApprenant(apprenant.id, val.id) === "reactiver" || getAccesbyApprenant(apprenant.id, val.id) === "en cours d'activation"
                          ? <Progres color={'red'} value={getProgresbyApprenant(apprenant.id, val.id)>100?100:getProgresbyApprenant(apprenant.id, val.id)} a={getAccesbyApprenant(apprenant.id, val.id)} />
                          : getAccesbyApprenant(apprenant.id, val.id) === "commencer"
                            ? <Progres color={'green'} value={getProgresbyApprenant(apprenant.id, val.id)>100?100:getProgresbyApprenant(apprenant.id, val.id)} />
                            : null
                    }
                  </Box>
                </CardBody>

              </Card>
            ))}
          </SimpleGrid>
        </div>
      ))}
    </Box>
  );
}

export default ApprenantDetail;