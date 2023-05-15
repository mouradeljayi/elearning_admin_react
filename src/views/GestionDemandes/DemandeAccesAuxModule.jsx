import {
    Box,
    Button, Stack, Icon, Text,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    useToast,
    Select,
    Flex,
    InputGroup,
    InputLeftElement,
    Input,
} from '@chakra-ui/react'
import axiosClient from "../../axios-client";
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { useMediaQuery } from "@chakra-ui/react";
import { useStateContext } from "../../context/ContextProvider";
import { SearchIcon } from '@chakra-ui/icons';
import MyPagination from '../../components/MyPagination';

function DemandeAcces() {

    // current user
    const { user } = useStateContext();

    const [isNotSmallerScreen] = useMediaQuery("(min-width: 882px)");

    //list acces
    const [listAcces, setListAcces] = useState([])

    //list Apprenant
    const [listApprenant, setListApprenant] = useState([])
    //list Module
    const [listModule, setListModule] = useState([])

    useEffect(() => {

        if (user.role === "RESPO") {
            axiosClient.get(`/acces/getDemamdAccesByResponsable/?idResponsable=${user.id}`).then((res) => setListAcces(res.data.sort().reverse()))
            axiosClient.get('/apprenants/').then((res) => setListApprenant(res.data))
            axiosClient.get('/module/').then((res) => setListModule(res.data))
        }

        if (user.role === 'SUPERADMIN' || user.role === "MASTER" || user.role === 'ADMIN') {
            axiosClient.get(`/acces/getAllDemamdAcces/`).then((res) => setListAcces(res.data.sort().reverse()))
            axiosClient.get('/apprenants/').then((res) => setListApprenant(res.data))
            axiosClient.get('/module/').then((res) => setListModule(res.data))
        }

        console.log('idddddddddddddddddddddddd chaimae ', user.id);

        // axiosClient.get('/apprenants/').then((res) => setListApprenant(res.data))
        // if (user.role === "SUPERADMIN") {
        //     axiosClient.get('/module/').then((res) => setListModule(res.data))
        // } else {
        //     // axiosClient.get(`getModuleByIdResponsable/?idResponsable=${user.id}`).then((res) => setListModule(res.data))
        //     axiosClient.get('/module/').then((res) => setListModule(res.data))
        // }
    }, [user.id])



    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const [deleteId, setDeleteId] = useState(null);
    const cancelRef = React.useRef();


    const toast = useToast();

    //Accepter L'apprenant
    const Accept = (id, idM, idA) => {
        axiosClient.patch(`/acces/${id}/`, {
            etat: true,
            encours: false
        })
            .then((res) => {
                setListAcces((prevData) => prevData.filter((row) => row.id !== id));
                toast({
                    description: `l'apprenant est accepté`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right",
                });
            })
            .catch((error) => {
                console.log(error)
            })

        // axiosClient.post('/progres/', {
        //     progres: 0.0,
        //     module: idM,
        //     apprenant: idA
        // })
        console.log(id, " ", idM, " ", idA);
        //window.location.reload()

    }

    //Refuser l'apprenant
    const refus1 = (id) => {
        axiosClient.delete(`/acces/${id}/`)
            .then(() => {
                console.log("succes");
                setListAcces((prevData) => prevData.filter((row) => row.id !== id));
                toast({
                    description: `l'apprenant est refusé`,
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right",
                });
            })
            .catch((error) => {
                console.log(error)
            })
        onClose()

    }

    const [search, setSearch] = useState('')

    //search method
    const filteredData = useCallback(() => {
        return listAcces.filter((row) => {
            return (
                listApprenant.some((r) => {
                    if (r.id === row.apprenant) {
                        const fullName = `${r.first_name} ${r.last_name}`;
                        return (
                            r.first_name.toLowerCase().includes(search.toLowerCase()) ||
                            r.last_name.toLowerCase().includes(search.toLowerCase()) ||
                            fullName.toLowerCase().includes(search.toLowerCase())
                        );
                    }
                    return false;
                }) ||
                listModule.some((r) => {
                    if (r.id === row.module) {
                        return r.titre.toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                })
            );
        });
    }, [listAcces, listApprenant, listModule, search]);

    //pagination

    const [currentPage, setCurrentPage] = useState(0);

    // Pagination variables
    ////////////////////////////////the size of the table//////////////////////////////
    const PAGE_SIZE = 10;
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(0);
    };
    //////////////////////////////////////////////////////////////////////////////////



    return (
        <Fragment>
            <Box>
                <Flex justifyContent="end" alignItems="center" mb={5}>
                    <InputGroup w="30%">
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon color="gray.300" />}
                        />
                        <Input
                            type="tel"
                            placeholder="Recherche..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </Flex>
                {
                    filteredData()
                        .slice(
                            currentPage * pageSize,
                            currentPage * pageSize + pageSize
                        )
                        .map((val, key) => {
                            return (
                                <Stack
                                    //bg={useColorModeValue("white", "gray.700")}
                                    key={key}
                                    h="60px"
                                    w="100%"
                                    borderRadius="lg"
                                    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                                    border="1px solid rgba(0, 0, 0, 0.25)"
                                    p={4}
                                    mb={3}
                                    direction="row"
                                    alignItems="center">


                                    <Box flexGrow={1} display="flex" >

                                        <Icon as={BsFillInfoSquareFill} h="32px" w="32px" mr="10px" />
                                        <Box ml="30px">
                                            L'apprenant
                                            {listApprenant.map((v, k) => {
                                                if (v.id === val.apprenant) {

                                                    return <b>{` ${v.first_name}  ${v.last_name} `}</b>

                                                }
                                            })}
                                            demande l'accès au module
                                            {listModule.map((v, k) => {
                                                if (v.id === val.module) {
                                                    return <b>{` ${v.titre} `}</b>
                                                }
                                            })}
                                        </Box>
                                    </Box>
                                    {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "RESPO") &&
                                        <>
                                            <Button colorScheme='teal' onClick={() => Accept(val.id, val.module, val.apprenant)}>Accepter</Button>
                                            <Button colorScheme='red' onClick={() => {
                                                setDeleteId(val.id);
                                                onOpen();
                                            }}>Refuser</Button>
                                        </>
                                    }

                                </Stack>
                            )
                        })
                }
                {filteredData().length === 0 && (
                    <Text>Aucune ligne correspondante n'a été trouvée.</Text>

                )}
                <Flex justify="space-between" align="center" w="100%">
                    <Box flex="1">
                        <MyPagination
                            data={filteredData()}
                            searchInput={search}
                            PAGE_SIZE={pageSize}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </Box>

                    <Select w="70px" value={pageSize} onChange={handlePageSizeChange}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        {/* Add more options as needed */}
                    </Select>
                </Flex>


            </Box>


            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Refus d'activation
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            êtes-vous sûr ? Vous ne pourrez pas annuler cette action
                            ultérieurement.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Annuler
                            </Button>
                            <Button
                                onClick={() => refus1(deleteId)}
                                colorScheme="red"
                                ml={3}
                            >
                                Supprimer
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </Fragment>
    )
}

export default DemandeAcces
