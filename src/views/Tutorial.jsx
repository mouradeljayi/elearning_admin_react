import React from 'react';
import { AspectRatio } from '@chakra-ui/react'
import react from '../assets/video/React.mp4';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Divider,
    HStack,
    Stack,
    Tag,
    Wrap,
    WrapItem,
    SpaceProps,
    useColorModeValue,
    Container,
    VStack,
} from '@chakra-ui/react';
import { Autoplay, Navigation } from "swiper";


function Tutorial() {
    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={5} mt={5} fontWeight={"bold"} fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    return (
        <Container maxW={'7xl'} p="10">
            <Heading  bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '4xl' }}>
                        Tutoriel
                    </Heading>
            <Box
                marginTop={{ base: '1', sm: '5' }}
                display="flex"
                alignItems="center"
                flexDirection={{ base: 'column', sm: 'row' }}
                justifyContent="space-between">
                <Box
                    display="flex"
                    flex="1"
                    marginRight="5"
                    position="relative"
                    alignItems="center"
                >
                    <Box
                        width={{ base: '100%', sm: '90%' }}
                        zIndex="2"
                        marginLeft={{ base: '0', sm: '6.9%' }}
                        marginTop="6%"
                    >
                        <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                            <AspectRatio ratio={16 / 9} borderRadius="lg">
                                <iframe
                                    title="tutoriel"
                                    src={react}
                                    allowFullScreen
                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                            </AspectRatio>
                        </Link>
                    </Box>
                    <Box zIndex="1" width="90%" position="absolute" height="100%">
                        <Box
                            bgGradient={useColorModeValue(
                                'radial(blue.600 1px, transparent 1px)',
                                'radial(yellow.500 1px, transparent 1px)'
                            )}
                            backgroundSize="15px 15px"
                            opacity="2"
                            height="90%"
                        />
                    </Box>

                </Box>

                <Box
                    display="flex"
                    flex="1"
                    
                    flexDirection="column"
                    marginTop={{ base: '3', sm: '0' }}>
                        <Box  p={'5'}></Box>
                    <Heading color={'yellow.500'} fontSize={{ base: '1xl', sm: '2xl', lg: '3xl' }} marginTop="1">
                        Guide de démarrage
                    </Heading>
                    <Text
                        as="p"
                        marginTop="2"
                        align={'justify'}
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Bienvenue sur la page de tutoriel de la plateforme!
                        Cette page a été conçue pour vous guider dans l'utilisation de l'interface d'administration de la plateforme. Dans cette page, vous trouverez des instructions étape par étape pour vous aider à effectuer les tâches administratives de manière efficace.</Text>
                </Box>
            </Box>
            <Heading marginTop="5">
            </Heading>
            <Box display={{ base: "block", md: "flex" }} flexWrap="wrap"  justifyContent="center" >
                <Divider marginTop="5" height={2} />
                <Wrap spacing={{ base: '10px', md: '30px' }} marginTop={{ base: '2', md: '5' }} direction='row'>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        centeredSlides={false}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        
                    >
                        <SwiperSlide >
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%" >
                                    <Stack
                                        minH={'260px'}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Navigation
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        Lorsque vous vous connectez , vous serez redirigé vers le tableau de bord qui affiche des statistiques sur l'application. À partir de là, vous pourrez accéder aux différentes sections de la plateforme grâce à la barre de navigation située sur la gauche de l'écran.                                        </Text>

                                    </Stack>

                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'250px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                            Gestion des apprenants 
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        Cette section vous permet de gérer les utilisateurs de la plateforme. Vous pouvez ajouter de nouveaux utilisateurs, modifier les informations des utilisateurs et supprimer des utilisateurs. Il est également possible de voir les activités des utilisateurs sur la plateforme.                                            </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'260px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                            Gestion des responsables 
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        Cette interface vous permet de consulter les informations de chaque utilisateur, aussi de les modifier ou de les supprimer. En effet, vous pouvez changer le statut d'un compte en le désactivant ou en l'activant, ainsi que modifier son rôle .                                        </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'260px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                            Gestion des formations
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        La section "Formation" vous aide à gérer les formations proposés sur la plateforme. Vous pouvez créer de nouveaux formation, ajouter des modules à des formation existants, modifier ses informations ou bien les supprimer .                                    </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'260px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                            Gestion des demandes
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">

                                        La page "Demandes" est un espace dédié sur la plateforme qui permet à l'administrateur de gérer les demandes d'inscription, les demandes d'accès aux modules ainsi que les demandes d'activation des modules formulées par les utilisateurs.                                        </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'260px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Certificats
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        L'espace certificat est une section qui permet à l'administrateur de visualiser la liste des certificats délivrés aux apprenants . Cette page permet donc de gérer efficacement les certificats et de faciliter le suivi des apprenants ayant terminé leur formation avec succès.

</Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={6}
                                        minH={'260px'}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={'blue.700'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Suggestions
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                        Là où vous pouvez consulter les messages laissés par les apprenants pour proposer des améliorations sur la plateforme. Vous pouvez également agir sur ces messages en les marquant comme "résolus" ou "en cours".
                                        </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>

                    </Swiper>



                </Wrap>
            </Box>

        </Container>
    );
};

export default Tutorial;