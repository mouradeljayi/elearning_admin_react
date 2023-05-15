import {
  Flex,
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
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
  AlertIcon,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  Select,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  Icon,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosClient from "../../axios-client";
import { SearchIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import MyPagination from "../../components/MyPagination";
import { useNavigate } from "react-router-dom";
import { AiFillFileAdd } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsFillCloudArrowUpFill } from "react-icons/bs";

function TableDocs({ idChapitre }) {
  const [listDocs, setListDocs] = useState([]);
  const [listDocsEdit, setListDocsEdit] = useState([]);

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
      .get(`/docs/?search=${idChapitre}`)
      .then((res) => setListDocs(res.data.sort().reverse()));
  }, []);

  const toast = useToast();
  const deleteDocs = (id) => {
    axiosClient.delete(`/docs/${id}/`).then((res) => {
      setListDocs((prevData) => prevData.filter((row) => row.id !== id));
      toast({
        title: "Suppression",
        description: `Le Documment est suppprimé avec succès`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  const [changeModal, setChangeModal] = useState(true);

  const handleInputChange = (e, id) => {
    setName(e.target.value);
    axiosClient.patch(`/docs/${id}/`, {
      name,
    });
  };

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [lienPPT, setLienPPT] = useState();
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [etatMessage, setEtatMessage] = useState(false);

  const handleChangeInputFile = (e) => {
    setFile(e.target.files[0]);
  };
  console.log(file);

  const handleSplitNameFile = (f) => {
    const file = f.split("http://localhost:8000/media/uploads/docs/");
    console.log(file[1]);
    return file[1];
  };

  const addDocs = () => {
    if (type === "PDF") {
      if (!file) {
        setMessage("Veuillez remplir les champs");
        setEtatMessage(true);
        return;
      }
    }
    if (type === "PPT") {
      if (!lienPPT) {
        setMessage("Veuillez remplir les champs");
        setEtatMessage(true);
        return;
      }
    }
    if (!name || !type) {
      setMessage("Veuillez remplir les champs");
      setEtatMessage(true);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    if (type === "PPT") {
      formData.append("lienPPT", lienPPT);
    }
    if (type === "PDF") {
      formData.append("lienPPT", null);
      formData.append("file", file);
    }
    formData.append("chapitre", idChapitre);
    axiosClient.post("/docs/", formData)
      .then((response) => {
        setListDocs([...listDocs, response.data]);
        setEtatMessage(false);
        setType('')
        setLienPPT()
        setFile("");
        toast({
          title: "Ajout",
          description: `Le Document ${name} est ajouté avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });
    onClose();
    // window.location.reload()
  };

  const openModalUpdate = (id) => {
    setListDocsEdit([]);
    axiosClient.get(`/docs/${id}/`).then((res) => setListDocsEdit(res.data));
    onOpen();
  };

  const navigate = useNavigate();
  const modalUpdate = () => {
    if (!name || !type) {
      setMessage("Veuillez remplir les champs");
      setEtatMessage(true);
      return;
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('type', type)

    if (type === "PPT") {
      formData.append("lienPPT", lienPPT);       
      formData.append("file", ""); 
    }
    if (type === "PDF") {
      if(file) formData.append('file', file)
      formData.append("lienPPT", null);
    }
    // if (file) {
    //   formData.append('file', file)
    // }
    axiosClient
      .patch(`/docs/${deletedId}/`, formData)
      .then(() => {
        setListDocs((rows) =>
          rows.map((row) => {
            if (row.id === deletedId) {
              return {
                ...row,
                type: type,
                name: name,
              };
            }
            return row;
          })
        );
        setName("");
        setType("");
        setFile("")
        setEtatMessage(false);
        toast({
          description: `le Document est modifié avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
        setEtatMessage(false);
      });
    onClose();
    window.location.reload()
  };

  const handleFileChange = (e, id) => {
    setFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", file);
    axiosClient
      .patch(`/docs/${id}/`, formData)
      .then(() => {
        // setListDocs((rows) =>
        //   rows.map((row) => {
        //     if (row.id === listDocsEdit.id) {
        //       return {
        //         ...row,
        //         file: formData,
        //       };
        //     }
        //     return row;
        //   })
        // );
      })
      .catch((error) => console.log(error));
    // setImage(e.target.files[0])
    console.log(file);
  };

  const cancel = () => {
    onClose();
  };

  const [search, setSearch] = useState("");

  const keys = ["name", "type", "file"];

  //search method
  const filteredData = useCallback(() => {
    return listDocs.filter((row) => {
      return (
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.type.toLowerCase().includes(search.toLowerCase()) ||
        row.file.toLowerCase().includes(search.toLowerCase()) ||
        row.lienPPT.toLowerCase().includes(search.toLowerCase())

      );
    });
  }, [listDocs, search]);

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
            setChangeModal(true);
            onOpen();
          }}
          leftIcon={<AddIcon />}
        >
          Ajouter un document
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Titre</Th>
              <Th>Type</Th>
              <Th>Fichier</Th>
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
                    <Td>{val.type === 'PDF' ? handleSplitNameFile(val.file) : val.lienPPT}</Td>
                    <Td display="flex" justifyContent="">
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={10}
                        leftIcon={<EditIcon />}
                        onClick={() => {
                          setChangeModal(false);
                          setDeletedId(val.id);
                          openModalUpdate(val.id);
                          setName(val.name)
                          setType(val.type)
                          setLienPPT(val.lienPPT)
                          setType(val.type)
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
            {filteredData().length === 0 && (
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
              Supprimer le Document
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
                  deleteDocs(deletedId);
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

      {changeModal ? (
        //Modal for Add
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setEtatMessage(false);
            setFile("");
            setType('')
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ajout du document</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage && (
                <Alert status="error" rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              )}
              <Flex direction="column">
                <FormControl id="name" isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup borderColor="#E0E1E7">
                    <Input
                      type="text"
                      size="lg"
                      name="name"
                      placeholder="Entrer le titre du document"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mt="3" id="type" isRequired>
                  <FormLabel>Type Document</FormLabel>
                  <Select
                    placeholder="Type de Fichier"
                    name="type"
                    size="lg"
                    //onChange={(e) => handleinputchange(e, key)}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value={"PDF"}>PDF</option>
                    <option value={"PPT"}>PPT</option>
                  </Select>
                </FormControl>

                {type === "PPT" &&
                  <FormControl mt="3" id="lienPPT" isRequired>
                    <FormLabel>Lien PPT</FormLabel>
                    <InputGroup borderColor="#E0E1E7">
                      <Input
                        type="text"
                        size="lg"
                        name="lienPPT"
                        placeholder="Entrer le lien du Power Point"
                        onChange={(e) => setLienPPT(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>
                }

                {type === "PDF" &&

                  <FormControl mt="3" id="file" isRequired>
                    <FormLabel>Fichier</FormLabel>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      direction="column"
                      height="100px"
                      border="1px dashed"
                      position="relative"
                      borderColor="#2b6cb0"
                    >
                      <BsFillCloudArrowUpFill size="70px" color="#2b6cb0" />
                      <Text fontSize="lg" fontWeight="semibold" color="#2b6cb0">
                        Parcourir le fichier à télécharger
                      </Text>
                    </Flex>
                    <InputGroup borderColor="#E0E1E7" position="absolute" top="8">
                      <Input
                        opacity="0"
                        cursor="pointer"
                        type="file"
                        height="100px"
                        size="lg"
                        name="file"
                        onChange={handleChangeInputFile}
                        placeholder="Titre de Formation"
                        accept=".pdf"
                      />
                    </InputGroup>
                  </FormControl>}
                {file && (
                  <Tag
                    mt="10px"
                    size="xl"
                    variant="outline"
                    px="2px"
                    py="5px"
                    position="relative"
                    colorScheme="linkedin"
                  >
                    <AiFillFileAdd size="40px" />
                    <Flex direction="column" justifyContent="center">
                      <Text>
                        {file.name?.length > 40
                          ? `${file.name.substring(0, 35)}... .pdf`
                          : `${file.name}`}
                      </Text>
                      <Text fontSize="xs">
                        {Math.floor(file.size / 1000) < 1024
                          ? `${Math.floor(file.size / 1024)} KB`
                          : `${Math.floor(file.size / (1024 * 1024))} MB`}
                      </Text>
                    </Flex>
                    {/* <FaTimes
                      onClick={() => {
                        setFile("");
                      }}
                      color="red"
                      size="15px"
                      style={{
                        position: "absolute",
                        right: "4px",
                        cursor: "pointer",
                      }}
                    /> */}
                  </Tag>
                )}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={addDocs}>
                Ajouter
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        //Modal for Update
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setEtatMessage(false);
            // setName('')
            // setType('')
            setFile("");
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modification du document</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage && (
                <Alert status="error" rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              )}
              {listDocs.map((val, key) => {
                if (val.id === deletedId) {
                  return (
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
                      <FormControl mt="3" id="type" isRequired>
                        <FormLabel>Type Document</FormLabel>
                        <Select
                          placeholder="Type de Fichier"
                          name="type"
                          defaultValue={type}
                          size="lg"
                          //onChange={(e) => handleinputchange(e, key)}
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value={"PDF"}>PDF</option>
                          <option value={"PPT"}>PPT</option>
                        </Select>
                      </FormControl>

                      {type === "PPT" &&

                        <FormControl mt="3" id="lienPPT" isRequired>
                          <FormLabel>Lien PPT</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <Input
                              type="text"
                              size="lg"
                              name="lienPPT"
                              defaultValue={val.lienPPT === "null"? "":val.lienPPT}
                              placeholder="Entrer le lien du Power Point"
                              onChange={(e) => setLienPPT(e.target.value)}
                            />
                          </InputGroup>
                        </FormControl>
                      }

                      {type === "PDF" &&
                        <FormControl mt="3" id="file" isRequired>
                          <FormLabel>Fichier</FormLabel>
                          {val.file &&
                          <Tag
                            mb="10px"
                            size="xl"
                            w="100%"
                            variant="outline"
                            px="2px"
                            py="5px"
                            position="relative"
                            colorScheme="yellow"
                          >
                            <AiFillFileAdd size="40px" />
                            <Flex direction="column" justifyContent="center">
                              <Text>
                                {handleSplitNameFile(val.file).length > 30
                                  ? `${handleSplitNameFile(val.file).substring(
                                    0,
                                    35
                                  )}... .pdf`
                                  : `${handleSplitNameFile(val.file)}`}
                              </Text>
                            </Flex>
                            {/* <FaTimes
                          onClick={() => {
                            setFile("");
                          }}
                          color="red"
                          size="15px"
                          style={{
                            position: "absolute",
                            right: "4px",
                            cursor: "pointer",
                          }}
                        /> */}
                          </Tag>
                          }
                          <Flex
                            position="relative"
                            alignItems="center"
                            justifyContent="center"
                            direction="column"
                            height="100px"
                            border="1px dashed"
                            borderColor="#2b6cb0"
                          >
                            <BsFillCloudArrowUpFill size="70px" color="#2b6cb0" />
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color="#2b6cb0"
                            >
                              Parcourir le fichier à télécharger
                            </Text>
                            <InputGroup
                              borderColor="#E0E1E7"
                              position="absolute"
                              top="0"
                            >
                              <Input
                                opacity="0"
                                cursor="pointer"
                                type="file"
                                height="100px"
                                size="lg"
                                name="file"
                                onChange={handleChangeInputFile}
                                accept=".pdf"
                              />
                            </InputGroup>
                          </Flex>
                        </FormControl>
                      }

                      {file && (
                        <Tag
                          mt="10px"
                          size="xl"
                          variant="outline"
                          px="2px"
                          py="5px"
                          position="relative"
                          colorScheme="linkedin"
                        >
                          <AiFillFileAdd size="40px" />
                          <Flex direction="column" justifyContent="center">
                            <Text>
                              {file.name?.length > 30
                                ? `${file.name.substring(0, 33)}... .pdf`
                                : `${file.name}`}
                            </Text>
                            <Text fontSize="xs">
                              {Math.floor(file.size / 1000) < 1024
                                ? `${Math.floor(file.size / 1024)} KB`
                                : `${Math.floor(file.size / (1024 * 1024))} MB`}
                            </Text>
                          </Flex>
                          {/* <FaTimes
                            onClick={() => {
                              setFile("");
                            }}
                            color="red"
                            size="15px"
                            style={{
                              position: "absolute",
                              right: "5px",
                              cursor: "pointer",
                            }}
                          />
                          <FaCheck
                            onClick={() => {
                              const formData = new FormData()
                              formData.append('file', file)
                              axiosClient.patch(`/docs/${deletedId}/`, formData)
                                .then(() => {
                                  toast({
                                    description: `le Document est modifié avec succès`,
                                    status: "success",
                                    duration: 2000,
                                    isClosable: true,
                                    position: "bottom-right",
                                  });
                                })
                                .catch(() => console.log('Walooo ', formData))
                            }}
                            color="green"
                            size="15px"
                            style={{
                              position: "absolute",
                              right: "25px",
                              cursor: "pointer",
                            }}
                          /> */}
                        </Tag>
                      )}

                      {/* <FormControl mt="3" id="file" isRequired>
                        <FormLabel>Fichier</FormLabel>
                        <InputGroup borderColor="#E0E1E7">
                          <Input
                            type="file"
                            size="lg"
                            name="file"
                            onChange={(e) => handleFileChange(e, deletedId)}
                          />
                        </InputGroup>
                      </FormControl>
                      {file && (
                        <Tag
                          mt="10px"
                          size="lg"
                          variant="outline"
                          colorScheme="blue"
                          px="2px"
                          py="5px"
                        >
                          <AiFillFileAdd size="30px" />
                          <TagLabel ml="4px">{handleFileChange}</TagLabel>
                        </Tag>
                      )} */}
                    </Flex>
                  );
                }
              })}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={modalUpdate}
              >
                Modifier
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default TableDocs;