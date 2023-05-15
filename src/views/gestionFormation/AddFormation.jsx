import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  Textarea,
  VStack,
  Wrap,
  Alert,
  AlertIcon,
  WrapItem,
  Image,
  Badge,
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
import imgAddFormation from "../../assets/img/add_formation.png";
import defaultImage from "../../assets/img/default-image.jpg";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

function AddFormation() {


  const toast = useToast();

  const [isNotSmallerScreen] = useMediaQuery("(min-width: 1196px)");
  const [message, setMessage] = useState('')

  //
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState(null);
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
    console.log(image);
  };

  const navigate = useNavigate();
  const addFormation = (title) => {
    if (!titre || !description || !selectedImage) {
      setMessage("Veuillez remplir les champs!")
      return;
    }
    const formData = new FormData();
    formData.append("description", description);
    if (selectedImage){formData.append("image", selectedImage);}
    formData.append("titre", titre);
    formData.append("etat", etat);

    axiosClient
      .post(`/formation/`, formData)
      .then(() => {
        toast({
          description: `la formation ${title} est ajoutée avec succès`,
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
          Nouvelle Formation
        </Heading>
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
              <FormControl id="name" isRequired >
                <FormLabel>Titre Formation</FormLabel>
                <InputGroup borderColor="#E0E1E7">
                  <Input
                    type="text"
                    size="lg"
                    name="titre"
                    bg="none"
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Titre de Formation"
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
              <FormControl id="description" isRequired >
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
              <FormControl id="etat" display="flex" justifyContent="start">
                <Checkbox
                  size="lg"
                  colorScheme="green"
                  name="etat"
                  onChange={() => setEtat(!etat)}
                >
                  Activez la formation
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
                  onClick={() => addFormation(titre)}
                >
                  Ajouter Formation
                </Button>
              </FormControl>
            </VStack>
          </Box>
          {/* <Box p={4}>
            <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
              <WrapItem>
                <Box bg="white" borderRadius="lg">
                  <Box m={8} color="#0B0E3F">
                    <VStack spacing={5}>
                      <FormControl id="name">
                        <FormLabel>Titre Formation</FormLabel>
                        <InputGroup borderColor="#E0E1E7">
                          <Input
                            type="text"
                            size="lg"
                            name="titre"
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Titre de Formation"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl id="name">
                        <FormLabel>Image</FormLabel>
                        <InputGroup borderColor="#E0E1E7">
                          <Input
                            type="file"
                            size="lg"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                              backgroundColor: "#F9FAFB",
                              backgroundColor: "#F9FAFB",
                              color: "#111827",
                              fontSize: "0.875rem",
                              lineHeight: "1.25rem",
                              width: "100%",
                              borderRadius: "0.5rem",
                              borderWidth: "1px",
                              borderColor: "#D1D5DB",
                              cursor: "pointer",
                            }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl id="name">
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
                      <FormControl id="name" float="right">
                        <Button
                          variant="solid"
                          bg="#ffd140"
                          color="black"
                          _hover="none"
                          onClick={addFormation}
                        >
                          Ajouter Formation
                        </Button>
                      </FormControl>
                    </VStack>
                  </Box>
                </Box>
              </WrapItem>
            </Wrap>
          </Box> */}
        </Box>
        <Box boxSize="lg" display={isNotSmallerScreen ? "block" : "none"} p={5}>
          <Image src={imgAddFormation} alt="Dan Abramov" />
        </Box>
      </Flex>
    </Fragment>
  );
}

export default AddFormation;
