import React, { useEffect, useState } from "react";
import {
  Stack,
  Flex,
  Heading,
  Box,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
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
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Text,
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
  PhoneIcon,
  RepeatIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { TbLockAccess } from "react-icons/tb";
import { useMediaQuery } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Radio, RadioGroup } from "@chakra-ui/react";

function ActivationModuleApprenant({id_Module}) {
  const navigate = useNavigate();

  const location = useLocation();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const [listAcces, setListAcces] = useState([]);
  const [listApprenant, setListApprenant] = useState([]);

  console.log(location.state.titre, " ", id_Module);

  useEffect(() => {

    axiosClient
      .get("/acces/getEtatAccesInModule/")
      .then((res) => setListAcces(res.data.sort().reverse()));
      
    axiosClient
      .get("/apprenants/")
      .then((res) => setListApprenant(res.data));

  }, []);


  const [nameApprenant, setNameApprenant] = useState('')

  const toast = useToast()
  const EditActivation = (id, et, re) => {
    axiosClient.patch(`/acces/${id}/`, {
      etat: !et,
      encours:false,
      refus: !re,
    })
      .then((res) => {
        setListAcces(rows => rows.map(row => {
          if (row.id === id) {
            return {
              ...row,
              etat: !et,
              encours:false,
              refus:!re
            }
          }
          return row
        }))
      })
    if (!et) {
      toast({
        description: `Le module ${location.state.titre} est activé`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    else {
      toast({
        description: `Le module ${location.state.titre} est desactivé`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }

  };

  const [search, setSearch] = useState();
  const [keys] = ["name", "titre"];

  const [value, setValue] = useState("");

  console.log(value);

  return (
    <Stack mt="5px">
      <Stack
        w={"full"}
        maxW="full"
        bg={useColorModeValue("white", "gray.700")}
        rounded={"lg"}
        p={6}
        my={5}
      >
        <Flex mb={3} justifyContent="space-between">
          <InputGroup>
            <Select
              w="15%"
              name="value"
              value={value}
              size="sm"
              onChange={(e) => { setValue(e.target.value) }}
            >
              <option value="">Tout</option>
              <option value="true">Activé</option>
              <option value="false">Désactivé</option>
            </Select>
          </InputGroup>
          {/* <RadioGroup onChange={setValue} value={value}>
            <Stack direction="row">
              <Radio value="">Tout</Radio>
              <Radio value="true">Activé</Radio>
              <Radio value="false">Désactivé</Radio>
            </Stack>
          </RadioGroup> */}
          {/* <InputGroup w="30%">
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input type='tel' placeholder='Recherche...' onChange={e => setSearch(e.target.value)} />
          </InputGroup> */}
        </Flex>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Prénom</Th>
                <Th>Module</Th>
                <Th>Etat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {listAcces
                .filter((item) => {
                  return value === ""
                    ? item
                    : item.etat.toString().toLowerCase().includes(value);
                })
                .map((val, key) => {
                  if (val.module === id_Module) {
                    return (
                      <Tr>
                        <Td>
                          {listApprenant.map((v, k) => {
                            if (v.id === val.apprenant) {
                              return v.last_name;
                            }
                          })}
                        </Td>
                        <Td>
                          {listApprenant.map((v, k) => {
                            if (v.id === val.apprenant) {
                              return v.first_name;
                            }
                          })}
                        </Td>
                        <Td>{location.state.titre}</Td>
                        <Td>
                          <Switch
                            size="md"
                            colorScheme="green"
                            isChecked={val.etat}
                            onChange={() =>
                              EditActivation(
                                val.id,
                                val.etat,
                                val.refus
                              )
                            }
                          />
                          <Badge
                            rounded="lg"
                            colorScheme={val.etat ? "green" : "red"}
                          >
                            {val.etat ? "Activé" : "Desactivé"}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  }
                })}
              {listAcces.length === 0 && (
                <Text>Aucune ligne correspondante n'a été trouvée.</Text>

              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}

export default ActivationModuleApprenant;
