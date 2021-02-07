import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth';
import { createProduct, getCategories,  } from './apiAdmin'
import Layout from '../core/Layout'

const AddProduct = () => {
 const { user, token} = isAuthenticated();
 const [values, setValues] = useState({
     name:'',
     description:'',
     price:'',
     categories:[],
     category:'',
     shipping:'',
     quality:'',
     photo:'',
     loading:false,
     error:'',
     createdProduct:'',
     redirectToProfile:false,
     formData:'',
 });

 const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    photo,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData
 } = values;

 const init = () => {
     return getCategories().then(data => {
         if(data.error) {
             setValues({...values, error:data.error})
         } else {
             setValues({...values, 
                categories:data,
                formData: new FormData()})
         }
     })
 }

 useEffect(() => {
     setValues({...values, formData:new FormData()})
     init();
 }, [])


    const handleChange = name => event => {
      const value = name === 'photo' ? event.target.files[0] : event.target.value
      formData.set(name, value)
      setValues({...values, [name]:value})
    }

    const onClickSubmit = event => {
          event.preventDefault();
          setValues({...values, error:'', loading:'true'})
          return createProduct(user._id, token, formData)
          .then(data => {
              if(data.error) {
                  setValues({...values, error:data.error, loading:false})
              } else {
                setValues({...values, name:'', 
                           description:'',
                           error:'', 
                           photo:'',
                           price:'',
                           quantity:'',
                           createdProduct:data.name,
                           loading:false})
              }
          })
    }

    const showError = () => {
        return (<div 
            className="alert alert-danger" 
            style={{display:error ? '' : 'none'}}>
                {error}
            </div>
        )
    }

    const showSuccess = () => (
        <div 
            className="alert alert-info" 
            style={{display:createdProduct ? '' : 'none'}}>
                <h2>{`${createdProduct}`} is created!</h2>
            </div>
    )

    const showLoading = () => (
       loading && (<div className="alert alert success">
           <h2>Loading....</h2>
       </div>)
    )

 const newPostForm = () => {
     return (<form className="mb-3" onSubmit={onClickSubmit}>
         <h4>Post Photo</h4>
         <div className="form-group">
             <label className="btn btn-secondary">
             <input type="file" name="photo" accept="image/*"/>
             </label>
         </div>

         <div className="form-group">
             <label className="text-muted">Name</label>
             <input type="text" onChange={handleChange("name")}
                     className="form-control"
                     value={name} 
            />
         </div>
         <div className="form-group">
             <label className="text-muted">Description</label>
             <input type="text" onChange={handleChange("description")}
                     className="form-control"
                     value={description} 
            />
         </div>
         <div className="form-group">
             <label className="text-muted">Price</label>
             <input type="number" onChange={handleChange("price")}
                     className="form-control"
                     value={price} 
            />
         </div>
         <div className="form-group">
             <label className="text-muted">Category</label>
             <select onChange={handleChange("category")}
                     className="form-control"
            >
               <option>Please select</option>
               {categories && categories.map((c, i) => {
                 return (
                     <option key={i} value={c._id}>{c.name}</option>
                 )
               })}
            </select>
         </div>

         <div className="form-group">
             <label className="text-muted">Shipping</label>
             <select type="number" onChange={handleChange("shipping")}
                     className="form-control"
                     value={shipping} 
            >
                 <option>Please select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
         </div>

         <div className="form-group">
             <label className="text-muted">Quantity</label>
             <input type="number" onChange={handleChange("quantity")}
                     className="form-control"
                     value={quantity} 
            />
         </div>
        <button className="btn btn-outline-primary">Create product</button>
     </form>
     )
 }
      return (
        <Layout title="Add new category" 
                description="Hi"
                >
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            {showSuccess()}
                            {showError()}
                            {showLoading()}
                            {newPostForm()}
                        </div>
                    </div>
                </Layout>
    );
}

export default AddProduct;