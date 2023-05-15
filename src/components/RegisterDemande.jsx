import { useState, useEffect } from 'react';
import {
    Flex,
    Box,
    Heading,
    Button,
    Stack,
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
    useDisclosure,
    Text
} from '@chakra-ui/react';
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';

export default function RegisterDemande() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const { isLoading, setIsLoading } = useStateContext()
    const [id, setId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Modal Overlay
    const OverlayApprouver = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )
    const [overlay, setOverlay] = useState(<OverlayApprouver />)

    // Afficher les liste des demandes
    useEffect(() => {
        axiosClient.get('/demandes/')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [data]);

    const handleModalEtat = async (id) => {
        setId(id);
    };

    // Approuver une demande d'inscription
    const handleEtat = (id) => {
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
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }

    return (
        <Box mt="5px" >
            <Heading fontSize={{ base: '2xl', sm: '3xl' }}>
                Liste des demandes d'inscription
            </Heading>
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
                    my={12}>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Prénom</Th>
                                    <Th>Nom</Th>
                                    <Th>E-mail</Th>
                                    <Th>Adresse</Th>
                                    <Th>Options</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((demande) => (
                                    <Tr key={demande.id}>
                                        <Td>{demande.first_name}</Td>
                                        <Td>{demande.last_name}</Td>
                                        <Td>{demande.email}</Td>
                                        <Td>{demande.address}</Td>

                                        <Td> <Button
                                            ml='4'
                                            size="sm"
                                            isDisabled={demande.etat ? false : true}
                                            colorScheme={demande.etat ? 'blue' : 'green'}
                                            onClick={() => {
                                                handleModalEtat(demande.id)
                                                setOverlay(<OverlayApprouver />)
                                                onOpen()
                                            }}
                                        >
                                            {demande.etat ? "Approuver" : "Approuvée"}
                                        </Button></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Flex>

            {/* Start Modal Component */}
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
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
                            onClick={() => handleEtat(id)}
                        >
                            {isLoading ? <Spinner size="sm" /> : "Approuver"}
                        </Button>
                        <Button colorScheme='red' size="sm" onClick={onClose}>Fermé</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* End Modal Component */}

        </Box>
    )
}