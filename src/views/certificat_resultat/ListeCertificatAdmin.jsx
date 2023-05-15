import {
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
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { CheckIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { DownloadIcon } from "@chakra-ui/icons";
import { format } from "date-fns";

function ListeCertificatAdmin() {
  const [globalResult, setGlobalResult] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [score, setScore] = useState("");
  const [date1, setDate1] = useState(
    format(new Date(2000, 11, 27), "yyyy-MM-dd")
  );
  const [date2, setDate2] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/certificat/")
      .then(({ data }) => {
        console.log(data);
        data.map((dat, index) => {
          //convertion de date en format "yyyy-mm-dd"
          const date = new Date(dat.date_obtention);
          date.setDate(date.getDate());
          const formattedDate = date.toISOString().slice(0, 10);
          data[index].date_obtention = formattedDate;
        });
        setGlobalResult(data);
        setResultats(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  useEffect(() => {
    filtrage_search();
  }, [score, date1, date2, searchValue]);

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

  //Filtrer les résultats en fonction de la propriété "tentative"
  const handleScore = (variable) => {
    if (variable === "") {
      setScore(variable);
    } else {
      variable = parseInt(variable);
      setScore(variable);
    }
  };

  //filtre date
  const handleDate1 = (dateString) => {
    setDate1(dateString);
  };

  const handleDate2 = (dateString) => {
    setDate2(dateString);
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
        (score === "" ? true : resultat.resultat >= score) &&
        resultat.date_obtention >= date1 &&
        resultat.date_obtention <= date2
    );
    setResultats(filteredResultats);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDownloadClick = (certification) => {
    window.open(certification, "_blank");
  };

  return (
    <>
      <Box bg="white" w="100%" p={4} color="black" borderRadius="xl">
        <Heading
          mt={"4%"}
          textAlign={"left"}
          fontSize="4xl"
          fontWeight="bold"
          bgGradient="linear(to-l, #ffd140, #2b6cb0)"
          bgClip="text"
        >
          Liste des certificats
        </Heading>
        <HStack>
          <Box>
            <form>
              <InputGroup size="md" mt={"15%"}>
                <Input
                  type="search"
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  pr="4.5rem"
                  placeholder="Search"
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
          <Box bg="white">
            <HStack w="90%" mt={"2%"} fontWeight="bold" ml={"5%"}>
              <Box mt={1}>
                <span>Score superieur à: </span>
                <form onChange={(e) => handleScore(e.target.value)}>
                  <Input type="number" />
                </form>
              </Box>
              <Spacer />
              <Box mt={5}>
                <span>Après le:</span>
                <form onChange={(e) => handleDate1(e.target.value)}>
                  <Input type="date" />
                </form>
              </Box>
              <Spacer />
              <Box>
                <span>Avant le:</span>
                <form onChange={(e) => handleDate2(e.target.value)}>
                  <Input type="date" />
                </form>
              </Box>
            </HStack>
          </Box>
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
          <TableContainer borderRadius="lg">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Formation</Th>
                  <Th>Module</Th>
                  <Th>Username</Th>
                  <Th>Resultat</Th>
                  <Th>Date d'obtention</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {resultats.map((result, index) => (
                  <Tr key={index}>
                    <Td>{result.idCertificat}</Td>
                    <Td>{result.formation}</Td>
                    <Td>{result.module}</Td>
                    <Td>{result.username}</Td>
                    <Td>{result.resultat}%</Td>
                    <Td>{dateFront(result.date_obtention)}</Td>
                    <Td color={"#1EB14C"}>
                      {" "}
                      <HStack>
                        <button
                          onClick={() =>
                            handleDownloadClick(result.certificat_file)
                          }
                        >
                          <DownloadIcon />
                        </button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
}

export default ListeCertificatAdmin;
