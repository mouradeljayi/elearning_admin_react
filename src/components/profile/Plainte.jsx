import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../axios-client';
import { AiFillDelete } from 'react-icons/ai';
import { SearchIcon } from '@chakra-ui/icons'
import MyPagination from "../MyPagination";
import { BiDetail } from 'react-icons/bi';


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
  InputGroup,
  HStack,
  Td,
  TableContainer,
  useColorModeValue,
  InputLeftElement,
  Badge,
  useToast,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';

import { Switch } from '@chakra-ui/react';



export const Plainte = () => {

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
  ////////////////////////////////the size of the table//////////////////////////////
  const PAGE_SIZE = 10;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(0);
  };
  //////////////////////////////////////////////////////////////////////////////////
  const [deleteId, setDeleteId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  //toast variable
  const toast = useToast()

  //search variable
  const [searchTerm, setSearchTerm] = useState('');

  //plainte data
  const [data, setData] = useState([]);
  //selected plainte
  const [dataDetail, setDataDetail] = useState('');

  //user data
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  //search method
  const filteredData = useCallback(() => {
    return data.filter((row) => {
      const fullName = `${userData.find((user) => user.id === row.user)?.first_name || 'Unknown'} ${userData.find((user) => user.id === row.user)?.last_name || 'Unknown'}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase())
        || row.content.toLowerCase().includes(searchTerm.toLowerCase())
        || row.created_at.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, userData, searchTerm]);


  //search method
  const filtereAdmindData = useCallback(() => {
    return data.filter((row) => {
      const fullName = `${adminData.find((user) => user.id === row.user)?.first_name || 'Unknown'} ${adminData.find((user) => user.id === row.user)?.last_name || 'Unknown'}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase())
        || row.content.toLowerCase().includes(searchTerm.toLowerCase())
        || row.created_at.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, adminData, searchTerm]);

  const [currentPage, setCurrentPage] = useState(0);


  //get the plainte data
  useEffect(() => {
    axiosClient.get('/plainte/')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //get the user data
  useEffect(() => {
    axiosClient.get('/apprenants/')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //get the admin data
  useEffect(() => {
    axiosClient.get('/responsables/')
      .then((response) => {
        setAdminData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  //delete plainte
  const handleDelete = (id = deleteId) => {
    if (!id) return;
    axiosClient.delete(`/plainte/${id}/`)
      .then((response) => {
        setData((prevData) => prevData.filter((row) => row.id !== id));
        toast({
          description: "le ticket est supprimé avec succès",
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

  //get plainte
  useEffect(() => {
    axiosClient.get(`/plainte/${deleteId}/`)
      .then((response) => {
        setDataDetail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [deleteId]);

  //edit the plainte state ('encours','reglée')
  const handleEtatClick = (id, etat) => {
    const formData = new FormData();
    formData.append("etat", !etat);

    axiosClient.patch(`/plainte/${id}/`, formData)
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
        description: "la plainte est reglée",
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      })
    }
    else {
      toast({
        description: "la plainte est encours",
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }



  return (
    <Box mt="5px" >
      <Heading mb={10} bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '3xl' }}>
        Propositions d'amélioration
      </Heading>
      <Stack>
        <Tabs variant="enclosed">
          <TabList>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Administrateurs
            </Tab>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Responsables
            </Tab>
            <Tab _selected={{ color: "white", bg: "#3182ce" }}>
              Apprenants
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
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
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        mb={4}
                        sx={{
                          marginLeft: 'auto',
                        }}
                      />  </InputGroup>

                  </Flex>

                  {/* Plainte Table  */}
                  <TableContainer>
                    <Table variant='striped' colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th >Utilisateur</Th>
                          <Th>date</Th>
                          <Th>etat</Th>
                          <Th>contenu</Th>
                          <Th >Options</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                      {filtereAdmindData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * pageSize, currentPage * pageSize + pageSize).map((row) => {
                          {
                            if (adminData.find((user) => user.id === row.user && user.role=== "ADMIN") ) {
                              return (
                                <Tr key={row.id}>
                                  <Td>{adminData.find((user) => user.id === row.user)?.first_name || 'Unknown'} {adminData.find((user) => user.id === row.user)?.last_name || 'Unknown'}</Td>

                                  <Td>{new Date(row.created_at).toLocaleDateString('fr-FR')}</Td>
                                  <Td>
                                    <Flex>
                                      <Stack direction='row' mr="3px">
                                        <Switch
                                          colorScheme='green'
                                          isChecked={row.etat}
                                          onChange={() => handleEtatClick(row.id, row.etat)}
                                        />
                                      </Stack>
                                      <Badge
                                        rounded={'lg'}
                                        colorScheme={!row.etat ? 'red' : 'green'}
                                      >
                                        {row.etat ? 'reglée' : 'encours'}
                                      </Badge>
                                    </Flex>
                                  </Td>
                                  <Td><Button
                                    size="sm"
                                    onClick={() => {
                                      setDeleteId(row.id);
                                      onOpen();
                                    }}
                                    colorScheme='blue'
                                    leftIcon={<BiDetail />}>
                                    Afficher
                                  </Button></Td>
                                  <Td>
                                    <Button
                                      size="sm"
                                      //onClick={onOpen}
                                      //onClick={() => handleDelete(row.id)}
                                      onClick={() => {
                                        setDeleteId(row.id);
                                        onOpenAlert();
                                      }}
                                      colorScheme='red'
                                      leftIcon={<AiFillDelete />}>
                                      Supprimer
                                    </Button></Td>
                                </Tr>
                              )
                            }

                          }

                        })}


                        {/* when there is no search data found */}
                        {filtereAdmindData().length === 0 && (
                          <Tr>
                            <Td colSpan={5}>Aucune ligne correspondante n'a été trouvée.</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    {/* Pagination */}
                    <Flex justify="space-between" align="center" w="100%">
                      <Box flex="1">
                        <MyPagination
                          data={filtereAdmindData()}
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
            </TabPanel>
            <TabPanel>
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
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        mb={4}
                        sx={{
                          marginLeft: 'auto',
                        }}
                      />  </InputGroup>

                  </Flex>

                  {/* Plainte Table  */}
                  <TableContainer>
                    <Table variant='striped' colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th>Utilisateur</Th>
                          <Th>date</Th>
                          <Th>etat</Th>
                          <Th>contenu</Th>
                          <Th>Options</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filtereAdmindData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * pageSize, currentPage * pageSize + pageSize).map((row) => {
                          {
                            if (adminData.find((user) => user.id === row.user && user.role=== "RESPO") ) {
                              return (
                                <Tr key={row.id}>
                                  <Td>{adminData.find((user) => user.id === row.user)?.first_name || 'Unknown'} {adminData.find((user) => user.id === row.user)?.last_name || 'Unknown'}</Td>

                                  <Td>{new Date(row.created_at).toLocaleDateString('fr-FR')}</Td>
                                  <Td>
                                    <Flex>
                                      <Stack direction='row' mr="3px">
                                        <Switch
                                          colorScheme='green'
                                          isChecked={row.etat}
                                          onChange={() => handleEtatClick(row.id, row.etat)}
                                        />
                                      </Stack>
                                      <Badge
                                        rounded={'lg'}
                                        colorScheme={!row.etat ? 'red' : 'green'}
                                      >
                                        {row.etat ? 'reglée' : 'encours'}
                                      </Badge>
                                    </Flex>
                                  </Td>
                                  <Td><Button
                                    size="sm"
                                    onClick={() => {
                                      setDeleteId(row.id);
                                      onOpen();
                                    }}
                                    colorScheme='blue'
                                    leftIcon={<BiDetail />}>
                                    Afficher
                                  </Button></Td>
                                  <Td>
                                    <Button
                                      size="sm"
                                      //onClick={onOpen}
                                      //onClick={() => handleDelete(row.id)}
                                      onClick={() => {
                                        setDeleteId(row.id);
                                        onOpenAlert();
                                      }}
                                      colorScheme='red'
                                      leftIcon={<AiFillDelete />}>
                                      Supprimer
                                    </Button></Td>
                                </Tr>
                              )
                            }

                          }

                        })}

                        {/* when there is no search data found */}
                        {filtereAdmindData().length === 0 && (
                          <Tr>
                            <Td colSpan={5}>Aucune ligne correspondante n'a été trouvée.</Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    {/* Pagination */}
                    <Flex justify="space-between" align="center" w="100%">
                      <Box flex="1">
                        <MyPagination
                          data={filtereAdmindData()}
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
            </TabPanel>
            <TabPanel>
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
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        mb={4}
                        sx={{
                          marginLeft: 'auto',
                        }}
                      />  </InputGroup>

                  </Flex>

                  {/* Plainte Table  */}
                  <TableContainer>
                    <Table variant='striped' colorScheme="gray">
                      <Thead>
                        <Tr>
                          <Th>Utilisateur</Th>
                          <Th>date</Th>
                          <Th>etat</Th>
                          <Th>contenu</Th>
                          <Th>Options</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(currentPage * pageSize, currentPage * pageSize + pageSize).map((row) => {
                          {
                            if (userData.find((user) => user.id === row.user)) {
                              return (
                                <Tr key={row.id}>
                                  <Td>{userData.find((user) => user.id === row.user)?.first_name || 'Unknown'} {userData.find((user) => user.id === row.user)?.last_name || 'Unknown'}</Td>

                                  <Td>{new Date(row.created_at).toLocaleDateString('fr-FR')}</Td>
                                  <Td>
                                    <Flex>
                                      <Stack direction='row' mr="3px">
                                        <Switch
                                          colorScheme='green'
                                          isChecked={row.etat}
                                          onChange={() => handleEtatClick(row.id, row.etat)}
                                        />
                                      </Stack>
                                      <Badge
                                        rounded={'lg'}
                                        colorScheme={!row.etat ? 'red' : 'green'}
                                      >
                                        {row.etat ? 'reglée' : 'encours'}
                                      </Badge>
                                    </Flex>
                                  </Td>
                                  <Td><Button
                                    size="sm"
                                    onClick={() => {
                                      setDeleteId(row.id);
                                      onOpen();
                                    }}
                                    colorScheme='blue'
                                    leftIcon={<BiDetail />}>
                                    Afficher
                                  </Button></Td>
                                  <Td>
                                    <Button
                                      size="sm"
                                      //onClick={onOpen}
                                      //onClick={() => handleDelete(row.id)}
                                      onClick={() => {
                                        setDeleteId(row.id);
                                        onOpenAlert();
                                      }}
                                      colorScheme='red'
                                      leftIcon={<AiFillDelete />}>
                                      Supprimer
                                    </Button></Td>
                                </Tr>
                              )
                            }

                          }

                        })}

                        {/* when there is no search data found */}
                        {filteredData().length === 0 && (
                          <Tr>
                            <Td colSpan={5}>Aucune ligne correspondante n'a été trouvée.</Td>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>


      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Supprimer le message
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
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>{dataDetail.sujet}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dataDetail.content}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>



  )
}


