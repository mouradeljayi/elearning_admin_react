import {
  Box,
  Button,
  Checkbox,
  useColorModeValue,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Alert,
  AlertIcon,
  Stack,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdFacebook,
  MdOutlineEmail,
} from "react-icons/md";
import { BsGithub, BsDiscord, BsPerson } from "react-icons/bs";
import axios from "axios";
import axiosClient from "../../axios-client";
import { useNavigate, useLocation } from "react-router-dom";
import imgAddModule from "../../assets/img/add_module.png";
import defaultImage from "../../assets/img/default-image.jpg";
import { useMediaQuery } from "@chakra-ui/react";
import { useStateContext } from "../../context/ContextProvider";

function AddModule() {

  // current user
  const { user, setUser } = useStateContext();

  const [listResponsable, setListResponsable] = useState([])
  const [responsable, setResponsable] = useState()

  // current user data
  useEffect(() => {
    axiosClient.get('auth/user/')
      .then(({ data }) => {
        setUser(data)
        console.log(data)
      })
    axiosClient.get('/responsables/').then(res => setListResponsable(res.data))
  }, [])



  const [isNotSmallerScreen] = useMediaQuery("(min-width: 1196px)");

  const location = useLocation();
  const [message, setMessage] = useState('')

  //
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [etat, setEtat] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const toast = useToast();
  const navigate = useNavigate();
  const addModule = (titleM) => {
    if (user.role === 'SUPERADMIN') {
      if (!titre || !description || !selectedImage || !responsable) {
        setMessage("Veuillez remplir les champs!")
        return;
      }
    }
    if (user.role === 'RESPO') {
      if (!titre || !description || !selectedImage) {
        setMessage("Veuillez remplir les champs!")
        return;
      }
    }
    const formData = new FormData();

    formData.append("description", description);
    formData.append("image", selectedImage);
    formData.append("titre", titre);
    formData.append("etat", etat);
    formData.append("formation", location.state.idFormation);
    if (user.role === 'SUPERADMIN') {
      formData.append("responsable", responsable);
    } else {
      formData.append("responsable", user.id);
    }

    axiosClient
      .post(`module/`, formData)
      .then(() => {
        toast({
          description: `le module ${titleM} est ajoutée avec succès à la formation ${location.state.titreFormation}`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });

        if (user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") {
          navigate("/list_allModules", {
            state: {
              idFormation: location.state.idFormation,
              titreF: location.state.titreFormation
            },
          });
        }
        else {
          navigate("/list_modules", {
            state: {
              idFormation: location.state.idFormation,
              titreF: location.state.titreFormation,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Fragment>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>Nouveau Module</Heading>
      </Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Box
          w={isNotSmallerScreen ? "50%" : "100%"}
          bg={useColorModeValue("white", "gray.700")}
          borderRadius="lg"
          m={{ sm: 2, md: 2, lg: 2 }}
          p={{ sm: 4, md: 4, lg: 4 }}
        >
          <Box p={4} rounded="xl" align="center" justify="center">
            <VStack spacing={5} w="90%">
            {message &&
                        <Alert status='error' rounded="md">
                            <AlertIcon />
                            {message}
                        </Alert>
                    }
              <FormControl id="name" isRequired>
                <FormLabel>Titre Module</FormLabel>
                <InputGroup borderColor="#E0E1E7">
                  <Input
                    type="text"
                    size="lg"
                    name="titre"
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Titre Module"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="image" isRequired>
                <FormLabel>Image</FormLabel>
                <InputGroup borderColor="#E0E1E7">
                  <Box
                    position="relative"
                    w="50%"
                    h="auto"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                  >
                    {/* {!image && (
                      <Image
                        src={defaultImage}
                        w="full"
                        h="auto"
                        maxH="400px"
                        objectFit="contain"
                        alt="Dan Abramov"
                        rounded="lg"
                      />
                    )} */}
                    {!selectedImage && (
                      <Image
                        src={defaultImage}
                        w="full"
                        h="auto"
                        maxH="400px"
                        objectFit="contain"
                        alt="Dan Abramov"
                        rounded="lg"
                      />
                    )}
                    {image && selectedImage && (
                      <Box mt={2} textAlign="center">
                        <div>Image Preview:</div>
                        <Image
                          src={image}
                          w="full"
                          h="auto"
                          maxH="400px"
                          objectFit="contain"
                          alt="Dan Abramov"
                          rounded="lg"
                        />
                      </Box>
                    )}
                    <Input
                      opacity={0}
                      top={0}
                      left={0}
                      h="100%"
                      position="absolute"
                      type="file"
                      size="lg"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                      cursor="pointer"
                    />
                  </Box>
                </InputGroup>
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  borderColor="gray.300"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  _hover={{
                    borderRadius: "gray.300",
                  }}
                  placeholder="Description"
                />
              </FormControl>
              {(user.role === "SUPERADMIN" || user.role === "MASTER" || user.role === "ADMIN") &&
                <FormControl  id="responsable" isRequired>
                <FormLabel>Responsable</FormLabel>
                  <Select
                    name="responsable"
                    placeholder='Selectionnez le responsable'
                    onChange={(e) => setResponsable(e.target.value)}
                  >
                    {listResponsable.map((v, k) => {
                      if (v.role === "RESPO") {
                        return <option value={v.id}>{v.first_name}</option>
                      }

                    })}
                  </Select>
                </FormControl>
              }

              <FormControl id="etat" display="flex" justifyContent="start">
                <Checkbox
                  size="lg"
                  colorScheme="green"
                  name="etat"
                  onChange={() => setEtat(!etat)}
                >
                  Activez le Module
                </Checkbox>
              </FormControl>
              <FormControl
                display="flex"
                justifyContent="end"
                id="name"
                float="right"
              >
                <Button
                  variant="solid"
                  bg="#ffd140"
                  color="black"
                  _hover="none"
                  onClick={() => addModule(titre)}
                >
                  Ajoutez Module
                </Button>
              </FormControl>
            </VStack>
          </Box>
        </Box>
        <Box boxSize="lg" display={isNotSmallerScreen ? "block" : "none"} p={5}>
          <Image src={imgAddModule} alt="Dan Abramov" />
        </Box>
      </Flex>
    </Fragment>
  );
}

export default AddModule;