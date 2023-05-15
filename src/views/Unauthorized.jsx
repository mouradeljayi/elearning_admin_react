import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
    const navigate = useNavigate();
    const bg = useColorModeValue("gray.200", "gray.800");
    const textColor = useColorModeValue("black.600", "gray.300");

    return (
        <Box bg={bg} h="100vh">
            <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                h="100%"
                textAlign="center"
            >
                <Text fontSize="5xl" fontWeight="bold" color={textColor} mb="4">
                    Oops! 401 UNAUTHORIZED
                </Text>
                <Text fontSize="xl" color={textColor} mb="8">
                    Vous n'etes pas autorisé à accéder à cette page.
                </Text>

                <Button
                    colorScheme='yellow'
                    onClick={() => navigate(-2)}>
                    Retourner
                </Button>

            </Flex>
        </Box>
    )
}