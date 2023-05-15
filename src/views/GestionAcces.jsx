import React, { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import axios from 'axios'

function GestionAcces() {

    const [listAcces, setListAcces] = useState([
        {
            apprenant: null,
            etat: "",
            encours: "",
            id: null,
            module: null
        }
    ])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/acces/').then((res) => setListAcces(res.data))
    }, [])


    const Accept = (id, idM, idA) => {
        axios.patch(`http://127.0.0.1:8000/acces/${id}/`, {
            etat: true,
            encours: false
        })
            .then((res) => {
                console.log(res.data)
                console.log('Student successfully updated')
            })
            .catch((error) => {
                console.log(error)
            })

        axios.post('http://127.0.0.1:8000/progres/', {
            progres: 0,
            module: idM,
            apprenant: idA
        })

    }

    const deleteAcces = (id) => {
        axios.delete(`http://127.0.0.1:8000/acces/${id}/`)
            .then((res) => {
                console.log(res.data)
                console.log('Student successfully updated')
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <>
            <Table>
                <Thead>
                    <Tr>
                        <Th>#id</Th>
                        <Th>Etat</Th>
                        <Th>En cours</Th>
                        <Th>Module</Th>
                        <Th>Apprenant</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {listAcces.map((val, key) => {
                        if (val.etat === false && val.encours === true) {
                            return (
                                <Tr key={key}>
                                    <Td>{val.id}</Td>
                                    <Td>{val.etat.toString()}</Td>
                                    <Td>{val.encours.toString()}</Td>
                                    <Td>{val.module}</Td>
                                    <Td>{val.apprenant}</Td>
                                    <Td>
                                        <Button colorScheme="green" onClick={() => Accept(val.id, val.module, val.apprenant)}>Accepter</Button>
                                        <Button colorScheme="red" onClick={()=>deleteAcces(val.id)}>Refuser</Button>
                                    </Td>
                                </Tr>
                            )
                        }
                    })}
                </Tbody>
            </Table>
        </>
    )
}

export default GestionAcces