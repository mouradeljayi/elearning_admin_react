import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../axios-client';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { AddIcon, SearchIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import MyPagination from "../MyPagination";


import {
    Flex,
    Box,
    Heading,
    Button,
    Stack,
    Table,
    Thead,
    HStack,
    Tbody,
    InputGroup,
    InputLeftElement,
    Tr,
    Th,
    Avatar,
    Td,
    Input,
    FormControl,
    FormLabel,
    TableContainer,
    useColorModeValue,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Select,
    IconButton,
    Switch,
    Badge,
    useToast,
    Tooltip,

} from '@chakra-ui/react';
import { useStateContext } from '../../context/ContextProvider';
const PAGE_SIZE = 3;

export const GestApprenant = () => {
    const { user, setUser } = useStateContext();
    const toast = useToast()

    //search variable
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate()

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onOpenAlert = () => {
        setIsAlertOpen(true);
    };

    const onOpenModal = () => {
        setIsModalOpen(true);
    };

    const onCloseAlert = () => {
        setIsAlertOpen(false);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
    };
    const MAX_WORDS = 3; // Maximum number of words to display

    function truncateAddress(address) {
        const words = address.split(' ');
        if (words.length > MAX_WORDS) {
            return words.slice(0, MAX_WORDS).join(' ') + '...';
        }
        return address;
    }
    ////////////////////////////////the size of the table//////////////////////////////
    const PAGE_SIZE = 10;
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(0);
    };
    //////////////////////////////////////////////////////////////////////////////////

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [deleteId, setDeleteId] = useState(null);
    const cancelRef = React.useRef()

    //Apprenant data
    const [data, setData] = useState([]);

    // current user data
    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
                console.log(data)
            })
    }, [])
    //get the apprenant data
    useEffect(() => {
        if(user.role==="SUPERADMIN" || user.role==="ADMIN" || user.role==="MASTER")
        axiosClient.get('/apprenants/')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        else {
            axiosClient.get(`/api/apprenants/${user.id}/`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }   
    }, [user.role]);

    //get the apprenant data
    useEffect(() => {
        
    }, []);
    

    const handleDelete = (id = deleteId) => {
        if (!id) return;
        axiosClient.delete(`/apprenants/${id}/`)
            .then((response) => {
                setData((prevData) => prevData.filter((row) => row.id !== id));
                toast({
                    description: "l'apprenant est supprimé avec succès",
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: 'bottom-right'
                })
            })
            .catch((error) => {
                console.log(error);
            });
        onCloseAlert()
    }

    //search method
    const filteredData = useCallback(() => {
        return data.filter((row) => {
            return row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.address.toLowerCase().includes(searchTerm.toLowerCase())
        });
    }, [data, searchTerm]);

    //edit l'etat d'apprenant ('activé','désactivé')
    const handleEtatClick = (id, etat) => {
        const formData = new FormData();
        formData.append("etat", !etat);

        axiosClient.put(`/etatAppr_update/${id}/`, formData)
            .then((response) => {
                // Update the row object with the new etat value
                setData(rows => rows.map(row => {
                    if (row.id === id) {
                        return {
                            ...row,
                            etat: !etat
                        };
                    }   
                    return row;
                }));
                console.log(response);
            })
            .catch((error) => console.log(error));
        if (!etat) {
            toast({
                description: "le compte est activé",
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'bottom-right'
            })
        }
        else {
            toast({
                description: "le compte est désactivé",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'bottom-right'
            })
        }
    }
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <Box mt="5px" >
            <Flex>
                <Box w="90%" >
                    <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '3xl' }}   
