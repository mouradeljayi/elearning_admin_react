import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../axios-client';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillSave } from 'react-icons/ai';
import { AddIcon, SearchIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import MyPagination from "../../components/MyPagination";
import { BiDetail } from 'react-icons/bi';
import { CiMenuKebab } from 'react-icons/ci'
import { useStateContext } from "../../context/ContextProvider";

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    IconButton,
    Flex,
    Box,
    Heading,
    Button,
    Stack,
    Table,
    Thead,
    InputGroup,
    InputLeftElement,
    Tbody,
    Tr,
    Th,
    Select,
    Avatar,
    Switch,
    Badge,
    Td,
    Input,
    FormControl,
    FormLabel,
    useToast,
    TableContainer,
    useColorModeValue,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    HStack,
    Tooltip

} from '@chakra-ui/react';

export const GestApprenant = () => {
    const [selectedRole, setSelectedRole] = useState()
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

    // current user
    const { user, setUser } = useStateContext();
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const [deleteId, setDeleteId] = useState(null);
    const cancelRef = React.useRef()

    //Apprenant data
    const [data, setData] = useState([]);

    const handleRoleChange = (event, row) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        setDeleteId(row.id);
        setIsModalOpen(true);
        //changeRole(row.id, newRole);
    };
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
        axiosClient.get('/responsables/')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleRoleSubmit = () => {
        changeRole(deleteId, selectedRole);
        setIsModalOpen(false);
    };
    const changeRole = (id) => {
        const updatedData = data.map(row => {
            if (row.id === id) {
                const formData = new FormData();

                formData.append("role", selectedRole);

                axiosClient.put(`/role_update/${id}/`, formData)
                    .then((response) => {
                        console.log(response)
                        toast({
                            description: "le role est changé",
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                            position: 'bottom-right'
                        })
                    })

                    .catch((error) => console.log(error));

            }
        });
    }


    const handleDelete = (id = deleteId) => {
        if (!id) return;
        axiosClient.delete(`/responsables/${id}/`)
            .then((response) => {
                setData((prevData) => prevData.filter((row) => row.id !== id));
                toast({
                    description: "l'utilisateur est supprimé avec succès",
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
            // Exclude data of current user
            if (row.id === user.id || row.role ==="MASTER" || row.role === "SUPERADMIN") {
                return false;
            }
            return (
                row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [data, searchTerm, user.id]);


    //edit l'etat de responsable ('activé','désactivé')
    const handleEtatClick = (id, etat) => {
        const formData = new FormData();
        formData.append("etat", !etat);

        axiosClient.put(`/etat_update/${id}/`, formData)
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
                    <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '3xl' }}>
                        Administrateurs
                    </Heading>
                </Box>

            </Flex>

            <Box
                justify={'end'}
                align={'end'}
                mt={5}>
                {(user.role === "SUPERADMIN" || user.role === "MASTER") &&
                    <Button
                        mt="10px"
                        onClick={() => navigate('/addResponsable')}
                        colorScheme="blue"
                        leftIcon={<AddIcon />}>
                        Ajouter responsable
                    </Button>}
            </Box>
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
                        <Table variant='striped' colorScheme="gray">
                            <Thead>
                                <Tr>
                                    <Th >Image</Th>
                                    <Th>Nom</Th>
                                    <Th>Prenom</Th>
                                    <Th>Email</Th>
                                    <Th >Adresse</Th>
                                    <Th >Etat</Th>
                                    <Th >Role</Th>
                                    <Th>Date Creation</Th>
                                    {(user.role === "SUPERADMIN" || user.role === "MASTER") &&
                                        <Th>Options</Th>
                                    }

                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * pageSize, currentPage * pageSize + pageSize).map((row) => (
                                    <Tr p={0} key={row.id}>
                                        <Td > <Avatar src={row.image} /></Td>
                                        <Td p={4}>{row.first_name}</Td>
                                        <Td p={4}>{row.last_name}</Td>
                                        <Td p={1}>{row.email}</Td>

                                        <Td>
                                            <Tooltip label={row.address} closeOnClick={true}>
                                            {truncateAddress(row.address)}

                                            </Tooltip>
                                        </Td>
                                        <Td p={5}>
                                            <Flex>
                                                <Stack direction='row' mr="3px">
                                                    {(user.role === "SUPERADMIN" || user.role === "MASTER") &&
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
                                        {(user.role === "SUPERADMIN" || user.role === "MASTER") ?
                                            <Td p={0}>
                                                <FormControl id="role" isRequired>
                                                    <Select size="sm" onChange={(event) => handleRoleChange(event, row)} defaultValue={row.role}>
                                                        <option value="RESPO">Responsable</option>
                                                        <option value="ADMIN">Administrateur</option>
                                                    </Select>
                                                </FormControl>
                                            </Td>
                                            : <Td> {row.role.toLowerCase() === 'admin' ? 'Administrateur' : row.role.toLowerCase() === 'respo' ? 'Responsable' : 'null'} </Td>
                                        }
                                        <Td>{new Date(row.date_creation).toLocaleDateString('fr-FR')}</Td>
                                        {(user.role === "SUPERADMIN" || user.role === "MASTER") &&
                                            <Td>
                                                <IconButton
                                                    size="sm"
                                                    onClick={() => {
                                                        setDeleteId(row.id);
                                                        onOpenAlert();
                                                    }}
                                                    mr="5px"
                                                    colorScheme="red"
                                                    icon={<DeleteIcon />}>
                                                </IconButton>
                                                <IconButton
                                                    size="sm"
                                                    onClick={() => navigate(`/editResponsable`, {
                                                        state: {
                                                            idResponsable: row.id
                                                        }
                                                    })}
                                                    mr="5px"
                                                    colorScheme="green"
                                                    icon={<EditIcon />}>
                                                </IconButton>
                                                {/* <Menu>
                                                    <MenuButton
                                                        as={IconButton}
                                                        aria-label='Options'
                                                        icon={<CiMenuKebab />}
                                                        bg="transparent"
                                                    />
                                                    <MenuList >

                                                        <MenuItem
                                                            icon={<DeleteIcon />}
                                                            onClick={() => {
                                                                setDeleteId(row.id);
                                                                onOpenAlert();
                                                            }}
                                                            color="red"
                                                        >
                                                            Supprimer
                                                        </MenuItem>
                                                        <MenuItem
                                                            icon={<EditIcon />}
                                                            onClick={() => navigate(`/editResponsable`, {
                                                                state: {
                                                                    idResponsable: row.id
                                                                }
                                                            })}
                                                            color="green"
                                                        >
                                                            Modifier
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu> */}


                                            </Td>
                                        }
                                    </Tr>
                                ))}
                                {filteredData().length === 0 && (
                                    <Tr>
                                        <Td colSpan={9}>Aucune ligne correspondante n'a été trouvée.</Td>
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
                            Supprimer responsable
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
            <AlertDialog
                isOpen={isModalOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseModal}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Modifier le role
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ? Changer le rôle mettra à jour ses privilèges et peut affecter sa capacité à effectuer certaines actions.

                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseModal}>
                                Annuler
                            </Button>
                            <Button onClick={handleRoleSubmit} colorScheme='green' ml={3}>
                                Modifier
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </Box>

    )
}

export default GestApprenant