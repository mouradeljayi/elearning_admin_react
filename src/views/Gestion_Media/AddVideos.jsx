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

  Progress,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,

  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  EmailIcon,
  MinusIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import axiosClient from "../../axios-client";
import { useNavigate } from "react-router-dom";

function AddVideos({ id_Module }) {
  const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");

  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [listDocs, setListDocs] = useState([
    {
      name,
      file,
      module: 1,
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
  const [idModule,setIdModule]=useState(id_Module)

  const addVideos = () => {
    listDocs.map((val, key) => {
      const formData = new FormData();

      formData.append("name", val.name);
      formData.append("type", "Video");
      formData.append("file", val.file);
      formData.append("module", id_Module);
      axiosClient
        .post("/videos/", formData, {
          onUploadProgress: (data) => {
            setUploaded(Math.round((data.loaded / data.total) * 100))
            console.log(Math.round((data.loaded / data.total) * 100));
          }
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    });
  };

  console.log(id_Module)

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
            <Stack
              display="flex"
              direction={isNotSmallerScreen ? "row" : "column"}
              p={2}
            >
              <Input
                _hover="none"
                name="name"
                value={val.name}
                placeholder="Name"
                size="sm"
                onChange={(e) => handleinputchange(e, key)}
              />

              <Input
                type="file"
                _hover="none"
                name="file"
                placeholder="URL"
                size="sm"
                onChange={(e) => handleFileChange(e, key)}
              />
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
          <Button colorScheme="yellow" onClick={()=>{
            addVideos()
            onOpenAlert();
          }}>
            Enregistrer Videos
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
              Ajout Vidéos
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

export default AddVideos;
