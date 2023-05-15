import logo from '../assets/img/logo.png';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { useEffect, useState } from 'react';
import axiosClient from '../axios-client';
import { FaChevronCircleLeft, FaUserGraduate, FaUserTie } from 'react-icons/fa';

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  Image,
  HStack,
  Center,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Badge,
  Tooltip

} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiSettings,
  FiMenu,
  FiUsers,
  FiBell,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiGitPullRequest
} from 'react-icons/fi';
import { MdVideoLibrary } from 'react-icons/md';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { BiSupport } from 'react-icons/bi';

// add links to sidebar here
// use icons from 'react-icons/fi'


export default function DefaultLayout() {




  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSiderBar, setIsSideBar] = useState('block');
  const [changedWidth, setChangedWidth] = useState('60');

  const handleCloseSideBar = () => {
    if (isSiderBar === "block") {
      setIsSideBar('none')
      setChangedWidth('full')
    } else {
      setIsSideBar('block')
      setChangedWidth('60')
    }

  }
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: isSiderBar }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} handleCloseSideBar={handleCloseSideBar} isSiderBar={isSiderBar} />
      <Box ml={{ base: 0, md: changedWidth }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {

  const { user } = useStateContext()
  const userRole = user.role

  const LinkItems = {
    SUPERADMIN: [
      { name: 'Dashboard', icon: FiHome, path: '/' },
      { name: 'Formations', icon: FiGitPullRequest, path: '/formations' },
      { name: 'Demandes', icon: FiGitPullRequest, path: '/demandes' },
      { name: 'Apprenants', icon: FaUserGraduate, path: '/apprenants' },
      { name: 'Responsables', icon: FaUserTie, path: '/responsables' },
      { name: 'Certificats', icon: FiStar, path: '/certificats' },
      { name: 'Résultats', icon: FiStar, path: '/resultats' },
      { name: 'Tickets', icon: FiMenu, path: '/tickets' },
      { name: 'Tutoriel', icon: MdVideoLibrary, path: '/tutoriel' },
      { name: 'A propos', icon: BsFillInfoCircleFill, path: '/aPropos' },

    ],
    MASTER: [
      { name: 'Dashboard', icon: FiHome, path: '/' },
      { name: 'Formations', icon: FiGitPullRequest, path: '/formations' },
      { name: 'Demandes', icon: FiGitPullRequest, path: '/demandes' },
      { name: 'Apprenants', icon: FaUserGraduate, path: '/apprenants' },
      { name: 'Responsables', icon: FaUserTie, path: '/responsables' },
      { name: 'Certificats', icon: FiStar, path: '/certificats' },
      { name: 'Résultats', icon: FiStar, path: '/resultats' },
      { name: 'Tickets', icon: FiMenu, path: '/tickets' },
      { name: 'Tutoriel', icon: MdVideoLibrary, path: '/tutoriel' },
      { name: 'A propos', icon: BsFillInfoCircleFill, path: '/aPropos' },

    ],
    ADMIN :[
      { name: 'Dashboard', icon: FiHome, path: '/' },
      { name: 'Formations', icon: FiGitPullRequest, path: '/formations' },
      { name: 'Demandes', icon: FiGitPullRequest, path: '/demandes' },
      { name: 'Apprenants', icon: FaUserGraduate, path: '/apprenants' },
      { name: 'Responsables', icon: FaUserTie, path: '/responsables' },
      { name: 'Certificats', icon: FiStar, path: '/certificats' },
      { name: 'Résultats', icon: FiStar, path: '/resultats' },
      { name: 'Support', icon: BiSupport, path: '/mesTickets' },
      { name: 'Tutoriel', icon: MdVideoLibrary, path: '/tutoriel' },
      { name: 'A propos', icon: BsFillInfoCircleFill, path: '/aPropos' },
  ],
  RESPO : [
      
      { name: 'Formations', icon: FiGitPullRequest, path: '/formations' },
      { name: 'Demandes', icon: FiGitPullRequest, path: '/demandes' },
      { name: 'Apprenants', icon: FaUserGraduate, path: '/apprenants' },
      { name: 'Support', icon: BiSupport, path: '/mesTickets' },
      { name: 'Tutoriel', icon: MdVideoLibrary, path: '/tutoriel' },
      { name: 'A propos', icon: BsFillInfoCircleFill, path: '/aPropos' },
  ]
  };
  const items = LinkItems[userRole] || [];


  return (
    <Box
      transition="3s ease"
      color="white"
      bg={useColorModeValue('blue.600', 'gray.900')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={logo} width="250px" mt="10px"></Image>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {items.map((link) => (
        <NavItem items={items} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, items, ...rest }) => {
  const navigate = useNavigate()
  const { user, setToken, setUser, setRefresh } = useStateContext();

  const location = useLocation();
  const pathLink = items.find(e => e.name === children)
  // current user data
  useEffect(() => {
    axiosClient.get('auth/user/')
      .then(({ data }) => {
        setUser(data)
        console.log(data)
      })
  }, [])
  const handleClick = () => {
    navigate(pathLink.path)
  };
  const [count, setCount] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    axiosClient.get('/plainte/')
      .then((response) => {
        // Update data state variable
        setData(response.data);

        // Count plaintes with etat=false and update count state variable
        const cmp = response.data.filter(pl => !pl.etat).length;
        setCount(cmp);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        m="2"
        p="4"
        mx="4"
        bg={pathLink.path === location.pathname ? "yellow.400" : ""}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'yellow.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}

        {children === 'Tickets' ? (
          <>
            <Box flex={'1'}>
              {children}
            </Box>
            {count > 0 && (
              <Badge rounded="full" bg="#df2e38" style={{ padding: "2px 7px 0 6px" }} color="white" ml='2' >
                {count}
              </Badge>
            )}
          </>
        ) : (
          children
        )}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, handleCloseSideBar, isSiderBar, ...rest }) => {
  const { user, setToken, setUser, setRefresh } = useStateContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const [demande, setDemande] = useState([])
  const [demandeAccess, setDemandeAcces] = useState()
  const [demandeActivation, setDemandeActivation] = useState()

  //user picture
  const [avatarUrl, setAvatarUrl] = useState('');


  // get demande inscription list
  useEffect(() => {
    axiosClient.get('demandes/')
      .then(({ data }) => {
        const filteredDemande = data.filter(d => d.etat && !d.isApproved);
        setDemande(filteredDemande)
      })
  }, [])


  // get demande access module list
  useEffect(() => {
    axiosClient.get('/acces/getDemamdAcces/').then((res) => setDemandeAcces(res.data.length))
    console.log(demandeAccess)
  }, [])

  // get demande activation module list
  useEffect(() => {
    axiosClient.get('/acces/getDemamdReactivation/').then((res) => setDemandeActivation(res.data.length))
  }, [])


  // Logout Function
  const navigate = useNavigate();

  const onLogout = ev => {
    ev.preventDefault()
    setUser({})
    setToken(null)
    setRefresh(null)
    localStorage.removeItem('tokenExpirationTime');
  }
  //stocking the user image
  useEffect(() => {
    axiosClient.get(`/responsables/${user.id}/image`)
      .then(response => {
        setAvatarUrl(response.request.responseURL);
      })
      .catch(error => {
        console.error(error);
      });
  }, [user.id]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverOpen = () => {
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };


  return (

    <Box>

      <Flex

        ml={{ base: 0, md: "full" }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        color="white"
        bg={useColorModeValue('blue.600', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
        {...rest}
      >

        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Image display={{ base: 'flex', md: 'none' }} src={logo} width="200px"></Image>
        <HStack spacing={{ base: '0', md: '6' }}>
          <Flex alignItems="center" position="relative">


            <IconButton
              onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}
              onClick={() => navigate('/demandes')}
              size="lg"
              variant=""
              _hover={
                {
                  bg: '#FFCB42',
                  color: "white"
                }
              }
              aria-label="open menu"
              icon={<FiBell />}
            />
            {isPopoverOpen && (
              <Box
                position="absolute"
                boxShadow="sm"
                p="4"
                width={{ base: "310px", md: "350px" }}
                right={"2px"}

                top="50px"
                borderRadius={"lg"}
                bg={"gray.400"}
              >
                <Text>Demande d'inscription : {demande.length}</Text>

                <Text>Demande d'accés au modules : {demandeAccess}</Text>

                <Text>Demande d'activations de modules : {demandeActivation}</Text>
              </Box>
            )}

            <span
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                backgroundColor: "#DF2E38",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "13px"
              }}
            >

              {demande.length + demandeAccess + demandeActivation}
            </span>
          </Flex>
          <IconButton
            onClick={toggleColorMode}
            size="lg"
            variant=""

            _hover={{
              bg: 'yellow.400',
              color: 'white',
            }}

            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          />
          <Flex alignItems={'center'} color="black">
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
              >
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={avatarUrl}
                  />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm" color="white">{user.first_name} {user.last_name}</Text>
                    <Text fontSize="xs" color="yellow.300">
                      {user.role === "ADMIN" ? "administrateur" : user.role === "SUPERADMIN" ? "super-administrateur" : user.role === "RESPO" ? "responsable" : user.role === "MASTER" ? "Master" : ""}

                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }} color="white">
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList borderColor="white" alignItems={'center'} bg={useColorModeValue('blue.600', 'gray.900')} color="white">
                <br />
                <Center>
                  <Avatar
                    size={'2xl'}
                    src={avatarUrl}
                  />
                </Center>
                <br />
                <Center>
                  <p> {user.email}</p>
                </Center>
                <br />
                <MenuItem _hover={{ bg: 'blue.800', color: 'white', }} bg={useColorModeValue('blue.600', 'gray.900')} onClick={() => navigate('/profile')} >Profile</MenuItem>
                <MenuDivider />
                <MenuItem _hover={{ bg: 'blue.800', color: 'white', }} bg={useColorModeValue('blue.600', 'gray.900')} onClick={onLogout}>Logout</MenuItem>

              </MenuList>
            </Menu>
          </Flex>

        </HStack>

      </Flex>
      {isSiderBar === "block" ? (
        <IconButton
          icon={<FaChevronCircleLeft />}
          onClick={handleCloseSideBar}
          display={{ base: 'none', md: 'block' }}
          variant=""
          style={{
            position: "absolute",
            left: "220px",
            top: "25px",
            color: "#ECC94B",
            fontSize: "20px",
            fontWeight: "bolder",

          }}
        />
      ) : (
        <IconButton
          onClick={handleCloseSideBar}
          icon={<FiMenu />}
          variant="outline"
          aria-label="open menu"
          style={{
            position: "absolute",
            left: "10px",
            top: "20px",
            color: "white",
            fontSize: "20px",
            fontWeight: "bolder",
          }}
        />
      )}

    </Box>
  );
};
