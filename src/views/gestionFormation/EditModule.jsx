import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  Avatar,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Select,
  useColorModeValue,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
  Image,
  useToast,
  Alert,
  AlertIcon,
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

function EditModule() {

  // current user
  const { user } = useStateContext();

  const [listResponsable, setListResponsable] = useState([])
  const [responsable, setResponsable] = useState()

  // current user data
  useEffect(() => {
    axiosClient.get('/responsables/').then(res => setListResponsable(res.data))
  }, [])

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 1196px)");

  const location = useLocation();
  const [message, setMessage] = useState('')

  const [listModule, setListModule] = useState([]);
  //
  const [titre, setTitre] = useState(location.state.titre || "");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(
    location.state.description || ""
  );

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {

    axiosClient
      .get(`/module/`)
      .then((res) => setListModule(res.data));

      if (selectedImage) {
        setImage(URL.createObjectURL(selectedImage));
      }
  }, [selectedImage]);
  

  const handleImageChange = (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    axiosClient
      .patch(`/module/${location.state.idModule}/`,
        formData
      )
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
    // setImage(e.target.files[0])
  };


  const toast = useToast();
  const navigate = useNavigate();
  const EditModule = () => {
    if (user.role === 'SUPERADMIN') {
      if (!titre || !description) {
        setMessage("Veuillez remplir les champs!")
        return;
      }
    }
    if (user.role === 'RESPO') {
      if (!titre || !description) {
        setMessage("Veuillez remplir les champs!")
        return;
      }
    }

    if (user.role === "RESPO") {
      const formData = new FormData()
      formData.append('titre',titre)
      formData.append('description',description)
      if (selectedImage)formData.append("image", selectedImage)
      axiosClient
        .patch(`/module/${location.state.idModule}/`, formData)
        .then(() => {
          toast({
            description: `le module ${titre} est modifiée avec succès`,
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
          });

          navigate("/list_modules", {
            state: {
              idFormation: location.state.idFormation,
              titreF: location.state.titreFormation
            },
          });
        })
        .catch((error) => console.log(error));
    }
    else {

      const formData = new FormData()
      formData.append('titre',titre)
      formData.append('description',description)
      if (selectedImage)formData.append("image", selectedImage)
      if(responsable)formData.append('responsable',responsable)      

      axiosClient
        .patch(`/module/${location.state.idModule}/`,formData)
        .then(() => {
          toast({
            description: `le module ${titre} est modifiée avec succès`,
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
          });

          navigate("/list_allModules", {
            state: {
              idFormation: location.state.idFormation,
              titreF: location.state.titreFormation
            },
          });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Fragment>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>Modifier Module</Heading>
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
            {listModule.map((val, key) => {
              if (val.id === location.state.idModule) {
                return (
                  <VStack spacing={5}>
                  {message &&
                              <Alert status='error' rounded="md">
                                  <AlertIcon />
                                  {message}
                              </Alert>
                          }
                    <FormControl id="name">
                      <FormLabel>Titre Module</FormLabel>
                      <InputGroup borderColor="#E0E1E7">
                        <Input
                          type="text"
                          size="lg"
                          name="titre"
                          defaultValue={val.titre}
                          onChange={(e) => setTitre(e.target.value)}
                          placeholder="Titre Module"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl id="name">
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
                        {!selectedImage && (
                          <Image
                            src={val.image}
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
                          {/* <Image
                            rounded="lg"
                            src={val.image ? val.image : defaultImage}
                            w="full"
                            h="auto"
                            maxH="400px"
                            objectFit="contain"
                            alt="Dan Abramov"
                          /> */}
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
                    <FormControl id="name">
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        borderColor="gray.300"
                        name="description"
                        defaultValue={val.description}
                        onChange={(e) => setDescription(e.target.value)}
                        _hover={{
                          borderRadius: "gray.300",
                        }}
                        placeholder="Description"
                      />
                    </FormControl>
                    {(user.role === "SUPERADMIN" || user.role === "MASTER") &&
                      <FormControl  id="responsable">
                      <FormLabel>Responsable</FormLabel>
                        <Select
                          name="responsable"
                          defaultValue={val.responsable}
                          placeholder='Selectionnez les responsable'
                          onChange={(e) => setResponsable(e.target.value)}
                        >
                          {listResponsable.map((v, k) => {
                            if (v.role === "RESPO") {
                              return <option value={v.id}>{v.first_name} {v.last_name}</option>
                            }

                          })}
                        </Select>
                      </FormControl>
                    }
                    <FormControl
                      id="name"
                      float="right"
                      display="flex"
                      justifyContent="end"
                    >
                      <Button
                        variant="solid"
                        bg="#ffd140"
                        color="black"
                        _hover="none"
                        onClick={EditModule}
                      >
                        Modifier Module
                      </Button>
                    </FormControl>
                  </VStack>
                );
              }
            })}
          </Box>
        </Box>
        <Box boxSize="lg" display={isNotSmallerScreen ? "block" : "none"} p={5}>
          <Image src={imgAddModule} alt="Dan Abramov" />
        </Box>
      </Flex>
    </Fragment>
  );
}

export default EditModule;
