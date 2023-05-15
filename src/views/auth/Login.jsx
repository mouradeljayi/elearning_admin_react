import logo from '../../assets/img/logo.png';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { createRef, useState } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';
import login from '../../assets/img/login.png'

import {
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Image,
    InputGroup,
    InputRightElement,
    Alert,
    AlertIcon,
    Spinner,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {

    const emailRef = createRef()
    const passwordRef = createRef()
    const { setToken, setRefresh, isLoading, setIsLoading } = useStateContext()
    const [message, setMessage] = useState(null)
    const toast = useToast()
    const navigate = useNavigate()

    const onSubmit = ev => {
        toast.closeAll()
        ev.preventDefault()
        setIsLoading(true)
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        axiosClient.post('token/responsable/', payload)
            .then(({ data }) => {
                setToken(data.access);
                setRefresh(data.refresh)
                setIsLoading(false);
                if(data.user.role === 'RESPO') {
                    navigate('/formations')
                }
            })
            .catch((err) => {
                const response = err.response;
                setMessage(response.data.message)
                setIsLoading(false)
            })

    }
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            justify={{ base: 'flex-start', md: 'space-between' }}
            pl={5}
            pr={5}  >

            <Box
                align='center'
                justify='center'
                py="50px"
                w={{base:'100%' ,md:'50%'}}
                pl={20}
            >
                <Image src={logo} w="250px" ></Image>
                <Text letterSpacing={1} fontWeight="10px" fontSize={'2xl'} mb='15px' color="blue.600">Espace responsables</Text>
                <Box p={6} rounded={'lg'} w="100%" maxW="450px" borderWidth={1} borderRadius={8} boxShadow="lg">
                    <Text fontSize={'2xl'} mb='15px'>S'authentifier</Text>
                    <hr />
                    {message &&
                        <Alert status='error' rounded="md">
                            <AlertIcon />
                            {message}
                        </Alert>
                    }
                    <Stack spacing={2} mt='15px'>
                        <FormControl id="email" isRequired isInvalid={message}>
                            <FormLabel>Adresse E-mail</FormLabel>
                            <Input ref={emailRef} type="email" placeholder='Tapez votre adresse e-mail' />
                        </FormControl>
                        <FormControl id="password" isRequired isInvalid={message}>
                            <FormLabel>Mot de passe</FormLabel>
                            <InputGroup>
                                <Input ref={passwordRef} type={showPassword ? 'text' : 'password'} placeholder='Tapez votre mot de passe' />
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
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Se souvenir de moi</Checkbox>
                                <Link color={'blue.400'}>mot de passe oublié?</Link>
                            </Stack>
                            <Button
                                type="submit" onClick={onSubmit} isLoading={isLoading}
                                colorScheme='blue'>
                                {isLoading ? <Spinner size="sm" /> : "Connexion"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            <Box w="50%"
                justify="left"
                alignItems="left"
                p={20}
            >
                <Image display={{ base: 'none', md: 'flex' }}  src={login} />
            </Box>
        </Flex>
    )
}