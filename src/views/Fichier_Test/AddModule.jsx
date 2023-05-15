import React from 'react'

function AddModule() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <form onSubmit={""}>
            <input type="text" name="titre" id="" placeholder='titre'/><br />
            <input type="file" name="image" id="" /><br />
            <input type="text" name="description" id="" placeholder='description'/><br />
            <input type="checkbox" name="etat" id="" />etat<br />
            
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default AddModule