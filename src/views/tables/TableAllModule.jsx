import React, { useEffect, useState, useCallback } from "react";
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
  useDisclosure,
  Modal,
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
  useToast,
  FormControl,
  Select,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  ModalFooter,
  Progress,
  Text,
  Tag,
  TagLabel,
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
  LinkIcon,
  RepeatIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { GoFileSubmodule } from "react-icons/go";
import { FiTrendingUp } from "react-icons/fi";
import { HiOutlineChat } from "react-icons/hi";
import { FaFolderOpen } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import MyPagination from "../../components/MyPagination";
import { useStateContext } from "../../context/ContextProvider";
import { AiFillPieChart, AiFillStar, AiOutlineStar } from "react-icons/ai";
import Chart from "react-apexcharts";

function TableModule() {
  // current user
  const { user, setUser } = useStateContext();

  // current user data
  // useEffect(() => {
  //     axiosClient.get('auth/user/')
  //         .then((res) => {
  //             setUser(res.data)
  //             console.log(res.data)
  //         })
  // }, [])

  const navigate = useNavigate();

  const location = useLocation();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const toast = useToast();

  const [titre, setTitre] = useState("");
  const [etat, setEtat] = useState(false);
  const [responsable, setResponsable] = useState();
  const [listModule, setListModule] = useState([]);
  const [listResponsable, setListResponsable] = useState([]);

  useEffect(() => {
    axiosClient.get("auth/user/").then((res) => {
      setUser(res.data);
      console.log(res.data);
    });
    axiosClient
      .get(`/module/?search=${location.state.idFormation}`)
      .then((res) => {
        setListModule(res.data.sort().reverse());
      });
    axiosClient
      .get("/responsables/")
      .then((res) => setListResponsable(res.data));
  }, [user.id]);

  console.log(responsable);

  console.log("data : ", listModule);

  const DeleteModule = (id, title) => {
    axiosClient.delete(`/module/${id}/`).then((response) => {
      setListModule((prevData) => prevData.filter((row) => row.id !== id));
      toast({
        title: "Suppression",
        description: `Le module ${title} est suppprimé avec succès`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
    onCloseAlert();
  };

  const editEtat = (id, etat, e) => {
    const formData = new FormData();
    formData.append("etat", !etat);
    axiosClient.patch(`/module/${id}/`, formData).then((res) => {
      setListModule((rows) =>
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
        description: `Le module est activé`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        description: `Le module est desactivé`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const openMesModules = () => {
    navigate("/list_modules", {
      state: {
        idFormation: location.state.idFormation,
        titreFormation: location.state.titreF,
        idRespo : user.id
      },
    });
  };

  const openAddModuleWithIdFormation = () => {
    navigate("/ajout_module", {
      state: {
        idFormation: location.state.idFormation,
        titreFormation: location.state.titreF,
      },
    });
  };

  const openEditModuleWithIdModule = (idM, titre, description) => {
    navigate("/modifier_module", {
      state: {
        idModule: idM,
        titre: titre,
        description: description,
        idFormation: location.state.idFormation,
        titreFormation: location.state.titreF,
      },
    });
  };

  const openListChapitreWidthIdModuleAndIdResponsableFromSuperAdmin = (
    idM,
    titreM,
    userId
  ) => {
    navigate("/list_chapiter", {
      state: {
        idModule: idM,
        titreModule: titreM,
        userId: userId,
      },
    });
  };
  const openListChapitreWidthIdModuleAndIdResponsable = (idM, titreM) => {
    navigate("/list_chapiter", {
      state: {
        idModule: idM,
        titreModule: titreM,
        userId: user.id,
      },
    });
  };

  const openGestionAccesModule = (idM, titre) => {
    navigate("/gestionAcces", {
      state: {
        idModule: idM,
        titre: titre,
      },
    });
  };

  const openAjouterunTest = (idM, titre) => {
    navigate("/test", {
      state: {
        idModule: idM,
        titre: titre,
      },
    });
  };

  const [search, setSearch] = useState("");

  const keys = ["titre", "description"];

  //search method
  const filteredData = useCallback(() => {
    return listModule.filter((row) => {
      return (
        row.titre.toLowerCase().includes(search.toLowerCase()) ||
        row.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [listModule, search]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = React.useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onOpenAlert = () => {
    setIsAlertOpen(true);
  };

  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };

  console.log("id formation : ", location.state.idFormation);

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

  //Statistics
  const [rating1, setRating1] = useState();
  const [rating2, setRating2] = useState();
  const [rating3, setRating3] = useState();
  const [rating4, setRating4] = useState();
  const [rating5, setRating5] = useState();

  const getRatingModule = (id) => {
    axiosClient
      .get(`/rating/getRatingsByModule/?idModule=${id}`)
      .then((res) => setRating1(res.data.filter((e) => e.rating === 1).length));
    axiosClient
      .get(`/rating/getRatingsByModule/?idModule=${id}`)
      .then((res) => setRating2(res.data.filter((e) => e.rating === 2).length));
    axiosClient
      .get(`/rating/getRatingsByModule/?idModule=${id}`)
      .then((res) => setRating3(res.data.filter((e) => e.rating === 3).length));
    axiosClient
      .get(`/rating/getRatingsByModule/?idModule=${id}`)
      .then((res) => setRating4(res.data.filter((e) => e.rating === 4).length));
    axiosClient
      .get(`/rating/getRatingsByModule/?idModule=${id}`)
      .then((res) => setRating5(res.data.filter((e) => e.rating === 5).length));
    console.log(
      rating1,
      " ",
      rating2,
      " ",
      rating3,
      " ",
      rating4,
      " ",
      rating5
    );
  };

  console.log(rating1, " ", rating2, " ", rating3, " ", rating4, " ", rating5);

  const state = {
    options: {},
    series: [rating1, rating2, rating3, rating4, rating5],
    labels: ["Apple", "Mango", "Orange", "Watermelon"],
  };

  return (
    <Box mt="5px">
      <Box mb={5} w="90%">
        <Heading
          bgGradient="linear(to-l, #ffd140, #2b6cb0)"
          bgClip="text"
          fontSize={{ base: "2xl", sm: "3xl" }}
        >
          Liste des Modules
        </Heading>
      </Box>
      <Flex justifyContent="end" alignItems="center">
        {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") ? (
          <Button
            colorScheme="blue"
            size="md"
            onClick={() => openAddModuleWithIdFormation()}
            leftIcon={<AddIcon />}
          >
            Ajouter un module
          </Button>
        ) : user.role === "RESPO" ? (
          listModule.length > 0 && (
            <Button
              colorScheme="blue"
              size="md"
              onClick={openMesModules}
              leftIcon={<GoFileSubmodule />}
            >
              Mes modules
            </Button>
          )
        ) : null}
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
          <Table
            variant="simple"
            css={{
              "&::-webkit-scrollbar": {
                width: "11px",
                height: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#10316B",
                borderRadius: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "gray.50",
              },
            }}
          >
            <Thead>
              <Tr>
                <Th>image</Th>
                <Th>titre</Th>
                <Th>Description</Th>
                <Th>Etat</Th>
                {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") && (
                  <>
                    <Th>Responsable</Th>
                  </>
                )}
                {(user.role === "SUPERADMIN" || user.role === "MASTER") && (
                  <>
                    <Th>Chapitres</Th>
                    <Th>Accès</Th>
                    <Th>Tests</Th>
                    <Th>FeedBack</Th>
                    <Th>Statistiques</Th>
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
                        {val.description?.length > 25
                          ? `${val.description.substring(0, 25)}...`
                          : val.description}
                      </Td>
                      <Td>
                        {(user.role === "SUPERADMIN" || user.role === "MASTER") && (
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
                      {(user.role === "SUPERADMIN" || user.role === "MASTER" ||
                        user.role === "ADMIN") && (
                          <Td>
                            {listResponsable.map((v, k) => {
                              if (v.id === val.responsable) {
                                return (
                                  <Tag
                                    size="lg"
                                    colorScheme={
                                      v.role === "SUPERADMIN"
                                        ? "teal"
                                        : "messenger"
                                    }
                                    borderRadius="full"
                                  >
                                    <Avatar
                                      src={v.image}
                                      size="xs"
                                      name="Segun Adebayo"
                                      ml={-1}
                                      mr={2}
                                    />
                                    <TagLabel>
                                      {v.first_name} {v.last_name}
                                    </TagLabel>
                                  </Tag>
                                );
                              }
                            })}
                          </Td>
                        )}
                      {(user.role === "SUPERADMIN" || user.role === "MASTER") && (
                        <>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<FaFolderOpen />}
                              onClick={() => {
                                if (user.role === "SUPERADMIN" || user.role === "MASTER") {
                                  openListChapitreWidthIdModuleAndIdResponsableFromSuperAdmin(
                                    val.id,
                                    val.titre,
                                    val.responsable
                                  );
                                } else {
                                  openListChapitreWidthIdModuleAndIdResponsable(
                                    val.id,
                                    val.titre
                                  );
                                }
                              }}
                            >
                              Chapitre
                            </Button>
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="facebook"
                              leftIcon={<BsShieldLockFill />}
                              onClick={() =>
                                openGestionAccesModule(val.id, val.titre)
                              }
                            >
                              Accès
                            </Button>
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="purple"
                              leftIcon={<FiTrendingUp />}
                              //onClick={() => alert(`Hello : id_Responsable=${user.id} & id_Formation=${location.state.idFormation} & id_Module=${val.id}`)}
                              onClick={() =>
                                openAjouterunTest(val.id, val.titre)
                              }
                            >
                              Test
                            </Button>
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="teal"
                              leftIcon={<HiOutlineChat fontSize={18} />}
                              onClick={() => {
                                navigate("/list_feedback", {
                                  state: {
                                    idModule: val.id,
                                  },
                                });
                              }}
                            >
                              FeedBack
                            </Button>
                          </Td>
                          <Td>
                            <Button
                              leftIcon={<AiFillPieChart fontSize={18} />}
                              colorScheme="teal"
                              variant="outline"
                              onClick={() => {
                                getRatingModule(val.id);
                                onOpen();
                              }}
                            >
                              Statistiques
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
                                  onClick={() =>
                                    openEditModuleWithIdModule(
                                      val.id,
                                      val.titre,
                                      val.description
                                    )
                                  }
                                >
                                  Modifier
                                </MenuItem>
                                <MenuItem
                                  icon={<DeleteIcon />}
                                  onClick={() => {
                                    setDeleteId(val.id);
                                    setTitre(val.titre);
                                    onOpenAlert();
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
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer Module
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
                onClick={() => DeleteModule(deleteId, titre)}
                colorScheme="red"
                ml={3}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Statistiques d'évaluation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* <div className="donut">
                            <Chart
                                options={state.options}
                                series={state.series}
                                type="pie"
                                width="380"
                            />
                        </div> */}
            <Flex direction="column" align="center">
              <Flex>
                <Flex width="100px" mr="20px">
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                </Flex>
                {/* <Progress m="4px" colorScheme='yellow' rounded="full" size='md' value={20} w="60%" /> */}
                <span>{rating5}</span>
              </Flex>
              <Flex>
                <Flex width="100px" mr="20px">
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                </Flex>
                {/* <Progress m="4px" colorScheme='yellow' rounded="full" size='md' value={20} w="60%" /> */}
                <span>{rating4}</span>
              </Flex>
              <Flex>
                <Flex width="100px" mr="20px">
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                </Flex>
                {/* <Progress m="4px" colorScheme='yellow' rounded="full" size='md' value={20} w="60%" /> */}
                <span>{rating3}</span>
              </Flex>
              <Flex>
                <Flex width="100px" mr="20px">
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                </Flex>
                {/* <Progress m="4px" colorScheme='yellow' rounded="full" size='md' value={20} w="60%" /> */}
                <span>{rating2}</span>
              </Flex>
              <Flex>
                <Flex width="100px" mr="20px">
                  <AiFillStar color="#d69e2e" fontSize="20px" />
                </Flex>
                {/* <Progress m="4px" colorScheme='yellow' rounded="full" size='md' value={20} w="60%" /> */}
                <span>{rating1}</span>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TableModule;
