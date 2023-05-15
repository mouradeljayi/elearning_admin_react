import { Navigate, useNavigate } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';
import { useToast } from '@chakra-ui/toast';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';

const RequireAuth = ({ element, allowedRoles }) => {
  const { token, setToken, setRefresh } = useStateContext();
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpirationTime = localStorage.getItem('tokenExpirationTime');
    if (tokenExpirationTime && new Date().getTime() > tokenExpirationTime) {
      // Token has expired, remove it from state and localStorage
      setToken(null)
      localStorage.removeItem('tokenExpirationTime');
      toast({
        title: "Session expiré",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
        status: "warning",
        duration: 1000000000,
        isClosable: true,
        position: "top",
        variant: "subtle"
    });
    } else if (token) {
      // Set timeout to remove token when expiration time is reached
      const expirationTime = 60 * 60 * 1000; // 60 minutes in milliseconds
      const timeoutId = setTimeout(() => {
        setToken(null);
        localStorage.removeItem('tokenExpirationTime');
        toast({
          title: "Session expiré",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          status: "warning",
          duration: 1000000000,
          isClosable: true,
          position: "top",
          variant: "subtle"
      });
      }, expirationTime);
      localStorage.setItem('tokenExpirationTime', new Date().getTime() + expirationTime);
      return () => clearTimeout(timeoutId);
    }
  }, [token, setToken]);

  const toast = useToast()

  const refreshToken = () => {
    toast.closeAll()
    axiosClient.post('/token/responsable/refresh/', { refresh: localStorage.getItem('REFRESH_TOKEN') })
      .then(({ data }) => {
        setToken(data.access)
        setRefresh(data.refresh)
        navigate("/")
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    const tokenExpirationTime = localStorage.getItem('tokenExpirationTime');
    if (tokenExpirationTime && new Date().getTime() > tokenExpirationTime) {
      // Token has expired, remove it from state and localStorage
      setToken(null)
      localStorage.removeItem('tokenExpirationTime');
      toast({
        duration: 10000000,
        isClosable: true,
        position: "top",
        variant: "subtle",
        render: () => (
          <Alert
            status='warning'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
          >
            <AlertIcon boxSize='20px' />
            <AlertTitle mt={4} mb={1} fontSize='md'>
              Session expiré !
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
              Votre session a expiré. Veuillez vous reconnecter.
              <Button size={"sm"} mt={"4"} onClick={refreshToken}>Prolonger la session</Button>
            </AlertDescription>
          </Alert>
        )
      });
    } else if (token) {
      // Set timeout to remove token when expiration time is reached
      const expirationTime = 60*60*4000; // 4Hours in milliseconds
      const timeoutId = setTimeout(() => {
        setToken(null);
        localStorage.removeItem('tokenExpirationTime');
        toast({
          duration: 10000000,
          isClosable: true,
          position: "top",
          variant: "subtle",
          render: () => (
            <Alert
              status='warning'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='200px'
            >
              <AlertIcon boxSize='20px' />
              <AlertTitle mt={4} mb={1} fontSize='md'>
                Session expiré !
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                Votre session a expiré. Veuillez vous reconnecter.
                <Button size={"sm"} mt={"4"} onClick={refreshToken}>Prolonger la session</Button>
              </AlertDescription>
            </Alert>
          )
        });
      }, expirationTime);
      localStorage.setItem('tokenExpirationTime', new Date().getTime() + expirationTime);
      return () => clearTimeout(timeoutId);
    }
  }, [token, setToken, refreshToken, toast]);




  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     setToken(null)
  //     setRefresh(null)
  //     localStorage.removeItem('tokenExpirationTime');
  //   };
  
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  useEffect(()=> {
    axiosClient.get('auth/user/')
    .then((response) => {
      if(!allowedRoles.includes(response.data.role)) {
        return navigate('/unauthorized')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  },[allowedRoles])

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Fragment>
      {element}
    </Fragment>
  )
};

export default RequireAuth;