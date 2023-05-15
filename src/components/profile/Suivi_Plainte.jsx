import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { GrAdd } from 'react-icons/gr';
import { createRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../assets/lot/suivi.json';
import React from 'react';
import { FcLock } from 'react-icons/fc';
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import MyPagination from "../MyPagination";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import img3 from '../../assets/img/3.png';


import {
    Box,
    Flex,
    useColorModeValue,
    Stack,
    Heading,
    Image,
    Text,
    Button,
    Badge,
    Spacer,
    InputGroup,
    InputLeftElement,
    Input

} from '@chakra-ui/react';
const PAGE_SIZE = 4;
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};
function Suivi_Plainte() {
    // current user
    const { user, setUser } = useStateContext();
    //search variable
    const [searchTerm, setSearchTerm] = useState('');
    const [plaintes, setPlaintes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const myColor = useColorModeValue("gray.50", "gray.700");
    const navigate = useNavigate()


    // current user data
    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
                console.log(data)
            })
    }, [])
    //search method
    const filteredData = useCallback(() => {
        return plaintes.filter((row) => {
            const booleanField = row.etat ? "reglée" : "encours";
            return row.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.content.toLowerCase().includes(searchTerm.toLowerCase())||
                booleanField.toLowerCase().includes(searchTerm.toLowerCase())

        });
    }, [plaintes, searchTerm]);

    // useEffect(() => {
    //     async function fetchPlaintes() {
    //       const response = await axios.get(`/plainte_by_apprenant/${user.id}/`);
    //       setPlaintes(response.data.data);
    //     }
    //     fetchPlaintes();
    //   }, [user.id]);

    useEffect(() => {
        axiosClient.get(`plainte/?search=${user.id}`)
            .then((res) => {
                setPlaintes(res.data)
            })
    }, [])

    //search method
    

    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={5} mt={5} fontWeight={"bold"} fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    return (
        <Box >

            <Heading ml={'5'} mb={5} bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '4xl' }}>
        Mes tickets
      </Heading>
            {/* Search input */}
            <Flex
                justifyContent="end"
                alignItems="center"
                mt={'4'}
            >
                <InputGroup w="30%">
                    <InputLeftElement
                        pointerEvents='none'
                        children={<SearchIcon color='gray.300' />}
                    />
                    <Input
                        placeholder="Chercher"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg={useColorModeValue('white', 'gray.700')}
                        sx={{
                            marginLeft: 'auto',
                        }}
                    />  </InputGroup>
                <Box
                    justify={'end'}
                    align={'end'}
                >
                    <Button
                        ml={'3'}
                        onClick={() => navigate('/suggestion')}
                        colorScheme="blue"
                        leftIcon={<AddIcon />}>
                        Ajouter une ticket
                    </Button>
                </Box>
            </Flex>

            <Flex
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify={{ base: 'flex-start', md: 'space-between' }}
                p={5}
            >
                <Flex
                    direction="column"
                    width="full"
                    justify={{ base: 'flex-start', md: 'space-between' }}

                >
                    {filteredData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
                        .map((plainte) => (

                            <Stack
                                bg={myColor}
                                mb={2}
                                rounded={'lg'}
                                p={5}
                                boxShadow={'md'}
                                alignItems={'start'}
                                justify="space-between"

                            >
                                <Flex direction="row"
                                    justify="space-between"
                                    ml={'auto'}
                                    width="full">
                                    <Text fontSize={'lg'} fontWeight="semibold">{plainte.sujet}</Text>
                                    <Text mt={2} fontSize={'xs'} color={'gray.500'}>{new Date(plainte.created_at).toLocaleDateString('fr-FR')}</Text>

                                </Flex>

                                <Flex
                                    direction="row"
                                    width="full"
                                    ml={'auto'}
                                    justify="space-between">
                                    <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
                                        {plainte.content}
                                    </Text>
                                    <Stack ml={5} mt={1}>
                                        <Badge
                                            rounded={'lg'}
                                            colorScheme={!plainte.etat ? 'red' : 'green'}
                                        >
                                            {plainte.etat ? 'reglée' : 'encours'}
                                        </Badge>
                                    </Stack>
                                </Flex>
                            </Stack>
                        ))}
                    <MyPagination data={filteredData()} PAGE_SIZE={PAGE_SIZE} currentPage={currentPage} setCurrentPage={setCurrentPage} />

                </Flex>

                <Flex
                    w={{ base: '100%', md: '70%' }}
                    justify="center"
                    alignItems="center"
                    p={{ base: '3', md: '5' }}
                >
                    {/* <Lottie height={400} width={500} display={{ base: 'none', md: 'flex' }} options={defaultOptions} /> */}
                    <Image
                    height={400} width={400}
              rounded={'md'}
              alt={'feature image'}
              src={
                img3
              }
              objectFit={'cover'}
            />
                </Flex>
            </Flex>


        </Box>

    )
}

export default Suivi_Plainte