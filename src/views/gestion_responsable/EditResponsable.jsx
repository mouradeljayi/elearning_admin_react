import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    Stack,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    HStack,
    Avatar,
    VStack,
    AvatarBadge,
    IconButton,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Divider,
    Alert,
    AlertIcon,
    useToast
} from '@chakra-ui/react';
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import React, { useState, useEffect, useRef } from 'react';
import { EditIcon ,ViewOffIcon, ViewIcon} from '@chakra-ui/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
function EditResponsable() {
    const location = useLocation()
    const navigate = useNavigate()

    const [avatarUrl, setAvatarUrl] = useState('');

    const { id } = useParams();
    const [responsable, setResponsable] = useState('');
    const [initialUserData, setInitialUserData] = useState({});


    useEffect(() => {
        axiosClient.get(`/responsables/${location.state.idResponsable}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axiosClient.get(`/responsables/${location.state.idResponsable}/`)
            .then(({ data }) => {
                setResponsable(data)
                setInitialUserData(data);
                console.log(data)
            })
    }, [])

    //toast variable
    const toast = useToast()
    //modal variables
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    //password variables
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    //stocking the user image
    useEffect(() => {
        axiosClient.get(`/responsable/${responsable.id}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, [responsable.id]);

    const initialForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      const resetForm = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength('');
        setPasswordColor('gray.500');
        setShowPassword(false);
        setShowPasswords(false);
      };
      const handleCancel = () => {
        setResponsable(initialUserData);
    };
    const handlepwdCancel = () => {
        resetForm();
        onClose();
    };
    ////////////////////////// VALIDATION DE MOT DE PASSE /////////////////////////////////////////
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordColor, setPasswordColor] = useState('');

    const checkPasswordStrength = () => {
        const minLengthRegex = /^.{8,}$/;
        const startLenght = /^.{2,}$/;
        const digitRegex = /\d/;
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;

        if (minLengthRegex.test(newPassword) && digitRegex.test(newPassword) && lowercaseRegex.test(newPassword) && uppercaseRegex.test(newPassword)) {
            setPasswordStrength('Fort');
            setPasswordColor('green');
        } else if (minLengthRegex.test(newPassword) && (digitRegex.test(newPassword) || lowercaseRegex.test(newPassword) || uppercaseRegex.test(newPassword))) {
            setPasswordStrength('Moyen');
            setPasswordColor('orange.300');
        } else if (startLenght.test(newPassword)) {
            setPasswordStrength('Faible');
            setPasswordColor('red');
        }
        else {
            setPasswordStrength('');
            setPasswordColor('gray');
        }
    }

    useEffect(() => {
        checkPasswordStrength();
    }, [newPassword]);


    // check the password complexity
    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const minLengthRegex = /^.{8,}$/;
        const digitRegex = /\d/;
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;

        let errors = [];

        if (!minLengthRegex.test(password)) {
            errors.push('Le mot de passe doit comporter au moins 8 caractères.');
        }

        if (!digitRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins un chiffre.');
        }

        if (!lowercaseRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
        }

        if (!uppercaseRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
        }
        if (password.length > 20) {
            errors.push('Le mot de passe ne doit pas dépasser 20 caractères.');
          }

        if (errors.length > 0) {
            setMessage(errors[0]);
            return false;
        }

        return passwordRegex.test(password);
    };
    // change password 
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid(newPassword)) {
            return;
        }
        try {
            const response = await axiosClient.put(`/password_update/${responsable.id}/`, {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            if (response.data.success) {
                toast({
                    description: "le mot de passe est creer avec succes",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                onClose()
            }
            console.log(response.data.message);
            setMessage(response.data.error);
            setError('erroooor');
            console.log(response.data.error)
        } catch (err) {
            setMessage('erroooor');
            setError(err.response.data.error);
        }
    };
    //get the inputs values
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setResponsable((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };


    //get the image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setResponsable((prevUserData) => ({
            ...prevUserData,
            image: file,
            imageUrl: imageUrl,
          }));
        }
      };
       //edit form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("first_name", responsable.first_name);
        formData.append("last_name", responsable.last_name);
        formData.append("email", responsable.email);
        if (typeof responsable.image === 'object') {
            formData.append("image", responsable.image);
        }
        formData.append("address", responsable.address);
        // Send the updated user data to the API
        for (const [key, value] of formData.entries()) {
            console.log(key + ": " + value);
        }
        try {
            const response = await axiosClient.put(`/user_update/${responsable.id}/`, formData);
            if (response.data.message) {
                toast({
                    description: "le responsable est modifié avec succes",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                onClose();
                navigate(`/responsables`)
            }
        } catch (err) {
            toast({
                description: "Ce mail existe déja",
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
        }
       
    navigate(`/responsables`)
    };


  return (
    <Box mt="5px" >
            <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' fontSize={{ base: '2xl', sm: '3xl' }}>
                Modifier responsable
            </Heading>
            <Flex
                align={'center'}
                justify={'center'}

            >

                <Stack

                    w={{ base: '90%', md: '90%', lg: '80%' }}
                    maxW='full'

                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'lg'}
                    p={{ base: 4, md: 6, lg: 8 }}
                    my={{ base: 4, md: 8 }}>

                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4, md: 8 }} p={{ base: 4, md: 6, lg: 8 }}>
                        <Box flex={{ base: '0 0 auto', md: 'auto 0 0' }} w={{ base: '100%', md: '30%' }} >
                            <Flex justifyContent="center" alignItems="center" h="100%">
                                <FormControl id="img" >
                                    <Center>
                                        <label htmlFor="imageInput">
                                            <input
                                                id="imageInput"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <Avatar boxSize={['100px', '150px', '200px', '250px']} src={responsable.imageUrl || avatarUrl}>
                                                <AvatarBadge
                                                    boxSize={{ base: '2em', sm: '2.5em', md: '4em' }}
                                                    rounded="full"
                                                    bg="#ffd140"
                                                    _hover={{
                                                        bg: '#ffc50f',
                                                    }}
                                                    position="absolute"
                                                    top="20%"
                                                    right={{ base: '-10px', sm: '-12px', md: '-16px' }}
                                                    transform="translateY(-20%)"
                                                    aria-label="remove Image"
                                                    icon={<EditIcon />}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <EditIcon />
                                                </AvatarBadge>
                                            </Avatar>

                                        </label>
                                    </Center>
                                </FormControl>
                            </Flex>
                        </Box>
                        <Center display={{ base: 'none', md: 'flex' }} height={{ base: 0, md: '300px' }}>
                            <Divider orientation='vertical' />
                        </Center>
                        <Box flex={{ base: '0 0 auto', md: '1 0 0' }} w={{ base: '100%', md: '70%' }} >
                            <VStack align={{ base: 'stretch', md: 'start' }} spacing={4} p={2} >

                                <HStack spacing={3} w="100%">
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="last_name" >
                                            <FormLabel>Nom</FormLabel>
                                            <Input
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={responsable.last_name}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="first_name" >
                                            <FormLabel>Prenom</FormLabel>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                value={responsable.first_name}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <FormControl id="email" >
                                    <FormLabel>Address Email</FormLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="email"
                                        value={responsable.email}
                                        onChange={handleInputChange}

                                    />
                                </FormControl>
                                <Stack w="100%" direction={['column', 'row']} spacing={3}>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="address" >
                                            <FormLabel>Address</FormLabel>
                                            <Input

                                                id="address"
                                                name="address"
                                                value={responsable.address}
                                                type="text"
                                                onChange={handleInputChange}

                                            />
                                        </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <Button
                                            onClick={onOpen}

                                            mt="32px"
                                            w="100%"
                                            colorScheme="green"
                                        >
                                            Modifier le mot de passe
                                        </Button>
                                    </Box>
                                </Stack>

                            </VStack>
                            <Stack spacing={2} direction={['column', 'row']} justifyContent="end" mt="30px" >
                            <Button
                                    colorScheme="red"
                                    onClick={() => navigate('/responsables')}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type='submit'
                                    onClick={handleSubmit}
                                    colorScheme="blue">
                                    Enregistrer
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>


                </Stack>
                <>


                <Modal
                        closeOnOverlayClick={false}
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Modifier le mot de passe</ModalHeader>
                            <ModalCloseButton />
                            <hr />
                            {message &&
                                <Alert status='error' rounded="md">
                                    <AlertIcon />
                                    {message}
                                </Alert>
                            }
                            <ModalBody pb={6}>
                            <FormControl>
                                    <Text fontSize="sm" color='yellow.600'>Le mot de passe doit comporter au moins 8 caractères et contenir au moins un chiffre, une lettre minuscule et une lettre majuscule.</Text>

                                    <FormLabel>Ancien mot de passe</FormLabel>
                                    <InputGroup>
                                        <Input

                                            type={showPasswords ? 'text' : 'password'}
                                            id="old_password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}

                                        />
                                        <InputRightElement h={'full'}>
                                            <Button
                                                variant={'ghost'}
                                                onClick={() =>
                                                    setShowPasswords((showPasswords) => !showPasswords)
                                                }>
                                                {showPasswords ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>

                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <InputGroup>
                                        <Input

                                            type={showPassword ? 'text' : 'password'}
                                            id="new_password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onCopy={(e) => e.preventDefault()}

                                        />
                                        <InputRightElement h={'full'}>
                                            <Button
                                                variant={'ghost'}
                                                onClick={() =>
                                                    setShowPassword((showPassword) => !showPassword)
                                                }>
                                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>

                                </FormControl>
                                <Text fontSize="sm" mt={2} color={passwordColor}>{`Fiabilité du mot de passe: ${passwordStrength}`}</Text>


                                <FormControl mt={4}>
                                    <FormLabel>Confirmer mot de passe</FormLabel>
                                    <Input
                                        type="password"
                                        id="confirm_password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={handleFormSubmit} type="submit" colorScheme='blue' mr={3}>
                                    Enregistrer
                                </Button>
                                <Button onClick={handlepwdCancel}>Annuler</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            </Flex>
        </Box>
  )
}

export default EditResponsable