import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from 'react-lottie';
import feed from '../../assets/lot/feeds.json';
import learning from '../../assets/lot/learning.json';
import {
    Box,
    Flex,
    Avatar,
    Text,
    useColorModeValue,
    Button,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Input,
    Heading,
} from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import axiosClient from "../../axios-client";
import Moment from 'react-moment';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import Chart from "react-apexcharts";

const defaultOpt = {
    loop: true,
    autoplay: true,
    animationData: feed,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const EmptyList = {
    loop: true,
    autoplay: true,
    animationData: learning,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

function ListFeedBack() {

    const location = useLocation();
    const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const [deleteId, setDeleteId] = useState(null);
    const cancelRef = React.useRef();

    const [listFeedBack, setListFeedBack] = useState([])
    const [listApprenant, setListApprenant] = useState([])

    useEffect(() => {
        axiosClient.get(`/feedback/?search=${location.state.idModule}`).then((res) => setListFeedBack(res.data.sort().reverse()))
        axiosClient.get(`/apprenants/`).then((res) => setListApprenant(res.data))
    }, [])

    const bg = useColorModeValue("gray.200", "gray.500")
    const color = useColorModeValue("gray.700", "white.100")

    const likeFeed = (id, like) => {
        const formData = new FormData();
        formData.append("like", !like);
        axiosClient.patch(`/feedback/${id}/`, formData)
            .then((res) => {
                setListFeedBack(rows => rows.map(row => {
                    if (row.id === id) {
                        return {
                            ...row,
                            like: !like
                        }
                    }
                    return row
                }))
            })
    }

    const deleteFeed = (id) => {
        axiosClient.delete(`/feedback/${id}/`).then((response) => {
            setListFeedBack((prevData) => prevData.filter((row) => row.id !== id));
            toast({
                title: "Suppression",
                description: `Le Commentaire est suppprimé avec succès`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        });
        onClose();
    }

    //code hatim
    const [raiting, setRaiting] = useState("");
    const [listRationgwithIds, setListRatingwithIds] = useState([]);
    const [listRating, setListRating] = useState([]);
    const [raiting1, setRaiting1] = useState()
    const [raiting2, setRaiting2] = useState()
    const [raiting3, setRaiting3] = useState()
    const [raiting4, setRaiting4] = useState()
    const [raiting5, setRaiting5] = useState()
    useEffect(() => {
        axiosClient
            .get(
                `/rating/getRatingsByIds/?idModule=${location.state.idModule}&idApprenant=2`
            )
            .then((res) => setListRatingwithIds(res.data));
        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setListRating(res.data));


        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setRaiting1(res.data.filter(e => e.raiting === 1).length));
        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setRaiting2(res.data.filter(e => e.raiting === 2).length));
        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setRaiting3(res.data.filter(e => e.raiting === 3).length));
        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setRaiting4(res.data.filter(e => e.raiting === 4).length));
        axiosClient
            .get(`/rating/getRatingsByModule/?idModule=${location.state.idModule}`)
            .then((res) => setRaiting5(res.data.filter(e => e.raiting === 5).length));
    }, []);

    console.log("size list = ", listRating.length);
    console.log(raiting1, ' ', raiting2, ' ', raiting3, ' ', raiting4, ' ', raiting5);

    const state = {
        options: {},
        series: [raiting1, raiting2, raiting3, raiting4, raiting5],
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
    };

    return (
        <Box mt='5px'>

            <Box mb={5} w="90%">
                <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: "2xl", sm: "3xl" }}>
                    FeedBack
                </Heading>
            </Box>
            {listFeedBack.length > 0 &&
                <Box display="flex" w="100%" justifyContent="space-between">





                    <Box m="3" w="40%" height={isNotSmallerScreen ? "500px" : ""} maxW={isNotSmallerScreen ? "50%" : "100%"} width="100%" overflowY={isNotSmallerScreen ? "auto" : "none"}>

                        {/* {listRationgwithIds.length === 0 && (
                            <div>
                                <input
                                    name="raiting"
                                    type="number"
                                    onChange={(e) => setRaiting(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        axiosClient.post("/rating/", {
                                            module: location.state.idModule,
                                            apprenant: 2,
                                            rating: raiting,
                                        });
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        )}
                        {listRationgwithIds.length > 0 &&
                            listRationgwithIds.map((val, key) => {
                                return (
                                    <div key={key}>
                                        <input
                                            name="raiting"
                                            defaultValue={val.raiting}
                                            type="number"
                                            onChange={(e) => setRaiting(e.target.value)}
                                        />
                                        <button
                                            onClick={() => {
                                                const formData = new FormData();
                                                formData.append("rating", raiting);
                                                axiosClient.patch(`/rating/${val.id}/`, formData);
                                            }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                );
                            })}

                        <hr />
                        <text>get Data</text>
                        {listRating.map((val, key) => {
                            return <text>{val.raiting}</text>;
                        })}

                        <div className="donut">
                            <Chart
                                options={state.options}
                                series={state.series}
                                type="pie"
                                width="380"
                            />
                        </div> */}

                        {listFeedBack.map((val, key) => {
                            return (
                                <Box position="relative" my="15px" w="90%">
                                    {listApprenant.map((v, k) => {
                                        if (v.id === val.apprenant) {
                                            return (
                                                <>
                                                    <Avatar size="sm" src={v.image} position="absolute" top="0" left="0" />
                                                    <Text fontSize={"12px"} color={color} fontStyle={'oblique'} ml={"45px"}>
                                                        {`${v.first_name} ${v.last_name}`}
                                                    </Text>
                                                </>
                                            )
                                        }
                                    })}
                                    <Box
                                        bg={bg}
                                        color={color}
                                        px="3"
                                        py="2"
                                        rounded="3xl"
                                        shadow="md"
                                        w={'100%'}
                                        ml="8" // Add margin to push message to the right of the avatar
                                    >
                                        <Flex justify="space-between" direction="column">
                                            <Box textAlign="right">
                                                <Text fontSize="2xs" fontWeight="bold" color="gray.400">
                                                    <Moment format='MMMM DD YYYY, h:mm:ss a'>{val.created_at}</Moment>
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" textAlign="left">
                                                    {val.message}
                                                </Text>
                                            </Box>
                                            <Box textAlign="right">
                                                <Flex justify='end'>
                                                    {val.like &&
                                                        <AiFillHeart color={val.like && '#ff000099'} fontSize="20" cursor='pointer' defaultValue={val.like} onClick={() => likeFeed(val.id, val.like)} />
                                                    }
                                                    {!val.like &&
                                                        <AiOutlineHeart fontSize="20" cursor='pointer' defaultValue={val.like} onClick={() => likeFeed(val.id, val.like)} />
                                                    }
                                                    <div style={{ marginLeft: '5px' }}>
                                                        <BsTrash cursor='pointer' fontSize="20" onClick={() => {
                                                            setDeleteId(val.id)
                                                            onOpen();
                                                        }} />
                                                    </div>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </Box>
                            )
                        })}

                    </Box>

                    <Box w="50%" h="auto" display={isNotSmallerScreen ? "block" : "none"}>

                        {/* Add an Image component here with the source of your image */}
                        <Lottie height="100%" width="100%" options={defaultOpt} />
                    </Box>


                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Supprimer FeedBack
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    êtes-vous sûr ? Vous ne pourrez pas annuler cette action
                                    ultérieurement.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={() => deleteFeed(deleteId)}
                                        colorScheme="red"
                                        ml={3}
                                    >
                                        Supprimer
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>



                </Box>
            }

            {listFeedBack.length === 0 &&
                <Box>
                    <Flex align="end" justify="center">
                        <Lottie height="30%" width="60%" options={EmptyList} />
                    </Flex>
                    <Flex align="end" justify="center">
                        <Text fontWeight="bold" fontSize="xl">Aucune ligne correspondante n'a été trouvée.</Text>
                    </Flex>

                </Box>
            }

        </Box>

    )
}

export default ListFeedBack