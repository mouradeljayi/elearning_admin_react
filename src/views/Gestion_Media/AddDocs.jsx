import React, { Fragment, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Select,
  WrapItem,
  VStack,
  InputGroup,
  Box,
  Image,
  useToast,
  Text,

  Progress,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,

} from "@chakra-ui/react";
import {
  AddIcon,
  EmailIcon,
  MinusIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import defaultFileImage from "../../assets/img/default-file-image.png";
import { useMediaQuery } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";

function AddDocs({ id_Module }) {
  const [isNotSmallerScreen] = useMediaQuery("(min-width: 730px)");

  const [selectedFile, setSelectedFile] = useState(null);

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [url, seturl] = useState("");
  const [type, setType] = useState("");
  const [listDocs, setListDocs] = useState([
    {
      name,
      url,
      type,
      file,
      module: id_Module,
    },
  ]);

  const handleinputchange = (e, i) => {
    const { name, value } = e.target;
    const list = [...listDocs];
    list[i][name] = value;
    setListDocs(list);
  };

  const handleFileChange = (e, i) => {
    const { name, files } = e.target;
    const list = [...listDocs];
    list[i][name] = files[0];
    setListDocs(list);
    console.log(e.target.files);
  };

  const AddForm = () => {
    setListDocs([
      ...listDocs,
      {
        name: "",
        type: "",
        file: "",
      },
    ]);
  };

  const RemoveForm = (i) => {
    if (window.confirm("Êtes-vous sure de supprimer cette ligne ?")) {
      const list = [...listDocs];
      list.splice(i, 1);
      setListDocs(list);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  const [uploaded, setUploaded] = useState(null)

  const cancelRef = React.useRef();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onOpenAlert = () => {
    setIsAlertOpen(true);
  };

  const onCloseAlert = () => {
    setIsAlertOpen(false);
  };


  const toast = useToast();
  const navigate = useNavigate();
  const addDocs = () => {
    listDocs.map((val, key) => {
      const formData = new FormData();

      formData.append("name", val.name);
      formData.append("type", "PDF");
      formData.append("file", val.file);
      formData.append("module", id_Module);
      axiosClient
        .post("/docs/", formData, {
          onUploadProgress: (data) => {
            setUploaded(Math.round((data.loaded / data.total) * 100))
            console.log(Math.round((data.loaded / data.total) * 100));
          }
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
      // if (uploaded === 100) {
      //   navigate("/list_medias", {
      //     state: {
      //       idModule: id_Module,
      //     },
      //   });
      // }
    });
  };

  return (
    <Fragment>
      {listDocs.map((val, key) => {
        return (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            key={key}
            my={5}
            borderRadius="lg"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            border="1px solid rgba(0, 0, 0, 0.25)"
            py={2}
            px={5}
          >
            <Stack>
              {
                <Button
                  colorScheme="pink"
                  variant="solid"
                  size="sm"
                  isDisabled={listDocs.length === 1}
                  onClick={() => RemoveForm(key)}
                >
                  <MinusIcon />
                </Button>
              }
            </Stack>
            <Stack>
              <Stack direction={isNotSmallerScreen ? "row" : "column"} p={2}>
                <Input
                  _hover="none"
                  name="name"
                  value={val.name}
                  placeholder="Name"
                  size="sm"
                  onChange={(e) => handleinputchange(e, key)}
                />
                {/* <Select
                  placeholder="Type de Fichier"
                  name="type"
                  value={val.type}
                  size="lg"
                  onChange={(e) => handleinputchange(e, key)}
                >
                  <option value={"PDF"}>PDF</option>
                  <option value={"PPT"}>PPT</option>
                </Select> */}
                {/* <HStack >
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, key)}
                    style={{ display: "none" }}
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button
                      as="span"
                      leftIcon={<FaUpload />}
                      colorScheme="teal"
                      size="md"
                      fontSize="sm"
                      fontWeight="normal"
                    >
                      Choose a file
                    </Button>
                  </label>
                  {file && (
                    <Text fontSize="sm" fontWeight="bold">
                      {file.name}
                    </Text>
                  )}
                </HStack> */}

                <Input
                  type="file"
                  _hover="none"
                  name="file"
                  placeholder="URL"
                  size="sm"
                  onChange={(e) => handleFileChange(e, key)}
                />
              </Stack>
            </Stack>
            <Stack>
              {
                <Button
                  colorScheme="teal"
                  isDisabled={listDocs.length - 1 !== key}
                  variant="solid"
                  size="sm"
                  onClick={AddForm}
                >
                  <AddIcon />
                </Button>
              }
            </Stack>
          </Flex>
        );
      })}
      <Flex alignItems="center" justifyContent="end">
        <WrapItem>
          <Button colorScheme="yellow" onClick={() => {
            addDocs()
            onOpenAlert();
          }}>
            Enregistrer documents
          </Button>
        </WrapItem>
      </Flex>


      {/* Alert for delete */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Ajout Document
            </AlertDialogHeader>

            <AlertDialogBody>
              <Progress hasStripe value={uploaded} />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => {
                  toast({
                    description: `ajouts avec succès`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right",
                  });
                  navigate("/list_medias", {
                    state: {
                      idModule: id_Module,
                    },
                  });
                }}
                colorScheme="red"
                ml={3}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Fragment>
  );
}

export default AddDocs;
