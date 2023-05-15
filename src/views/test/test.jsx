import Ajouter from './Ajouterletext.jsx'
import { useStateContext } from '../../context/ContextProvider';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
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
import {
  Menu, IconButton,
  MenuButton,
  MenuList,
  Heading,
  MenuItem, Stack, Modal, useColorModeValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, Flex, ModalBody, Box, Text, Input, FormControl, FormLabel, Select, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Tabs, TabList, Tab, TabPanel, TabPanels,
} from '@chakra-ui/react';
const ChapitreList = () => {
  const { fetchDataStat, getModule } = useStateContext();
  const [gettest, setgettest] = useState([]);
  const location = useLocation();
  const [getChapitre, setgetChapitre] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/chapitre/?search=${location.state.idModule}`);
        setgetChapitre(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

  }, [location.state.idModule]);

  console.log(getChapitre);
  useEffect(() => {
    fetchDataStat();
    getModule();
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/test/?search=${location.state.idModule}`);
        setgettest(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTest()
  }, []);
  console.log(gettest)
  console.log(location.state.idModule)
  const [deleteId, setDeleteId] = useState(null);
  const [difficulter, setdifficulter] = useState('');
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const handleDeleteClick = (id,difficulter) => {
    setDeleteId(id);
    setdifficulter(difficulter)
    setIsDeleteAlertOpen(true);
  };
  const handleDeleteConfirm = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/test/${id}/`);
      window.location.reload()
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error(error);
    }

  };
  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [moduleData, setModuleData] = useState(null);
  const handleEditClick = async (data) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/test/${data.id}/`);
      setModuleData(response.data);
    } catch (error) {
      console.error(error);
    }
    setIsEditOpen(true);
  };
  console.log(moduleData)
  const handleEditClose = () => {
    setIsEditOpen(false);
    setModuleData(null);
  };
  const handleEditSave = async (editedData) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/test/${editedData.id}/`, editedData);
      setModuleData(response.data);
      setIsEditOpen(false);
      window.location.reload()
    } catch (error) {
      console.log(error.config.data);
      // Handle the error here
    }
  };
  const handleSelectChange = (questionIndex, answerIndex, value) => {
    const newModuleData = { ...moduleData };
    const question = { ...newModuleData.question[questionIndex] };
    const answer = { ...question.reponses[answerIndex] };
    answer.etat = value === "true";
    question.reponses[answerIndex] = answer;
    newModuleData.question[questionIndex] = question;
    setModuleData(newModuleData);
  };
  const addQuestion = () => {
    setModuleData({
      ...moduleData,
      nombredequestion: moduleData.nombredequestion + 1,
      question: [
        ...moduleData.question,
        {
          question: '',
          explicationdelaquestion: '',
          reponses: [{ reponse: '', etat: false }],
        },
      ],
    });
  };


  const deleteQuestion = (index) => {
    setModuleData({
      ...moduleData,
      question: moduleData.question.filter((_, i) => i !== index)
    });
  };
  const addAnswer = (questionIndex) => {
    setModuleData({
      ...moduleData,
      question: moduleData.question.map((q, index) => {
        if (index === questionIndex) {
          return {
            ...q,
            reponses: [...q.reponses, { reponse: '', etat: false }]
          };
        }
        return q;
      })
    });
  };
  const deleteAnswer = (questionIndex, answerIndex) => {
    setModuleData({
      ...moduleData,
      question: moduleData.question.map((q, index) => {
        if (index === questionIndex) {
          return {
            ...q,
            reponses: q.reponses.filter((_, i) => i !== answerIndex)
          };
        }
        return q;
      })
    });
  };


  return (
    <>

      <Flex mt='5px'>
        <Box w="90%" mb={5} >
          <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '3xl' }}>
            Gestion du test - Module : {location.state.titre}
          </Heading>
        </Box>


      </Flex>
      <Tabs size='md' variant='enclosed'>
        <TabList>
          <Tab _selected={{ color: "white", bg: "blue.500" }} isDisabled={gettest.some(item => item.difficulter === 'facile')}>
            Ajouter un test Facile
          </Tab>

          <Tab _selected={{ color: "white", bg: "blue.500" }} isDisabled={gettest.some(item => item.difficulter === 'moyen')}>
            Ajouter un test Moyen
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }} isDisabled={gettest.some(item => item.difficulter === 'difficile')}>
            Ajouter un test Difficile
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Ajouter niveau={'facile'} />
          </TabPanel>
          <TabPanel>
            <Ajouter niveau={'moyen'} />
          </TabPanel>
          <TabPanel>
            <Ajouter niveau={'difficile'} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* <Accordion allowMultiple color='blue.700' >

        <AccordionItem borderRadius={10}
          mt={4} isDisabled={gettest.some(item => item.difficulter === 'Test Facile')}>
          <h2>
            <AccordionButton bg="blue.600" borderRadius={10}>
              <Box p={1} color='white' as="span" flex='1' textAlign='center' fontWeight="bold" fontSize="lg">
                Ajouter un test Facile
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={5}>
            <Ajouter niveau={'Test Facile'} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderRadius={10} bg="gray.50" style={{ boxShadow: ' 2px 2px 4px #2c528266' }}
          mt={4} isDisabled={gettest.some(item => item.difficulter === 'Test Moyen')}>
          <h2>
            <AccordionButton bg="blue.600" borderRadius={10}>
              <Box p={1} color='white' as="span" flex='1' textAlign='center' fontWeight="bold" fontSize="lg">
                Ajouter un test Moyen
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={5}>
            <Ajouter niveau={'Test Moyen'} />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderRadius={10} bg="gray.50" style={{ boxShadow: ' 2px 2px 4px #2c528266' }}
          mt={4} isDisabled={gettest.some(item => item.difficulter === 'Test Difficile')}>
          <h2>
            <AccordionButton bg="blue.600" borderRadius={10}>
              <Box p={1} color='white' as="span" flex='1' textAlign='center' fontWeight="bold" fontSize="lg">
                Ajouter un test Difficile
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={5}>
            <Ajouter niveau={'Test Difficile'} />
          </AccordionPanel>
        </AccordionItem>


      </Accordion> */}
      <Text textAlign={'center'} fontSize="4xl" fontWeight="bold" bgGradient='linear(to-r, #2b6cb0, #ffd140)' bgClip='text'>Liste des questions</Text>

      <Stack
        w={"full"}
        maxW="full"
        bg={useColorModeValue("white", "gray.700")}
        rounded={"lg"}
        p={6}
        my={5}
      >

        <TableContainer mt={15}>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>
                  id
                </Th>
                <Th>
                  nombre de question
                </Th>
                <Th>
                  seuil
                </Th>
                <Th>
                  temps de passage
                </Th>
                <Th>
                  difficulte
                </Th>
                <Th>
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {gettest.map((data) => (
                <Tr key={data.id}>
                  <Td fontWeight={'bold'}>{data.id}</Td>
                  <Td fontWeight={'bold'}>{data.nombredequestion}</Td>
                  <Td fontWeight={'bold'}>{data.seuil}</Td>
                  <Td fontWeight={'bold'}>{data.tempdepassage}</Td>
                  <Td fontWeight={'bold'}>{data.difficulter}</Td>
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
                          onClick={() => handleEditClick(data)}
                        >
                          Modifier
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          // onClick={() => DeleteFormation(val.id)}
                          onClick={() => handleDeleteClick(data.id,data.difficulter)}
                        >
                          Supprimer
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {moduleData && (
            <Modal isOpen={isEditOpen} onClose={handleEditClose} size={'full'}>
              <ModalOverlay />
              <ModalContent ml={200}>
                <ModalHeader>Editer la question pour le module {moduleData.module}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormLabel>Nombre de question : {moduleData.nombredequestion}</FormLabel>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      type="text"
                      name="description"
                      value={moduleData.description}
                      onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Objectif</FormLabel>
                    <Input
                      type="text"
                      name="objectif"
                      value={moduleData.objectif}
                      onChange={(e) => setModuleData({ ...moduleData, objectif: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>

                    <FormLabel>Difficulté</FormLabel>
                    <Select
                      name="difficulte"
                      value={moduleData.difficulter}
                      onChange={(e) => setModuleData({ ...moduleData, difficulter: e.target.value })}
                    >
                      <option value="facile">Niveaux facile</option>

                      <option value="intermediaire">Niveaux intermédiaire</option>

                      <option value="difficile">Niveaux difficile</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Temps de passage</FormLabel>
                    <Input
                      type="text"
                      name="tempsdepassage"
                      value={moduleData.tempdepassage}
                      onChange={(e) => setModuleData({ ...moduleData, tempdepassage: e.target.value })}
                    />
                  </FormControl>
                  {moduleData.question.map((q, questionIndex) => (
                    <div key={questionIndex} >
                      <Box bg={'#089BD7'} p={5} rounded={'lg'} mt={2} color={'white'} fontWeight={'bold'}>
                        <FormControl >
                          <FormLabel>Question {questionIndex + 1}</FormLabel>
                          <Input
                            type="text"
                            name="question"
                            value={q.question}
                            onChange={(e) =>
                              setModuleData({
                                ...moduleData,
                                question: moduleData.question.map((q, index) =>
                                  index === questionIndex ? { ...q, question: e.target.value } : q
                                ),
                              })
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Explication de la question</FormLabel>
                          <Input
                            type="text"
                            name="explicationdelaquestion"
                            value={q.explicationdelaquestion}
                            onChange={(e) =>
                              setModuleData({
                                ...moduleData,
                                question: moduleData.question.map((q, index) =>
                                  index === questionIndex
                                    ? { ...q, explicationdelaquestion: e.target.value }
                                    : q
                                ),
                              })
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Type de la question</FormLabel>
                          <Select
                            name="explicationdelaquestion"
                            value={q.explicationdelaquestion}
                            onChange={(e) =>
                              setModuleData({
                                ...moduleData,
                                question: moduleData.question.map((q, index) =>
                                  index === questionIndex
                                    ? { ...q, explicationdelaquestion: e.target.value }
                                    : q
                                ),
                              })
                            }
                          >
                            <option value="unique">Question à choix unique</option>
                            <option value="multiple">Question à choix multiple</option>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Chapitre</FormLabel>
                          <Select
                            color='black'
                            value={q.chapitre}
                            onChange={(e) =>
                              setModuleData({
                                ...moduleData,
                                question: moduleData.question.map((q, index) =>
                                  index === questionIndex
                                    ? { ...q, chapitre: parseInt(e.target.value) }
                                    : q
                                ),
                              })
                            }

                          >
                            {getChapitre.map(chapitre => (
                              <option key={chapitre.id} value={parseInt(chapitre.id)}>{chapitre.name}</option>

                            ))}
                          </Select>
                        </FormControl>
                        <Box bg={"#f7d463"} p={5} mt={5} color={'black'} fontWeight={'bold'} rounded={'lg'}>
                          {q.reponses.map((r, answerIndex) => (
                            <div key={answerIndex}>
                              <FormLabel>Reponse {answerIndex + 1} </FormLabel>
                              <Input
                                type="text"
                                name="explicationdelaquestion"
                                value={r.reponse}
                                onChange={(e) =>
                                  setModuleData({
                                    ...moduleData,
                                    question: moduleData.question.map((q, index) =>
                                      index === questionIndex
                                        ? {
                                          ...q,
                                          reponses: q.reponses.map((rep, repIndex) =>
                                            repIndex === answerIndex ? { ...rep, reponse: e.target.value } : rep
                                          ),
                                        }
                                        : q
                                    ),
                                  })
                                }
                              />
                              <FormLabel>Etat de la  {answerIndex + 1} Proposition</FormLabel>
                              <Select
                                value={r.etat ? "true" : "false"}
                                onChange={(e) =>
                                  handleSelectChange(questionIndex, answerIndex, e.target.value)
                                }
                              >
                                <option value="true">Bonne reponse</option>
                                <option value="false">Mauvaise reponse</option>
                              </Select>
                              <Box display={'flex'} w={'full'} mt={5} gap={{ md: "20%", lg: "72%" }}>
                                <Button colorScheme="red" onClick={() => deleteAnswer(questionIndex, answerIndex)}>Supprimer cette proposition</Button>
                                {answerIndex === q.reponses.length - 1 && (
                                  <Button colorScheme="teal" onClick={() => addAnswer(questionIndex)}>Ajouter une proposition</Button>
                                )}
                              </Box>
                            </div>

                          ))}
                        </Box>
                        <Box display={'flex'} w={'full'} mt={5} gap={{ md: "20%", lg: "72%" }}>
                          <Button colorScheme="red" onClick={() => deleteQuestion(questionIndex)}>Supprimer cette question</Button>
                          {questionIndex === moduleData.question.length - 1 && (
                            <Button colorScheme="teal" onClick={() => addQuestion()}>Ajouter une question</Button>
                          )}
                        </Box>
                      </Box>

                    </div>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="teal" mr={3} onClick={() => handleEditSave(moduleData)}>
                    Enregistrer
                  </Button>

                  <Button variant="ghost" onClick={handleEditClose}>
                    Annuler
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </TableContainer>
      </Stack>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Supprimer la question
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer le test de difficulter {difficulter} <span style={{visibility:'hidden'}}>id {deleteId} </span> ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDeleteCancel}>Annuler</Button>
              <Button colorScheme='red' onClick={() => handleDeleteConfirm(deleteId)} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
export default ChapitreList