>
                    Utilisateurs du système de formation
                    </Heading>
                </Box>
            </Flex>
            <Box
                justify={'end'}
                align={'end'}
                mt={5}
            >
            {(user.role === "SUPERADMIN" || user.role === "MASTER") &&

            <Button
                    mt="10px"
                    onClick={() => navigate('/addApprenant')}
                    colorScheme="blue"
                    leftIcon={<AddIcon />}>
                    Ajouter Apprenant
                </Button>}
                
            </Box>


            <Flex

            >
                <Stack

                    w={'full'}
                    maxW='full'
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'lg'}
                    p={6}
                    my={5}>
                    {/* Search input */}
                    <Flex
                        justifyContent="end"
                        alignItems="center"
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
                                mb={4}
                                sx={{
                                    marginLeft: 'auto',
                                }}
                            />  </InputGroup>

                    </Flex>

                    <TableContainer>
                        <Table variant='striped'>
                            <Thead>
                                <Tr>
                                    <Th >Image</Th>
                                    <Th>Nom</Th>
                                    <Th>Prenom</Th>
                                    <Th>Email</Th>
                                    <Th >Adresse</Th>
                                    <Th>Etat</Th>
                                    <Th>Date Creation</Th>
                                    <Th>Options</Th>
                                </Tr>
                            </Thead>
                            <Tbody >
                                {filteredData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * pageSize, currentPage * pageSize + pageSize).map((row) => (
                                    <Tr key={row.id} >
                                        <Td> <Avatar src={row.image} /></Td>
                                        <Td>{row.first_name}</Td>
                                        <Td>{row.last_name}</Td>
                                        <Td>{row.email}</Td>
                                        <Td>
                                            <Tooltip label={row.address} closeOnClick={true}>
                                            {truncateAddress(row.address)}

                                            </Tooltip>
                                        </Td>
                                        <Td p={5}>
                                            <Flex>
                                                <Stack direction='row' mr="3px">
                                                    {(user.role === "SUPERADMIN" || user.role === "RESPO" || user.role === "MASTER") &&
                                                        <Switch
                                                            colorScheme='green'
                                                            isChecked={row.etat}
                                                            onChange={() => handleEtatClick(row.id, row.etat)}
                                                        />
                                                    }
                                                </Stack>
                                                <Badge
                                                    rounded={'lg'}
                                                    colorScheme={!row.etat ? 'red' : 'green'}
                                                >
                                                    {row.etat ? 'activé' : 'désactivé'}
                                                </Badge>
                                            </Flex>
                                        </Td>
                                        <Td>{new Date(row.date_creation).toLocaleDateString('fr-FR')}</Td>
                                        <Td>{(user.role === "SUPERADMIN" || user.role === "RESPO" || user.role === "MASTER") &&
                                            <IconButton
                                                onClick={() => navigate(`/editApprenant`, {
                                                    state: {
                                                        idApprenant: row.id
                                                    }
                                                })}
                                                size="sm"
                                                ml="5px"
                                                colorScheme='green'
                                                icon={<EditIcon />}>
                                            </IconButton>}
                                            {(user.role === "SUPERADMIN" || user.role === "RESPO" || user.role === "MASTER") &&
                                            <IconButton
                                            size="sm"
                                            ml="5px"
                                            onClick={() => {
                                                setDeleteId(row.id);
                                                onOpenAlert();
                                            }}
                                            colorScheme='red'
                                            icon={<DeleteIcon />}>
                                            
                                        </IconButton>}

                                            <IconButton
                                                onClick={() => navigate(`/apprenant`, {
                                                    state: {
                                                        idApprenant: row.id
                                                    }
                                                })}
                                                size="sm"
                                                ml="5px"
                                                colorScheme='blue'
                                                icon={<AiFillEye />}>
                                            </IconButton>

                                            
                                        </Td>
                                    </Tr>

                                ))}
                                {filteredData().length === 0 && (
                                    <Tr>
                                        <Td colSpan={8}>Aucune ligne correspondante n'a été trouvée.</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                       {/* Pagination */}
                       <Flex justify="space-between" align="center" w="100%">
                            <Box flex="1">
                                <MyPagination
                                    data={filteredData()}
                                    searchInput={searchTerm}
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
                        </TableContainer>
                </Stack>
            </Flex>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Supprimer apprenant
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            êtes-vous sûr ? Vous ne pourrez pas annuler cette action ultérieurement.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseAlert}>
                                Annuler
                            </Button>
                            <Button onClick={() => handleDelete(deleteId)} colorScheme='red' ml={3}>
                                Supprimer
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Modal
                isOpen={isModalOpen}
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                onClose={onCloseModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>First name</FormLabel>
                            <Input ref={initialRef} placeholder='First name' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Last name</FormLabel>
                            <Input placeholder='Last name' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3}>
                            Save
                        </Button>
                        <Button onClick={onCloseModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>

    )
}

export default GestApprenant