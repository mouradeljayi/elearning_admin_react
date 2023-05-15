import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const DisplayingErrorMessagesSchema = Yup.object().shape({
  
    titre: Yup.string()
        .min(3, 'Le titre doit dépasser 3 caractères')
        .required('Ce champs est obligatoire'),
    image: Yup.string()
        .required('Ce champs est obligatoire'),
    description: Yup.string().required('Ce champs est obligatoire'),
});
function Validation() {
  return (
    <div>
     <h1>Displaying Error Messages</h1>
     <Formik
       initialValues={{
         titre:'',
         image:'',
         description:''
       }}
       validationSchema={DisplayingErrorMessagesSchema}
       onSubmit={values => {
         // same shape as initial values
         console.log(values);
       }}
     >
       {({ errors, touched }) => (
         <Form>
           <Field name="titre"  placeholder='gft'/>
           {/* If this field has been touched, and it contains an error, display it
            */}
           {touched.titre && errors.titre && <div>{errors.titre}</div>}


           <Field type='file' name="image" placeholder='gft' />
           {/* If this field has been touched, and it contains an error, display
           it */}
           {touched.image && errors.image && <div>{errors.image}</div>}


           <Field type='text' name="description" placeholder='gft' />
           {/* If this field has been touched, and it contains an error, display
           it */}
           {touched.description && errors.description && <div>{errors.description}</div>}
           <button type="submit">Submit</button>
         </Form>
       )}
     </Formik>
   </div>
  )
}

export default Validation