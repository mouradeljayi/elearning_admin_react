import { useStateContext } from '../../context/ContextProvider';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Box, Text, Input, FormControl, FormLabel, Select, VStack, Button, Flex, HStack, Stack, Textarea, InputLeftAddon, InputGroup, InputRightAddon, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios'
const Ajouter = ({ niveau }) => {
  const { fetchDataStat, postdata, getModule, getChapitres } = useStateContext();

  const [questionsPerChapter, setQuestionsPerChapter] = useState({});
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
  }, []);
  console.log()
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const handleDurationChange = (event) => {
    const duration = event.target.value.trim();
    const [h = 0, m = 0, s = 0] = duration.split(/[^\d]+/).map(Number);
    setHours(h.toString().padStart(2, '0'));
    setMinutes(m.toString().padStart(2, '0'));
    setSeconds(s.toString().padStart(2, '0'));
  };
  const handleQuestionsInputChange = (event, chapterId) => {
    setQuestionsPerChapter({
      ...questionsPerChapter,
      [chapterId]: parseInt(event.target.value),
    });
  };
  const handleAddQuestion = (chapterId) => {
    const numQuestions = parseInt(questionsPerChapter[chapterId]) || 0;
    const updatedQuestions = {
      ...questionsPerChapter,

      [chapterId]: numQuestions + 1,
    };
    console.log(questionsPerChapter)
    setQuestionsPerChapter(updatedQuestions);
    const inputEl = document.getElementById(`chapter-${chapterId}-questions-input`);
    if (inputEl) {
      inputEl.value = updatedQuestions[chapterId];
    }
  };
  const handleDeleteQuestion = (chapterId, questionIndex) => {
    const numQuestions = parseInt(questionsPerChapter[chapterId]) || 0;
    if (numQuestions > 0) {
      const updatedQuestions = Array.from(
        { length: numQuestions },
        (_, i) =>
          i === questionIndex
            ? null
            : document.getElementById(`${chapterId}-question-${i}`).value
      ).filter((q) => q !== null);
      setQuestionsPerChapter({
        ...questionsPerChapter-1,
        [chapterId]: numQuestions - 1,
      });
      for (let i = questionIndex; i < numQuestions; i++) {
        document.getElementById(
          `${chapterId}-question-${i}`
        ).value = updatedQuestions[i];
      }
    }
  };
  const [numPropositionsPerQuestion, setNumPropositionsPerQuestion] = useState({});
  const handleNumPropositionsChange = (questionId, numPropositions) => {
    setNumPropositionsPerQuestion({
      ...numPropositionsPerQuestion,
      [questionId]: parseInt(numPropositions),
    });
  };
  const handleAddProposition = (chapterId, questionIndex) => {
    const currentNumPropositions = parseInt(numPropositionsPerQuestion[`${chapterId}-question-${questionIndex}`]) || 0;
    const updatedNumPropositions = currentNumPropositions + 1;
    setNumPropositionsPerQuestion({
      ...numPropositionsPerQuestion,
      [`${chapterId}-question-${questionIndex}`]: updatedNumPropositions,
    });
  };

  const supprimer = (chapterId, questionIndex, propositionIndex) => {
    const key = `${chapterId}-question-${questionIndex}`;
    const currentPropositions = numPropositionsPerQuestion[key];
    if (propositionIndex >= currentPropositions) {
      console.error(`Invalid proposition index ${propositionIndex} for question ${key}`);
      return;
    }
    const newPropositions = [...Array(currentPropositions - 1)].map((_, index) => {
      const currentIndex = (index >= propositionIndex) ? (index + 1) : index;
      return document.getElementsByName(`${key}-proposition-${currentIndex}`)[0].value;
    });
    setNumPropositionsPerQuestion({
      ...numPropositionsPerQuestion,
      [key]: currentPropositions - 1,
    });
    document.getElementsByName(`${key}-num-propositions`)[0].value = currentPropositions - 1;
    for (let i = propositionIndex; i < currentPropositions - 1; i++) {
      const propositionInput = document.getElementsByName(`${key}-proposition-${i}`)[0];
      if (propositionInput) {
        propositionInput.value = newPropositions[i];
      }
      const responseSelect = document.getElementsByName(`${key}-proposition-${i}-response`)[0];
      if (responseSelect) {
        responseSelect.name = `${key}-proposition-${i - 1}-response`;
        responseSelect.selectedIndex = 0;
      }
    }
    console.log(`Proposition ${propositionIndex + 1} for question ${key} has been deleted`);
  };
  const renderQuestions = (chapterId, chapterName) => {
    let numQuestions = parseInt(questionsPerChapter[chapterId]) || 0;
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      const propositionsPerQuestion = numPropositionsPerQuestion[`${chapterId}-question-${i}`] || 0;
      const renderPropositions = () => {
        const propositions = [];
        for (let j = 0; j < propositionsPerQuestion; j++) {
          if (j < numPropositionsPerQuestion[`${chapterId}-question-${i}`]) {
            propositions.push(
              <Box key={`${chapterId}-question-${i}-proposition-${j}`} rounded={"lg"} w={'full'} bg={propbg}  p={5} mt={2} color={textColor} fontWeight={'bold'}>
                <FormControl mt={4}>
                  <FormLabel htmlFor={`${chapterId}-question-${i}-proposition-input-${j}`}>Proposition {j + 1}</FormLabel>
                  <Input placeholder='proposition' type="text" name={`${chapterId}-question-${i}-proposition-${j}`} id={`${chapterId}-question-${i}-proposition-input-${j}`} />
                  <Select bg={propbg} color={textColor} mt={2} name={`${chapterId}-question-${i}-proposition-${j}-response`}>
                    <option value="mauvaise">Mauvaise réponse</option>
                    <option value="bonne">Bonne réponse</option>
                  </Select>
                </FormControl>
                <Box display={'flex'} w={'full'} gap={{ md: "10%", lg: "68%" }} mt={1} >
                  <Input type="hidden" id={`${chapterId}-question-${i}-num-propositions`} value={propositionsPerQuestion} />
                  <Button  mt={4} colorScheme="red" onClick={() => supprimer(chapterId, i, j)} name={`${chapterId}-question-${i}-proposition-${j}-delete-button`}>Supprimer</Button>
                  {j === numPropositionsPerQuestion[`${chapterId}-question-${i}`] - 1 ? (
                    <Button colorScheme="teal" mt={4} onClick={() => handleAddProposition(chapterId, i)} name={`${chapterId}-question-${i}-add-proposition`}>Ajouter une proposition</Button>
                  ) : null}
                </Box>
              </Box>
            );
          }
        }
        return propositions;
      };
      questions.push(
        <Box key={`${chapterId}-question-${i}`} bg={bgclr} p={5} rounded={'lg'} mt={2} >
          <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>Question {i + 1}</Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor={`${chapterId}-question-${i}`}>Question</FormLabel>
              <Input bg={bgColor} type="text" placeholder="Enter the question" name={`${chapterId}-question-${i}`} id={`${chapterId}-question-${i}`} />
            </FormControl>
            <Input bg={bgColor} type="hidden" name={`${chapterId}`} value={chapterId} />
            <Input bg={bgColor} type="hidden" name={`chapter-${chapterId}-${i}`} value={chapterName} />

            <FormControl>
              <FormLabel>Explication</FormLabel>
              <Input bg={bgColor} type="text" placeholder="Enter the explanation" name={`${chapterId}-question-${i}-explanation`} />
            </FormControl>
            <FormControl>
              <FormLabel>Type de question</FormLabel>
              <Select variant='filled' name={`${chapterId}-question-${i}-type`} bg={bgColor}>
                <option value="unique">Choix unique</option>
                <option value="multiple">Choix multiple</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Propositions par question</FormLabel>
              <Input bg={bgColor} type="number" min={1} defaultValue={propositionsPerQuestion} onChange={(e) => handleNumPropositionsChange(`${chapterId}-question-${i}`, e.target.value)} name={`${chapterId}-question-${i}-num-propositions`} />
            </FormControl>
            {renderPropositions()}
            <Box justifyContent={'space-between'} display={'flex'} w={'full'} >
              <Button colorScheme="red" onClick={() => handleDeleteQuestion(chapterId, i)} name={`${chapterId}-question-${i}-delete`}>Supprimer cette question</Button>
              {i === numQuestions - 1 ? (
                <Button  colorScheme="teal" onClick={() => handleAddQuestion(chapterId, i)} name={`${chapterId}-question-${i}-add`}>Ajouter une question</Button>
              ) : null}
            </Box>
          </VStack>
        </Box>
      );
    }
    return questions;
  };
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formdata = {};
      const questions = [];
      const duration = `${hours}:${minutes}:${seconds}`;
      const chapterIds = Object.keys(questionsPerChapter);
      chapterIds.forEach((chapterId) => {
        const chapterQuestions = [];
        const numQuestions = questionsPerChapter[chapterId];
        for (let i = 0; i < numQuestions; i++) {
          const question = {
            chapitre: parseInt(chapterId),
            chapterName: event.target[`chapter-${chapterId}-${i}`].value,
            explicationdelaquestion: event.target[`${chapterId}-question-${i}-explanation`].value,
            nombredeproposition: numPropositionsPerQuestion[`${chapterId}-question-${i}`],
            question: event.target[`${chapterId}-question-${i}`].value,
            typeChoix:event.target[`${chapterId}-question-${i}-type`].value,
            reponses: []
          };
          const numPropositions = numPropositionsPerQuestion[`${chapterId}-question-${i}`];
          for (let j = 0; j < numPropositions; j++) {
            const proposition = {
              etat: event.target[`${chapterId}-question-${i}-proposition-${j}-response`].value === "mauvaise" ? false : true,
              reponse: event.target[`${chapterId}-question-${i}-proposition-${j}`].value,
            };
            question.reponses.push(proposition);
          }
          chapterQuestions.push(question);
        }
        questions.push(...chapterQuestions);
      });
      formdata.question = questions;
      formdata.idModule = location.state.idModule;
      formdata.nombredequestion = totalQuestions;
      formdata.seuil = event.target.seuil.value
      formdata.difficulter = niveau;
      formdata.tempdepassage = duration
      formdata.description = event.target.Description.value
      formdata.objectif = event.target.Objectife.value
      window.location.reload()
      postdata(formdata);
      console.log(formdata)
    } catch (error) {
      alert(error.config.data);
    }
  };
  const totalQuestions = getChapitre.reduce((total, chapitre) => {
    return total + (questionsPerChapter[chapitre.id] || 0);
    
  }, 0);

  const bgColor = useColorModeValue("white", "gray.700");
  const bgclr = useColorModeValue("gray.50", "gray.600");
  const propbg = useColorModeValue("gray.300", "gray.700");

  
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <form onSubmit={handleSubmit}>

        <VStack spacing={8} mt={5}>
          
          <FormControl p={4} w={'90%'} rounded={'lg'} bg={useColorModeValue("white", "gray.700")} color={useColorModeValue("black", "white")}>
            <Input color={'black'} bg={'gray.50'} type='hidden' name={niveau} />
            <Flex justify={'space-between'} direction={{base:'column' , md:'row' ,lg:'row'}}>
              <Stack w={{base:'full',md:'50%' ,lg:'50%'}}>
                <FormLabel p={2}>Seuil du test</FormLabel>
                <Input w={{base:'full',md:'90%' ,lg:'80%'}} placeholder='Seuil' type='number' name="seuil" />
              </Stack>
              <Stack w={{base:'full',md:'50%' ,lg:'50%'}}>
                <FormLabel p={2}>Temps de passage</FormLabel>
                <Flex  borderRadius={5}  alignItems={'center'} justifyItems={'flex-end'} gap={{ md: 0, lg: 25 }} >
                  <InputGroup>
                  <Input placeholder='00' type="number" min={0} max={59} name="hours" value={hours} onChange={(event) => setHours(event.target.value)} style={{ textAlign: 'center' }} />
                  <InputRightAddon children='HH' />
                  </InputGroup>
                  {/* <Text mt={1} fontFamily={'arial'} fontWeight={'bold'} color={'white'}>HH</Text> */}
                  <InputGroup>
                  <Input placeholder='00' type="number" min={0} max={59} name="minutes" value={minutes} onChange={(event) => setMinutes(event.target.value)} style={{ textAlign: 'center' }} />
                  <InputRightAddon children='MM' />
                  </InputGroup>
                  {/* <Text mt={1} fontFamily={'arial'} fontWeight={'bold'} color={'white'}>MM</Text> */}
                  <InputGroup>
                  <Input  placeholder='00' type="number" min={0} max={59} name="seconds" value={seconds} onChange={(event) => setSeconds(event.target.value)} style={{ textAlign: 'center' }} />
                  <InputRightAddon children='SS' />
                  </InputGroup>
                  {/* <Text mt={1} fontFamily={'arial'} fontWeight={'bold'} color={'white'}>SS</Text> */}
                </Flex>
              </Stack>
            </Flex>


            <FormLabel p={2}>Description</FormLabel>
            <Textarea type="text" placeholder="Entrer la description" name={'Description'} />
            <FormLabel p={2}>Objectif</FormLabel>
            <Input type="text" placeholder="Entrer l'objectif" name={'Objectife'} />
          </FormControl>
          <Flex w={'90%'} rounded={'lg'}  justifyContent="center">
            <Text fontSize="xl" fontWeight="bold" name={`${totalQuestions}`} textAlign={'center'}>
              Nombre total de questions : {`${totalQuestions}`}
            </Text>
          </Flex>
          {getChapitre.map((chapitre) => (
            <Box key={chapitre.id} p={4} w={'90%'} rounded={'lg'} bg={bgColor} color={textColor}>
              <Text bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize="2xl" fontWeight="bold" mb={2}>
                Chapitre : {chapitre.name}
              </Text>
              <FormControl display={'flex'} mb={4} alignItems={'center'} >
                <FormLabel htmlFor={`chapter-${chapitre.id}-questions-input`}>
                  Nombre de questions :
                </FormLabel>
                <Input
                  w={'30%'}
                  rounded={'md'}
                 size={'sm'}
                 placeholder='nombre de questions'
                  type="number"
                  id={`chapter-${chapitre.id}-questions-input`}
                  onChange={(e) => handleQuestionsInputChange(e, chapitre.id)}
                />
              </FormControl>
              {renderQuestions(chapitre.id, chapitre.name)}
            </Box>
          ))}
          <Flex justifyItems={'left'} w={'90%'}>
          <Button  type="submit" colorScheme="green">
          Ajouter le test
        </Button>
          </Flex>
           
        </VStack>
         
        
      </form>

    </>
  );
}
export default Ajouter  
