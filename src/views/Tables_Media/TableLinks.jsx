import {
  Box,
  InputLeftElement,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  ModalFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Select,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosClient from "../../axios-client";
import { SearchIcon, DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import MyPagination from "../../components/MyPagination";
import { useLocation } from "react-router-dom";


function TableLinks() {

  const location = useLocation();

  const [listLinks, setListLinks] = useState([]);
  const [listLinksEdit, setListLinksEdit] = useState([
    {
      name: "",
      link: "",
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [deletedId, setDeletedId] = useState();

  const cancelRef = React.useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onOpenAlert = () => {
    setIsAlertOpen(true);
  };

  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    axiosClient
      .get(`/link/?search=${location.state.idChapitre}`)
      .then((res) => setListLinks(res.data.sort().reverse()));
  }, []);

  const handleinputchange = (e) => {
    const { name, value } = e.target;
    const list = [...listLinks];
    list[name] = value;
    setListLinks(list);
  };

  const toast = useToast();
  const deleteLink = (id) => {
    axiosClient.delete(`/link/${id}/`)
      .then((res) => {
        setListLinks((prevData) => prevData.filter((row) => row.id !== id));
        toast({
          title: "Suppression",
          description: `Le Lien est suppprimé avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
  };

  const openModalUpdate = (id) => {
    setListLinksEdit([]);
    axiosClient
      .get(`/link/${id}/`)
      .then((res) => setListLinksEdit(res.data));
    onOpen();
  };


  const [changeModal, setChangeModal] = useState(true)

  const [name, setName] = useState();
  const [link, setLink] = useState();


  const [message, setMessage] = useState('')
  const [etatMessage, setEtatMessage] = useState(false)

  const isFormValid = (name, link) => {
    const linkRegex = /^([a-zA-Z0-9]+(\.[a-zA-Z]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)$/;

    if (!name || !link) {
      setMessage("Veuillez remplir les champs")
      setEtatMessage(true)
      return false;
    }

    if (!linkRegex.test(link)) {
      setMessage('Le lien est invalide.');

      setEtatMessage(true)
      return false;
    }

    return true;
  };

  const addLinks = () => {

    if (!isFormValid(name, link)) {
      return
    }

    // if (!name || !link) {
    //   setMessage("Veuillez remplir les champs")
    //   setEtatMessage(true)
    //   return;
    // }

    const formData = new FormData()
    formData.append("name", name)
    formData.append('type', "Link")
    formData.append('link', link)
    formData.append('chapitre', location.state.idChapitre)
    axiosClient.post("/link/", formData)
      .then((response) => {
        setListLinks([...listLinks, response.data]);
        setName('')
        setLink('')
        setEtatMessage(false)
        toast({
          title: 'Ajout',
          description: `Le Lien ${name} est ajouté avec succès`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      })
    onClose()
  }

  const modalUpdate = (id) => {

    if (!isFormValid(name, link)) {
      return
    }
    axiosClient.patch(`/link/${id}/`, {
      name,
      link,
    })
      .then(() => {
        setListLinks((rows) =>
          rows.map((row) => {
            if (row.id === id) {
              return {
                ...row,
                link,
                name,
              };
            }
            return row;
          })
        );
        setName('')
        setLink('')
        setEtatMessage(false)
        toast({
          description: `le Lien est modifié avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      });
    // window.location.reload()
    onClose();
  };

  const [search, setSearch] = useState("");

  const keys = ["name"];

  //search method
  const filteredData = useCallback(() => {
    return listLinks.filter((row) => {
      return row.name.includes(search) ||
        row.link.includes(search)
    });
  }, [listLinks, search]);

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
    <>
      <Flex justifyContent="space-between" m={0} alignItems="center">
        <InputGroup w="30%">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Recherche..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Button
          colorScheme="blue"
          size="md"
          onClick={() => {
            setChangeModal(true)
            onOpen()
          }}
          leftIcon={<AddIcon />}
        >
          Ajouter un lien
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Link</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData()
              .slice(
                currentPage * pageSize,
                currentPage * pageSize + pageSize
              )
              .map((val, key) => {
                return (
                  <Tr key={key}>
                    <Td>{val.name}</Td>
                    <Td>{val.type}</Td>
                    <Td>{val.link}</Td>
                    <Td display="flex" justifyContent="">
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={10}
                        leftIcon={<EditIcon />}
                        onClick={() => {
                          setChangeModal(false)
                          setDeletedId(val.id)
                          setName(val.name)
                          setLink(val.link)
                          openModalUpdate(val.id);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<DeleteIcon />}
                        onClick={() => {
                          setDeletedId(val.id);
                          onOpenAlert();
                        }}
                      >
                        Supprimer
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            {
              filteredData().length === 0 && (
                <Tr>
                  <Td colSpan={6}>
                    Aucune ligne correspondante n'a été trouvée.
                  </Td>
                </Tr>
              )}
          </Tbody>
        </Table>
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
      </TableContainer>
      {/* Alert for delete */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le Lien
            </AlertDialogHeader>

            <AlertDialogBody>
              êtes-vous sûr ? Vous ne pourrez pas annuler cette action
              ultérieurement.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  deleteLink(deletedId);
                  onCloseAlert();
                }}
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
        //Modal for Add
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
          onClose()
          setEtatMessage(false)
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ajout du lien</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage &&
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              }
              <Flex direction="column">
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup borderColor="#E0E1E7">
                    <Input
                      type="text"
                      size="lg"
                      name="name"
                      placeholder="Entrer le titre du lien"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt="3" id="link" isRequired>
                  <FormLabel>Lien</FormLabel>
                  <InputGroup borderColor="#E0E1E7">
                    <InputLeftAddon children='https://www.' />
                    <Input
                      type="text"
                      size="md"
                      name="link"
                      placeholder="Entrer le lien"
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={addLinks}>
                Ajouter
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        :

        //Modal for update
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
          onClose()
          setEtatMessage(false)
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modification du lien {deletedId} {name} {link}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage &&
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              }
              <Flex direction="column">
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup borderColor="#E0E1E7">
                    <Input
                      type="text"
                      size="lg"
                      name="name"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt="3" id="link" isRequired>
                  <FormLabel>Lien</FormLabel>
                  <InputGroup borderColor="#E0E1E7">
                    <Input
                      type="text"
                      size="lg"
                      name="link"
                      defaultValue={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => { modalUpdate(deletedId) }}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }

    </>
  );
}

export default TableLinks;
