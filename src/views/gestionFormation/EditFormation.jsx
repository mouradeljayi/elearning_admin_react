import {
  Avatar,
  Box,
  Button,
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
  Stack,
  Text,
  Textarea,
  VStack,
  Wrap,
  useColorModeValue,
  WrapItem,
  useToast,
  Image,
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
import { BsGithub, BsDiscord, BsPerson, BsFillCloudArrowUpFill } from "react-icons/bs";
import axios from "axios";
import axiosClient from "../../axios-client";
import { useNavigate, useLocation } from "react-router-dom";
import imgAddFormation from "../../assets/img/add_formation.png";
import defaultImage from "../../assets/img/default-image.jpg";
import { useMediaQuery } from "@chakra-ui/react";
import { AiFillCloseCircle } from "react-icons/ai";

function EditFormation() {
  const toast = useToast();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 1196px)");

  const location = useLocation();

  const [listFormation, setListFormation] = useState([
    {
      titre: "",
      image: "",
      description: "",
    },
  ]);

  //
  const [titre, setTitre] = useState(location.state.titre || "");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState(
    location.state.description || ""
  );
  const [selectedImage, setSelectedImage] = useState(null);
  

  useEffect(() => {
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    // const formData = new FormData();
    // formData.append("image", e.target.files[0]);
    // axiosClient
    //   .patch(`/formation/${location.state.idFormation}/`,
    //     formData
    //   )
    //   .then((response) => console.log(response.data))
    //   .catch((error) => console.log(error));
    setImage(e.target.files[0])
  };
  console.log(image);

  useEffect(() => {
    axiosClient.get(`/formation/`).then((res) => {
      setListFormation(res.data);
    });
  }, []);

  const [message, setMessage] = useState("");
  const [etatMessage, setEtatMessage] = useState(false);

  const navigate = useNavigate();
  const EditFormation = (title) => {
    if (!titre || !description) {
      setMessage("Veuillez remplir les champs");
      setEtatMessage(true);
      return;
    }
    const formData = new FormData()
    formData.append('titre',titre)
    formData.append('description',description)
    if (selectedImage)formData.append("image", selectedImage)
    axiosClient
      .patch(`/formation/${location.state.idFormation}/`, formData)
      .then(() => {
        toast({
          description: `la formation ${title} est modifiée avec succès`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
        navigate("/formations");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Fragment>
      <Box mb={5} w="90%">
        <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
          Modifier Formation
        </Heading>
      </Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Box
          w={isNotSmallerScreen ? "50%" : "100%"}
          bg={useColorModeValue("white", "gray.700")}
          borderRadius="lg"
          m={{ sm: 4, md: 4, lg: 4 }}
          p={{ sm: 4, md: 4, lg: 4 }}
        >
          <Box p={4} rounded="xl" align="center" justify="center">
            {listFormation.map((val, key) => {
              if (val.id === location.state.idFormation) {
                return (
                  <VStack spacing={5} w="90%">
                  {message &&
                              <Alert status='error' rounded="md">
                                  <AlertIcon />
                                  {message}
                              </Alert>
                          }
                    <FormControl id="name">
                      <FormLabel>Titre Formation</FormLabel>
                      <InputGroup borderColor="#E0E1E7">
                        <Input
                          type="text"
                          size="lg"
                          name="titre"
                          defaultValue={val.titre}
                          onChange={(e) => setTitre(e.target.value)}
                          placeholder="Titre de Formation"
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
                            src={val.image || image}
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
                        onClick={() => EditFormation(titre)}
                      >
                        Modifier la Formation
                      </Button>
                    </FormControl>
                  </VStack>
                );
              }
            })}
          </Box>
        </Box>
        <Box boxSize="lg" display={isNotSmallerScreen ? "block" : "none"} p={5}>
          <Image src={imgAddFormation} alt="Dan Abramov" />
        </Box>
      </Flex>
    </Fragment>
  );
}

export default EditFormation;
