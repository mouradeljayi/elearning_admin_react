import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../context/ContextProvider';

import { AiOutlineCheck, AiOutlineStop} from "react-icons/ai";
import { AiOutlineClose } from 'react-icons/ai';
import MyPagination from "../../components/MyPagination";

import {
    Flex,
    Box,
    Heading,
    Button,
    Stack,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useColorModeValue,
    useToast,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    InputRightElement,
    Icon,
    InputGroup,
    Text,
    Badge
} from '@chakra-ui/react';
import { FaSearch } from "react-icons/fa";
const PAGE_SIZE = 3;

export default function RegisterDemande() {


    // State variables
    const toast = useToast()
    const [data, setData] = useState([]);
    const { isLoading, setIsLoading } = useStateContext()
    const [id, setId] = useState(null);


    // Approuver demande Modal Overlay
    const OverlayApprouver = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )

    // Refuser demande Modal Overlay
    const OverlayRefuser = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )

    // Refuser une demande d'inscription
    const handleRefuser = (id) => {
        setIsLoading(true)
        axiosClient.get(`/refuse_demande/${id}/`)
            .then(() => {
                toast({
                    description: "La demande a été refusée avec succés",
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right'
                })
                setIsLoading(false);
                onCloseModalB()
                fetchDemandes();
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });

    }

    // Approuver une demande d'inscription
    const handleApprouver = (id) => {
        setIsLoading(true);
        axiosClient.get(`/approve_demande/${id}/`)
            .then((response) => {
                if (response.data.message === "Ce mail existe déja") {
                    toast({
                        description: response.data.message,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom-right'
                    })
                } else {
                    toast({
                        description: response.data.message,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'bottom-right'
                    })
                }
                setIsLoading(false);
                onCloseModalA()
                fetchDemandes();
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });

    }

    // afficher la liste des demandes
    const fetchDemandes = useCallback(() => {
        setIsLoading(true);
        axiosClient.get('/demandes/')
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, [setData]);

    useEffect(() => {
        fetchDemandes();
    }, [fetchDemandes]);


    // Récuperer l'ID de la demande
    const handleModalEtat = async (id) => {
        setId(id);
    };

    // Pagination variables
    const [currentPage, setCurrentPage] = useState(0);

    // Modals variables and methods
    const [isModalAOpen, setIsModalAOpen] = useState(false);
    const [isModalBOpen, setIsModalBOpen] = useState(false);

    const onOpenModalA = () => {
        setIsModalAOpen(true);
    };

    const onOpenModalB = () => {
        setIsModalBOpen(true);
    };

    const onCloseModalA = () => {
        setIsModalAOpen(false);
    };

    const onCloseModalB = () => {
        setIsModalBOpen(false);
    };

    const [overlayRefuser, setOverlayRefuser] = useState(<OverlayRefuser />)
    const [overlay, setOverlay] = useState(<OverlayApprouver />)

    //search variable
    const [searchTerm, setSearchTerm] = useState('')
    //search method
    const filteredData = useCallback(() => {
        return data.filter(
          (row) =>
            row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.address.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
      }, [data, searchTerm]);
    
    return (
        <Box mt="5px" >
            <Flex
                align={'center'}
                justify={'center'}
            >
                <Stack
                    w={'full'}
                    maxW='full'
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'lg'}
                    p={6}
                    my={5}>
                    {/* Start Search input */}
                    <Flex justifyContent="right">
                        <InputGroup w="30%" >
                            <InputRightElement
                                pointerEvents="none"
                                children={<Icon as={FaSearch} color="gray.300" />}
                            />
                            <Input
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                mb={4}
                                mr="auto"
                                sx={{
                                    marginRight: "auto",
                                }}
                            />
                        </InputGroup>
                    </Flex>
                    {/* End Search input */}
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Prénom</Th>
                                    <Th>Nom</Th>
                                    <Th>E-mail</Th>
                                    <Th>Adresse</Th>
                                    <Th>Etat</Th>
                                    <Th>Options</Th>
                                </Tr>
                            </Thead>
                                <Tbody>
                                    {filteredData().slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE).map((demande) => (
                                        <Tr key={demande.id}>
                                            <Td>{demande.first_name}</Td>
                                            <Td>{demande.last_name}</Td>
                                            <Td>{demande.email}</Td>
                                            <Td>{demande.address}</Td>
                                            <Td>
                                                {(!demande.etat || demande.isApproved ) ?
                                                    <Badge pr="1.5" pl="1.5" colorScheme={demande.isApproved ? 'green' : 'blue'} rounded={"lg"}>{demande.isApproved ? 'Approuvée' : 'Non approuvée'}</Badge>
                                                :   <Badge pr="1.5" pl="1.5" colorScheme={'yellow'} rounded={"lg"}>En cours</Badge> 
                                                }
                                            </Td> 
                                            {demande.etat ?
                                                <Td> <Button
                                                    ml='4'
                                                    size="sm"
                                                    isDisabled={demande.etat ? false : true}
                                                    colorScheme={demande.etat ? 'yellow' : 'green'}
                                                    onClick={() => {
                                                        handleModalEtat(demande.id)
                                                        setOverlay(<OverlayApprouver />)
                                                        onOpenModalA()
                                                    }}
                                                >
                                                    Approuver
                                                </Button>

                                                    <Button
                                                        ml='4'
                                                        size="sm"
                                                        isDisabled={demande.etat ? false : true}
                                                        colorScheme={demande.etat ? 'red' : 'green'}
                                                        onClick={() => {
                                                            handleModalEtat(demande.id)
                                                            setOverlayRefuser(<OverlayRefuser />)
                                                            onOpenModalB()
                                                        }}
                                                    >
                                                        Refuser
                                                    </Button>

                                                </Td> : ""}
                                        </Tr>
                                    ))}
                                    {filteredData().length === 0 && (
                  <Tr>
                    <Td colSpan={6}>Aucune ligne correspondante n'a été trouvée.</Td>
                  </Tr>
                )}
                                </Tbody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Flex>

            {/* Start Pagination Component */}
            <MyPagination data={filteredData()} searchInput={searchTerm} PAGE_SIZE={PAGE_SIZE} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* End Pagination Modal Component */}

            {/* Start Approuver Modal Component */}
            <Modal isCentered isOpen={isModalAOpen} onClose={onCloseModalA}>
                {overlay}
                <ModalContent>
                    <ModalHeader>Approuver une demande d'inscription</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Voulez-vous vraiment approuver cette demande ?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isLoading={isLoading}
                            size="sm"
                            mr={3}
                            colorScheme='blue'
                            onClick={() => handleApprouver(id)}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Approuver"}
                        </Button>
                        <Button colorScheme='red' size="sm" onClick={onCloseModalA}>Fermer</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* End Approuver Modal Component */}

            {/* Start Refuser Modal Component */}
            <Modal isCentered isOpen={isModalBOpen} onClose={onCloseModalB}>
                {overlayRefuser}
                <ModalContent>
                    <ModalHeader>Refuser une demande d'inscription</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Voulez-vous vraiment refuser cette demande ?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isLoading={isLoading}
                            size="sm"
                            mr={3}
                            colorScheme='blue'
                            onClick={() => handleRefuser(id)}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Refuser"}
                        </Button>
                        <Button colorScheme='red' size="sm" onClick={onCloseModalB}>Fermer</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* End Refuser Modal Component */}

        </Box>
    )
}