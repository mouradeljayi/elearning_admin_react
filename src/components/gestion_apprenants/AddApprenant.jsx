import logo from '../../assets/img/logo.png';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { GrAdd } from 'react-icons/gr';
import { createRef, useState, useEffect } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import axios from 'axios';
import apprenant_img from '../../assets/img/apprenantimg.png'
import { useNavigate } from 'react-router-dom';


import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Flex,
  InputGroup,
  HStack,
  InputRightElement,
  useColorModeValue,
  Stack,
  Button,
  Heading,
  Text,
  Image,
  Alert,
  useToast,
  AlertIcon,
  Spinner,
  Select,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Menu,
  MenuButton,

} from '@chakra-ui/react';
import axiosClient from '../../axios-client';
import { BiChevronDown } from 'react-icons/bi';


const linkStyle = {
  color: '#3C8DBC',
  textDecoration: "underline"
}


export default function AddApprenant() {
  const navigate = useNavigate()

  const first_name = createRef()
  const last_name = createRef()
  const email = createRef()
  const address = createRef()
  const password = createRef()
  const confirmPassword = createRef()

  const [pwd, setPwd] = useState('');

  const [message, setMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false);
  const { notification, setNotification, isLoading, setIsLoading } = useStateContext()

  const toast = useToast()


  ////////////////////////// VALIDATION DE MOT DE PASSE /////////////////////////////////////////
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordColor, setPasswordColor] = useState('');

  const checkPasswordStrength = () => {
    const minLengthRegex = /^.{8,}$/;
    const startLenght = /^.{2,}$/;
    const digitRegex = /\d/;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;

    if (minLengthRegex.test(pwd) && digitRegex.test(pwd) && lowercaseRegex.test(pwd) && uppercaseRegex.test(pwd)) {
      setPasswordStrength('Fort');
      setPasswordColor('green');
    } else if (minLengthRegex.test(pwd) && (digitRegex.test(pwd) || lowercaseRegex.test(pwd) || uppercaseRegex.test(pwd))) {
      setPasswordStrength('Moyen');
      setPasswordColor('orange.300');
    } else if (startLenght.test(pwd)) {
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
  }, [pwd]);
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



  const onSubmit = ev => {
    ev.preventDefault()
    const payload = {
      first_name: first_name.current.value,
      last_name: last_name.current.value,
      email: email.current.value,
      address: address.current.value,
      password: password.current.value,
      selectedItems: selectedItems,
    }
    setMessage("")
    if (password.current.value !== confirmPassword.current.value) {
      setMessage("veuillez confirmer votre mot de passe")
    } else if (passwordStrength !== 'Fort' && password.current.value.length > 0 && !isPasswordValid(password.current.value)) {
      return;
    } else {
      axiosClient.post('/apprenants/', payload)
        .then(() => {
          toast({
            description: "l'apprenant est ajouté avec succès",
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'bottom-right'
          })
          navigate('/apprenants')
        })
        .catch((err) => {
          toast({
            description: "ce mail existe déja",
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position: 'bottom-right'
          })
        })
    }

  }
  ///////////////////////////////////////////////////////////////////////////////////////

  const [selectedItems, setSelectedItems] = useState([]);
  const [listModule, setListModule] = useState([])
  const [listFormation, setListFormation] = useState([])

  const handleItemSelect = (selectedValue) => {
    console.log('Selected value:', selectedValue);
    setSelectedItems(prevItems => [...prevItems, selectedValue]);
  };

  const handleItemDeselect = (selectedValue) => {
    setSelectedItems(prevItems => prevItems.filter(item => item !== selectedValue));
  };


  useEffect(() => {
    axiosClient.get('module/')
      .then((res) => {
        setListModule(res.data)
      })
  }, [])
  useEffect(() => {
    axiosClient.get('formation/')
      .then((res) => {
        setListFormation(res.data)
      })
  }, [])

  const handle = () => {
    console.log(selectedItems);
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);




  return (
    <Box >
      <Heading bgGradient='linear(to-l, #ffd140, #2b6cb0)' bgClip='text' ml={5} mt={5} fontSize={{ base: '2xl', sm: '3xl' }}>
        Ajouter un apprenant
      </Heading>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify={{ base: 'flex-start', md: 'space-between' }}
        p={5}
      >


        <Stack
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'lg'}
          p={6}
          my={6}
        >
          {message &&
            <Alert status='error' rounded="md">
              <AlertIcon />
              {message}
            </Alert>
          }
          <Box p={5} rounded={'lg'} w="100%" maxW="full"
            align={'center'}
            justify={'center'}>

            <Stack spacing={2} w={{ base: '100%', md: '100%', lg: '100%', sm: '100%' }}>
              <HStack >
                <Box w="50%">
                  <FormControl id="firstName" isRequired isInvalid={message}>
                    <FormLabel>Nom</FormLabel>
                    <Input ref={first_name} name="first_name" type="text" placeholder='Tapez votre nom' />
                  </FormControl>
                </Box>
                <Box w="50%">
                  <FormControl id="lastName" isRequired isInvalid={message}>
                    <FormLabel>Prénom</FormLabel>
                    <Input ref={last_name} name="last_name" type="text" placeholder='Tapez votre prénom' />
                  </FormControl>
                </Box>
              </HStack>
              <HStack spacing={2}>
                <Box w="50%">
                  <FormControl id="email" isRequired isInvalid={message}>
                    <FormLabel>Adresse email</FormLabel>
                    <Input ref={email} name="email" type="email" placeholder='Tapez votre adresse e-mail' />
                  </FormControl>
                </Box>
                <Box w="50%">
                  <FormControl id="adresse" isInvalid={message}>
                    <FormLabel>Adresse</FormLabel>
                    <Input ref={address} name="address" type="text" placeholder='Tapez votre adresse' />
                  </FormControl>
                </Box>
              </HStack>


              <FormControl id="password" isRequired isInvalid={message}>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup>
                  <Input ref={password} name="password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPwd(e.target.value)} placeholder='Tapez votre mot de passe' />
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
                <Text align="left" fontSize="sm" mt={2} color={passwordColor}>{`Fiabilité du mot de passe: ${passwordStrength}`}</Text>

              </FormControl>
              <FormControl id="password_confirmation" isRequired>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <InputGroup>
                  <Input ref={confirmPassword} name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' />
                </InputGroup>
              </FormControl>

               <Box display={'flex'} justify="left" align="left">
                  <FormControl id="access" isRequired isInvalid={message}>
                    <FormLabel>Acces</FormLabel>
                    <Menu closeOnSelect={false}>
                      <MenuButton w={{ base: '100%', md: '50%' }}  rightIcon={<BiChevronDown />} as={Button} bg='none' _focus={'none'} _hover={'none'} style={{border:"1px solid lightgray"}}>
                        Sélectionnez
                      </MenuButton>
                      <MenuList >
                        {listFormation.map((formation, index) => {
                          return (
                            <div key={formation.id}>
                              <MenuOptionGroup title={formation.titre} type='checkbox'>
                                {listModule.filter(val => val.formation === formation.id).map((val, index) => (
                                  <MenuItemOption
                                    key={val.id}
                                    value={val.id}
                                    onClick={() => {
                                      if (selectedItems.includes(val.id)) {
                                        handleItemDeselect(val.id);
                                      } else {
                                        handleItemSelect(val.id);
                                      }
                                    }}
                                    isChecked={selectedItems.includes(val.id)}
                                  >
                                    {val.titre}
                                  </MenuItemOption>
                                ))}
                              </MenuOptionGroup>
                            </div>
                          )
                        })}
                      </MenuList>

                    </Menu>
                  </FormControl>
                  </Box>


              <Stack direction={['column', 'row']} spacing={10} pt={2} justifyContent="end"
              >

                <Button
                  type="submit" onClick={onSubmit} isLoading={isLoading}
                  colorScheme='yellow'
                  leftIcon={<GrAdd />}>
                  {isLoading ? <Spinner size="sm" /> : "Ajouter"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Stack w="50%"
          justify="center"
          alignItems="center"
          p={10}
        >
          <Image display={{ base: 'none', md: 'flex' }} src={apprenant_img} />
        </Stack>
      </Flex>


    </Box>

  )
}