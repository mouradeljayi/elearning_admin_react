import React, { useEffect, useState } from "react";
import {
  Stack,
  Heading,
  Flex,
  useColorModeValue,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Container,
  TableContainer,
  WrapItem,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Badge,
  Switch,
  EditableTextarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  ExternalLinkIcon,
  LinkIcon,
  RepeatIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { FiTrendingUp } from "react-icons/fi";
import { MdPermMedia } from "react-icons/md"
import { BsShieldLockFill } from "react-icons/bs"
import { useMediaQuery } from "@chakra-ui/react";
import axiosClient from "../../axios-client";
import { useNavigate, useLocation } from "react-router-dom";
import MyPagination from "../../components/MyPagination";

function TableChapitre() {

  const [listChapitre, setListChapitre] = useState([])

  useEffect(() => {
    axiosClient
      .get(`/chapitre/getChapitreById/?idModule=${location.state.idModule}`)
      .then((res) => {
        setListChapitre(res.data.sort().reverse())
      });
  }, [])


  const navigate = useNavigate();

  const location = useLocation();


  console.log(location.state.idModule, " ", location.state.titreModule, " ", location.state.userId)

  const [search, setSearch] = useState("");
  const keys = ["name"];

  const toast = useToast()
  const [message, setMessage] = useState('')
  const [etatMessage, setEtatMessage] = useState(false)

  //Modal
  const [changeModal, setChangeModal] = useState(true)

  //Ajout de chapitre
  const [name, setName] = useState('')
  const AjoutChapitre = () => {
    if (!name) {
      setMessage("Veuillez remplir le titre")
      setEtatMessage(true)
      return;
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("module", location.state.idModule)
    formData.append("responsable", location.state.userId)
    axiosClient.post('/chapitre/', formData)
      .then((response) => {
        setListChapitre([...listChapitre, response.data]);
        setName('')
        setEtatMessage(false)
        toast({
          title: 'Ajout',
          description: `Le Chapitre ${name} est ajouté avec succès`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
    onClose()
  }



  const [id, setId] = useState(null);
  const [openAlert, setOpenAlert] = useState(false)
  const cancelRef = React.useRef();
  //delete chapitre
  const DeleteChapitre = (id, title) => {
    axiosClient.delete(`/chapitre/${id}/`)
      .then(() => {
        setListChapitre(data => data.filter(e => e.id !== id))
        toast({
          title: 'Suppression',
          description: `Le Chapitre ${name} est supprimé avec succès`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
    setOpenAlert(false)
  }

  //update chapitre
  const updateChapitre = (id) => {
    if (!name) {
      setMessage("Veuillez remplir le titre")
      setEtatMessage(true)
      return;
    }
    axiosClient.patch(`/chapitre/${id}/`, {
      name: name
    }).then((response) => {
      setListChapitre(rows => rows.map(row => {
        if (row.id === id) {
          return {
            ...row,
            name,
          }
        }
        return row
      }
      ))
      toast({
        title: 'Modification',
        description: `Le Chapitre ${name} est modifié avec succès`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setEtatMessage(false)
    })

    onClose()
  }

  const openListMediaWidthIdModule = (idC) => {
    navigate("/list_medias", {
      state: {
        idChapitre: idC,
      },
    });
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
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
    <Box mt='5px'>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
          Liste des Chapitres
        </Heading>
      </Box>
      <Flex justifyContent="end" alignItems="center">
        <Button
          colorScheme="blue"
          size="md"
          leftIcon={<AddIcon />}
          onClick={() => {
            setChangeModal(true)
            onOpen()
          }}
        >
          Ajouter un chapitre
        </Button>
      </Flex>
      <Stack
        w={"full"}
        maxW="full"
        bg={useColorModeValue("white", "gray.700")}
        rounded={"lg"}
        p={6}
        my={5}
      >
        <Flex justifyContent="end" alignItems="center">
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
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Module</Th>
                <Th>Media</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {listChapitre
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : keys.some((key) =>
                      item[key].toLowerCase().includes(search)
                    );
                })
                .slice(currentPage * pageSize, currentPage * pageSize + pageSize)
                .map((val, key) => {
                  return (
                    <Tr key={key}>
                      <Td>{val.name}</Td>
                      <Td>{location.state.titreModule}</Td>
                      {/* <Td>
                         <Switch
                           size="md"
                           colorScheme="green"
                           isChecked={val.etat}
                           onChange={() => {
                             editEtat(val.id, val.etat)
                             setEtat(!val.etat)
                           }}
                         />
                         <Badge
                           rounded="lg"
                           colorScheme={val.etat ? "green" : "red"}
                         >
                           {val.etat ? "Activé" : "Desactivé"}
                         </Badge>
                       </Td> */}
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<MdPermMedia />}
                          onClick={() => openListMediaWidthIdModule(val.id)}
                        >
                          Média
                        </Button>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<CiMenuKebab />}
                            variant="outline"
                            _hover="none"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<EditIcon />}
                              onClick={() => {
                                setChangeModal(false)
                                setName(val.name)
                                setId(val.id);
                                //   openEditModuleWithIdModule(
                                //     val.id,
                                //     val.titre,
                                //     val.description
                                //   )
                                onOpen();
                              }}
                            >
                              Modifier
                            </MenuItem>
                            <MenuItem
                              icon={<DeleteIcon />}
                              onClick={() => {
                                setOpenAlert(true)
                                setId(val.id);
                                setName(val.titre)
                              }}
                            >
                              Supprimer
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })}
              {listChapitre.length === 0 && (
                <Tr>
                  <Td colSpan={6}>
                    Aucune ligne correspondante n'a été trouvée.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          {/* Pagination */}
          <Flex justify="space-between" align="center" w="100%">
            <Box flex="1">
              <MyPagination
                data={listChapitre}
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
          </Flex>        </TableContainer>
      </Stack>

      <AlertDialog
        isOpen={openAlert}
        //leastDestructiveRef={cancelRef}
        onClose={() => setOpenAlert(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer chapitre
            </AlertDialogHeader>

            <AlertDialogBody>
              êtes-vous sûr ? Vous ne pourrez pas annuler cette action
              ultérieurement.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setOpenAlert(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => DeleteChapitre(id, name)}
                colorScheme="red"
                ml={3}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>


      {changeModal ?
        //Modal d'ajout
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
          onClose()
          setEtatMessage(false)
        }}>
          <ModalOverlay />

          <ModalContent>

            <ModalHeader>Ajout de Chapitre</ModalHeader>

            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage &&
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              }
              <FormControl isRequired>
                <FormLabel>Nom de chapitre</FormLabel>
                <Input name="name" onChange={e => setName(e.target.value)} placeholder='Nom de chapitre...' />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' onClick={() => {
                AjoutChapitre()
              }}
              >
                Ajouter
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        :
        //Modal de modifaction
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
          onClose()
          setEtatMessage(false)
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modification de Chapitre</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage &&
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              }
              <FormControl isRequired>
                <FormLabel>Nom de chapitre</FormLabel>
                <Input name="name" defaultValue={name} onChange={e => setName(e.target.value)} placeholder='Nom de chapitre...' />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' onClick={() => {
                updateChapitre(id)
              }}>
                Modifier
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }


    </Box>
  )
}

export default TableChapitre