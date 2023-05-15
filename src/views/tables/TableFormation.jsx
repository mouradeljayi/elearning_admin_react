import React, { useEffect, useState, useCallback } from "react";
import {
  Stack,
  useColorModeValue,
  Flex,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Heading,
  Td,
  Button,
  Container,
  TableContainer,
  WrapItem,
  Avatar,
  Badge,
  Switch,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import axiosClient from "../../axios-client";
import {
  SearchIcon,
  AddIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { MdFolderCopy } from "react-icons/md";
import { GoFileSubmodule } from "react-icons/go";
import { GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";
import Pagination from "../../components/Pagination";
import { color } from "framer-motion";
import MyPagination from "../../components/MyPagination";
import { useStateContext } from "../../context/ContextProvider";

function TableFormation() {
  // current user
  const { user, setUser } = useStateContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = React.useRef();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const toast = useToast();

  const [listFormation, setListFormation] = useState([]);

  const [titre, setTitre] = useState("");
  const [etat, setEtat] = useState(false);

  const getAllFormation = useCallback(() => {
    axiosClient
      .get(`/formation/`)
      .then((res) => setListFormation(res.data.sort().reverse()));
  }, [listFormation]);

  useEffect(() => {
    axiosClient.get("auth/user/").then((res) => {
      setUser(res.data);
      console.log(res.data);
    });

    axiosClient
      .get(`/formation/`)
      .then((res) => setListFormation(res.data.sort().reverse()));
  }, []);

  // const getAllFormation = useCallback(() => {

  //   axiosClient.get(`/formation/`).then((res) => setListFormation(res.data));
  // }, [listFormation]);

  const DeleteFormation = (id, title) => {
    axiosClient.delete(`/formation/${id}/`).then((response) => {
      setListFormation((prevData) => prevData.filter((row) => row.id !== id));
      toast({
        title: "Suppression",
        description: `La formation ${title} est suppprimée avec succès`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
    onClose();
  };

  const editEtat = (id, etat, e) => {
    const formData = new FormData();
    formData.append("etat", !etat);
    axiosClient.patch(`/formation/${id}/`, formData).then((res) => {
      setListFormation((rows) =>
        rows.map((row) => {
          if (row.id === id) {
            return {
              ...row,
              etat: !etat,
            };
          }
          return row;
        })
      );
    });
    if (!etat) {
      toast({
        description: `La formation est activée`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        description: `La formation est desactivée`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const navigate = useNavigate();

  function openModuleWithIdFormation(idF, titre) {
    navigate("/list_allModules", {
      state: {
        idFormation: idF,
        titreF: titre,
      },
    });
  }

  const editFormation = (idF, titre, image, description) => {
    navigate("/modifier_formation", {
      state: {
        idFormation: idF,
        titre: titre,
        image: image,
        description: description,
      },
    });
  };

  const [search, setSearch] = useState("");

  const keys = ["titre", "description"];

  //search method
  const filteredData = useCallback(() => {
    return listFormation.filter((row) => {
      return (
        row.titre.toLowerCase().includes(search.toLowerCase()) ||
        row.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [listFormation, search]);

  
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
    <Box mt="5px">
      <Box mb={5} w="90%">
        <Heading
          bgGradient="linear(to-l, #ffd140, #2b6cb0)"
          bgClip="text"
          fontSize={{ base: "2xl", sm: "3xl" }}
        >
          Liste des formations
        </Heading>
      </Box>
      <Flex justifyContent="end" alignItems="center">
        {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
          <Button
            colorScheme="blue"
            size="md"
            onClick={() => navigate("/nouvelle_formation")}
            leftIcon={<AddIcon />}
          >
            Ajouter une formation
          </Button>
        )}
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
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>image</Th>
                <Th>titre</Th>
                <Th>Description</Th>
                <Th>Etat</Th>
                <Th>Module</Th>
                {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
                  <>
                    <Th>Action</Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {filteredData()
                .slice(
                  currentPage * pageSize,
                  currentPage * pageSize + pageSize
                )
                // .filter((item) => {
                //   return search.toLowerCase() === ""
                //     ? item
                //     : keys.some((key) =>
                //       item[key].toLowerCase().includes(search)
                //     );
                // })
                .map((val, key) => {
                  return (
                    <Tr key={key}>
                      <Td>
                        <WrapItem>
                          <Avatar name="Dan Abrahmov" src={val.image} />
                        </WrapItem>
                      </Td>
                      <Td>{val.titre}</Td>
                      <Td>
                        {val.description?.length > 20
                          ? `${val.description.substring(0, 40)}...`
                          : val.description}
                      </Td>
                      <Td>
                        {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
                          <Switch
                            size="md"
                            colorScheme="green"
                            isChecked={val.etat}
                            onChange={() => {
                              editEtat(val.id, val.etat);
                              setEtat(!val.etat);
                            }}
                          />
                        )}

                        <Badge
                          rounded="lg"
                          colorScheme={val.etat ? "green" : "red"}
                        >
                          {val.etat ? "Activé" : "Desactivé"}
                        </Badge>
                      </Td>
                      <Td>
                        {val.etat && (
                          <Button
                            colorScheme="blue"
                            mr={10}
                            leftIcon={<GoFileSubmodule />}
                            onClick={() =>
                              openModuleWithIdFormation(val.id, val.titre)
                            }
                          >
                            Module
                          </Button>
                        )}
                        {!val.etat && user.role === "RESPO" && (
                          <Button
                            colorScheme="red"
                            mr={10}
                            leftIcon={<GoFileSubmodule />}
                            onClick={() =>
                              openModuleWithIdFormation(val.id, val.titre)
                            }
                            isDisabled
                          >
                            Module
                          </Button>
                        )}
                        {!val.etat && (user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
                          <Button
                            colorScheme="red"
                            mr={10}
                            leftIcon={<GoFileSubmodule />}
                            onClick={() =>
                              openModuleWithIdFormation(val.id, val.titre)
                            }
                          >
                            Module
                          </Button>
                        )}
                      </Td>
                      {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
                        <>
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
                                  onClick={() =>
                                    editFormation(
                                      val.id,
                                      val.titre,
                                      val.image,
                                      val.description
                                    )
                                  }
                                >
                                  Modifier
                                </MenuItem>
                                <MenuItem
                                  icon={<DeleteIcon />}
                                  // onClick={() => DeleteFormation(val.id)}
                                  onClick={() => {
                                    setDeleteId(val.id);
                                    setTitre(val.titre);
                                    onOpen();
                                  }}
                                >
                                  Supprimer
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </>
                      )}
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
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer formation
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
                onClick={() => DeleteFormation(deleteId, titre)}
                colorScheme="red"
                ml={3}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default TableFormation;
