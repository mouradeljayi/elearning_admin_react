import {
  Text,
  Box,
  Thead,
  Table,
  Flex,
  Tbody,
  Spacer,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  HStack,
  Center,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { CheckIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { format } from "date-fns";
import PieChart from "./chart/StatisqueAdmission";
import Users from "./chart/ReussiteParTentative";
import Moyenne from "./chart/NoteMoyenneParModule";

function Resultat() {
  const [globalResult, setGlobalResult] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [tentative, setTentative] = useState("tous");
  const [admis, setAdmis] = useState("tous");
  const [date1, setDate1] = useState(
    format(new Date(2000, 11, 27), "yyyy-MM-dd")
  );
  const [date2, setDate2] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axiosClient
      .get("/resultat/")
      .then(({ data }) => {
        data.map((dat, index) => {
          //convertion de date en format "yyyy-mm-dd"
          const date = new Date(dat.date_de_passage);
          date.setDate(date.getDate());
          const formattedDate = date.toISOString().slice(0, 10);
          data[index].date_de_passage = formattedDate;
        });
        setGlobalResult(data);
        setResultats(data);
        console.log("la date daujourdhui", date2);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    filtrage_search();
  }, [admis, tentative, date1, date2, searchValue]);

  // convertion du format de date
  function dateFormat(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    // Output: "31/03/2023"
    return formattedDate;
  }

  function dateFront(dateF) {
    const [year, month, day] = dateF.split("-");
    return `${day}/${month}/${year}`;
  }

  //Filtrer les résultats en fonction de la propriété "valider"
  const handleAdmission = (valider) => {
    if (valider === "tous") {
      setAdmis(valider);
    } else {
      const check = valider === "true" ? true : false;
      setAdmis(check);
    }
  };

  //Filtrer les résultats en fonction de la propriété "tentative"
  const handleTentative = (variable) => {
    if (variable === "tous") {
      setTentative(variable);
    } else {
      variable = parseInt(variable);
      setTentative(variable);
    }
  };

  //filtre date
  const handleDate1 = (dateString) => {
    setDate1(dateString);
  };

  const handleDate2 = (dateString) => {
    setDate2(dateString);
  };

  //search state
  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filtrage_search = (event) => {
    if (event) event.preventDefault();

    // search
    const lowerCaseSearchString = searchValue.toLowerCase();
    const searchedResult = globalResult.filter(
      (result) =>
        result.formation.toLowerCase().includes(lowerCaseSearchString) ||
        result.module.toLowerCase().includes(lowerCaseSearchString) ||
        result.username.toLowerCase().includes(lowerCaseSearchString)
    );

    // filtre
    const filteredResultats = searchedResult.filter(
      (resultat) =>
        (tentative === "tous" ? true : resultat.tentative === tentative) &&
        (admis === "tous" ? true : resultat.valider === admis) &&
        resultat.date_de_passage >= date1 &&
        resultat.date_de_passage <= date2
    );
    setResultats(filteredResultats);
  };

  return (
    <Box w="100%" p={4} color="black" borderRadius="xl">
      <Flex bg={"white"} rounded={"lg"} p={5} gap={5}>
        <Center w="20%">
          <Users />
        </Center>
        <Center w="20%">
          <PieChart />
        </Center>
        <Center w="50%">
          <Moyenne />
        </Center>
      </Flex>
      <br />
      <br />
      <Text
        textAlign={"left"}
        fontSize="4xl"
        fontWeight="bold"
        bgGradient="linear(to-l, #ffd140, #2b6cb0)"
        bgClip="text"
      >
        Liste des resultat
      </Text>
      <HStack>
        <Spacer />
        <Box>
          <form>
            <InputGroup size="lg">
              <Input
                type="search"
                value={searchValue}
                onChange={handleSearchInputChange}
                pr="4.5rem"
                placeholder="Search"
                bg="white"
              />
              <InputRightElement width="4.5rem">
                <Button
                  color="green"
                  h="1.75rem"
                  size="sm"
                  onClick={filtrage_search}
                >
                  <Search2Icon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
        <Spacer />
        <Flex>
          <Box bg="white" p={5} rounded={"lg"}>
            <HStack w="full" fontWeight="bold" mt={5} textAlign={"center"}>
              <Spacer />
              <Box></Box>
              <Spacer />
              <Box>
                {" "}
                <span>Admission:</span>
                <Select onChange={(e) => handleAdmission(e.target.value)}>
                  <option value="tous">Tous</option>
                  <option value="true">Admis</option>
                  <option value="false">Non admis</option>
                </Select>
              </Box>
              <Spacer />
              <Box>
                <span>Tentative:</span>
                <Select onChange={(e) => handleTentative(e.target.value)}>
                  <option value="tous">Tous</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Select>
              </Box>
              <Spacer />
              <Box>
                <Text textAlign={"center"}>Aprés le:</Text>
                <form onChange={(e) => handleDate1(e.target.value)}>
                  <Input type="date" />
                </form>
              </Box>
              <Spacer />
              <Box>
                <Text textAlign={"center"}>Avant le:</Text>
                <form onChange={(e) => handleDate2(e.target.value)}>
                  <Input type="date" />
                </form>
              </Box>
            </HStack>
          </Box>
        </Flex>
      </HStack>
      <br />
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
                <Th>Formation</Th>
                <Th>Module</Th>
                <Th>Username</Th>
                <Th>Tentative</Th>
                <Th>Score</Th>
                <Th>Date de passage</Th>
                <Th>Admis</Th>
              </Tr>
            </Thead>

            <Tbody>
              {resultats.map((result, index) => (
                <Tr key={index}>
                  <Td fontWeight={"bold"}>{result.formation}</Td>
                  <Td fontWeight={"bold"}>{result.module}</Td>
                  <Td fontWeight={"bold"}>{result.username}</Td>
                  <Td fontWeight={"bold"}>{result.tentative}</Td>
                  {result.valider ? (
                    <Td size={13} color={"#1EB14C"} fontWeight="bold">
                      {result.resultat}%
                    </Td>
                  ) : (
                    <Td size={13} color={"red"} fontWeight="bold">
                      {result.resultat}%
                    </Td>
                  )}
                  <Td>{dateFront(result.date_de_passage)}</Td>
                  {result.valider ? (
                    <Td color={"#1EB14C"}>
                      {" "}
                      <button>
                        <CheckIcon />
                      </button>{" "}
                    </Td>
                  ) : (
                    <Td color={"red"}>
                      {" "}
                      <button>
                        <CloseIcon />
                      </button>{" "}
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}

export default Resultat;
