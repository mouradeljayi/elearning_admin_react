import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function Pagination({ nPages, currentPage, setCurrentPage }) {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)


    const nextPage = () => {
        if (currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if (currentPage !== 1) setCurrentPage(currentPage - 1)
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <ButtonGroup variant="outline" spacing={4}>
                <Button
                    size="sm"
                    isDisabled={nPages > currentPage+1}
                    colorScheme="yellow"
                    onClick={prevPage}
                    leftIcon={<MdChevronLeft />}
                >
                    Précédent
                </Button>

                {pageNumbers.map(pgNumber => (
                    <Button
                        size="sm"
                        key={pgNumber}
                        isActive={currentPage === pgNumber}
                        onClick={() => setCurrentPage(pgNumber)}
                    >
                        {pgNumber}
                    </Button>
                ))}

                <Button
                    size="sm"
                    isDisabled={nPages < currentPage+1}
                    colorScheme="yellow"
                    onClick={nextPage}
                    rightIcon={<MdChevronRight />}
                >
                    Suivant
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export default Pagination;
