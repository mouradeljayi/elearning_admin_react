import {
  Box,
  InputLeftElement,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  Alert,
  AlertIcon,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Progress,
  Text,
  Tag,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosClient from "../../axios-client";
import { SearchIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import MyPagination from "../../components/MyPagination";
import { useLocation } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { AiFillFileAdd } from "react-icons/ai";
import { BsFillCloudArrowUpFill } from "react-icons/bs";

function TableVideos({ idChapitre }) {

  const location = useLocation();

  const [listVideos, setListVideos] = useState([]);
  const [listVideosEdit, setListVideosEdit] = useState([]);

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

  console.log("id chapitre est :", location.state.idChapitre);

  useEffect(() => {
    axiosClient
      .get(`/videos/?search=${location.state.idChapitre}`)
      .then((res) => setListVideos(res.data.sort().reverse()));
  }, []);

  const [name, setName] = useState();
  const [file, setFile] = useState()

  const [message, setMessage] = useState('')
  const [etatMessage, setEtatMessage] = useState(false)

  const handleChangeVideoFile = (e) => {
    setFile(e.target.files[0])
  }
  console.log(file);

  const handleSplitNameFile = (f) => {
    const file = f.split("http://localhost:8000/media/uploads/videos/");
    console.log(file[1]);
    return file[1];
  };

  const [uploaded, setUploaded] = useState(null)
  const addVideo = () => {

    if (!name || !file) {
      setMessage("Veuillez remplir les champs")
      setEtatMessage(true)
      return;
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('type', "Video")
    formData.append('file', file)
    formData.append('chapitre', location.state.idChapitre)
    axiosClient.post('/videos/', formData, {
      onUploadProgress: (data) => {
        setUploaded(Math.round((data.loaded / data.total) * 100))
      }
    })
      .then((response) => {
        setListVideos([...listVideos, response.data])
        setEtatMessage(false)
        setFile("");
        toast({
          title: 'Ajout',
          description: `La video ${name} est ajouté avec succès`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        })

        setUploaded(null)
        window.location.reload()
      })
      .catch((error) => console.log(error));
  }

  const toast = useToast();
  const deleteVideo = (id) => {
    axiosClient.delete(`/videos/${id}/`).then(() => {
      setListVideos((prevData) => prevData.filter((row) => row.id !== id));
      toast({
        title: "Suppression",
        description: `La Vidéo est suppprimée avec succès`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };


  const [changeModal, setChangeModal] = useState(true)

  const openModalUpdate = (id) => {
    setListVideosEdit([]);
    axiosClient
      .get(`/videos/${id}/`)
      .then((res) => setListVideosEdit(res.data));
    onOpen();
  };

  const modalUpdate = () => {
    if (!name) {
      setMessage("Veuillez remplir les champs")
      setEtatMessage(true)
      return;
    }

    const formData = new FormData()
    formData.append('name', name)
    if (file) {
      formData.append('file', file)
    }
    axiosClient.patch(`/videos/${deletedId}/`, formData,
      {
        onUploadProgress: (data) => {
          setUploaded(Math.round((data.loaded / data.total) * 100))
        }
      })
      .then(() => {
        setListVideos((rows) =>
          rows.map((row) => {
            if (row.id === deletedId) {
              return {
                ...row,
                name: name
              };
            }
            return row;
          })
        );
        setName('')
        setFile("")
        toast({
          description: `la Vidéo est modifiée avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });

        setUploaded(null)
        onClose()
        window.location.reload()
      });

    // console.log('my inputs : ',name,' ',file);

  };

  const handleFileChange = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axiosClient
      .patch(`/videos/${listVideosEdit.id}/`, formData, {
        onUploadProgress: (data) => {
          setUploaded(Math.round((data.loaded / data.total) * 100))
        }
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
    // setImage(e.target.files[0])
  };
  const cancel = () => {
    onClose();
  };

  const [search, setSearch] = useState("");

  const keys = ["name", "type", "file"];

  //search method
  const filteredData = useCallback(() => {
    return listVideos.filter((row) => {
      return row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.file.toLowerCase().includes(search.toLowerCase())
    });
  }, [listVideos, search]);

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

  console.log("Props id module ", location.state.idChapitre)

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
            setName('')
            setFile('')
            onOpen()
          }}
          leftIcon={<AddIcon />}
        >
          Ajouter une vidéo
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>File</Th>
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
                    <Td>
                      {
                        val.file.split(
                          "http://localhost:8000/media/uploads/videos/"
                        )
                        //.slice(1,3)
                      }
                    </Td>
                    <Td display="flex" justifyContent="">
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={10}
                        leftIcon={<EditIcon />}
                        onClick={() => {
                          setChangeModal(false)
                          setDeletedId(val.id);
                          setName(val.name)
                          openModalUpdate(val.id);
                          setUploaded(null)
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
                  deleteVideo(deletedId);
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
          setFile("")
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ajout du video</ModalHeader>
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
                      placeholder="Entrer le titre de la vidéo"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
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
                      accept="video/*"
                      onChange={handleChangeVideoFile}
                    />
                  </InputGroup>
                </FormControl>

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
                        {Math.floor(file.size / (1024 * 1024)) < 1024
                          ? `${Math.floor(file.size / (1024 * 1024))} MB`
                          : `${Math.floor(file.size / (1024 * 1024 * 1024))} GB`}

                        {uploaded === 0 ? null : <Progress mt="1" colorScheme="linkedin" w="28em" rounded="lg" h="5px" size="xs" hasStripe value={uploaded} />}
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
              <Button colorScheme="blue" onClick={addVideo}>
                Ajouter
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal> :

        //Modal for update
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => {
          onClose()
          setEtatMessage(false)
          setFile("")
          setName('')
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modification du video</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {etatMessage &&
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              }
              {listVideos.map((val, key) => {
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
                            defaultValue={val.name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl mt="3" id="file" isRequired>
                        <FormLabel>Fichier</FormLabel>
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
                          {/* 
                          <FaTimes
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
                        /> 
                        */}
                        </Tag>
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
                              accept="video/*"
                              // defaultValue={val.file}
                              onChange={handleChangeVideoFile}
                            />
                          </InputGroup>
                        </Flex>
                      </FormControl>


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
                              {Math.floor(file.size / (1024 * 1024)) < 1024
                                ? `${Math.floor(file.size / (1024 * 1024))} MB`
                                : `${Math.floor(file.size / (1024 * 1024 * 1024))} GB`}

                              {uploaded === 0 ? null : <Progress mt="1" colorScheme="linkedin" w="28em" rounded="lg" h="5px" size="xs" hasStripe value={uploaded} />}
                            </Text>
                          </Flex>
                          {/* <FaTimes
                            onClick={() => {
                              // setFile("");
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
                              axiosClient.patch(`/videos/${deletedId}/`, formData, {
                                onUploadProgress: (data) => {
                                  setUploaded(Math.round((data.loaded / data.total) * 100))
                                }
                              })
                                .then(() => {
                                  toast({
                                    description: `la video est modifié avec succès`,
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
                    </Flex>
                  );
                }
              })}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={() => modalUpdate(deletedId)}>
                Modifier
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }


    </>
  );
}

export default TableVideos;
