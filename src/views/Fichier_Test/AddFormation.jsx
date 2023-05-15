import axios from 'axios'
import React, { useEffect, useState } from 'react'


function AddFormation() {

    const [titre, setTitre] = useState()
    const [description, setDescription] = useState()

    const [listFormation, setListFormation] = useState([])


    const [userData, setUserData] = useState({ titre: "", description: "", image: "" });


    const [data, setData] = useState({
        titre: '',
        image: '',
        description: ''
    })

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/formation/')
            .then((res) => setListFormation(res.data))
    }, [])

    const addFormation = () => {
        axios.post('http://127.0.0.1:8000/formation/', {
            titre: titre,
            image: 'http://127.0.0.1:8000/media/uploads/images/conciergerie.jpg',
            description: description
        })
    }

    // const handleImageChange = (e) => {
    //     let newData = { ...data }
    //     newData['image'] = e.target.files[0]
    //     setListFormation(newData)
    // }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });



    const handleImageChange = (event) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            image: event.target.files[0],
        }));
    };


    //get the inputs values
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    //edit form submit
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append("description", userData.description);
        formData.append("image", userData.image || "");
        formData.append("titre", userData.titre);
        // Send the updated user data to the API
        for (const [key, value] of formData.entries()) {
            console.log(key + ": " + value);
        }
        axios.post(`http://127.0.0.1:8000/formation/`, formData)
            .then(response => console.log(response.data))
            .catch(error => console.log(error));
    };


    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                {/* <fieldset style={{ width: '50%' }}>
                    <legend>Add Formation</legend>
                    <input type="text" name='titre' onChange={e => setTitre(e.target.value)} placeholder='Titre' /><br />
                    <input type="file" name='image' accept='image/*' onChange={e => setImage(e.target.files[0])} /><br />
                    {image}<br />
                    <input type="text" name='description' onChange={e => setDescription(e.target.value)} placeholder='Description' />
                </fieldset>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <button onClick={() => addFormation()}>Add</button> */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="titre"
                        placeholder='sijsijsioj'
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="description"
                        placeholder='sisjpsjpsss'
                        onChange={handleInputChange}
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button type="submit">Submit</button>
                </form>

            </div>


            {listFormation.map((val, key) => {
                return (
                    <p key={key}>{val.image}</p>
                )
            })}
        </>
    )
}

export default AddFormation