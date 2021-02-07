import React, {useState} from 'react';
import { createCategory } from './apiAdmin';
import { isAuthenticated } from '../auth/index'
import { Link } from 'react-router-dom'
import Layout from '../core/Layout'

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(true);

    // destructure user and token from localstorage
    const {user, token} = isAuthenticated();
    
    const handleChange = (e) => {
        setError('')
        setName(e.target.value)
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        setError('')
        setSuccess(false)
        createCategory(user._id, token,{name})
        .then(data => {
            if(data.error) {
                setError(data.error)
            } else {
                setError('')
                setSuccess(false)
            }
        })
    }

    const showSuccess = () => {
        if(success) {
            return (
                <h3 className="text-success">{name} is created</h3>
            )
        }
    }

    const showError = () => {
        if(error) {
            return (
                <h3 className="text-danger">
                    Category should be unique</h3>
            )
        }
    }



    const goBack = () => {
        return (
          <div className="mt-5">
              <Link to="/admin/dashboard" className="text-warning">
                  Back to Dashboard
              </Link>
          </div>
            )
    }



    const newCategoryForm = () => {
       return (<form>
           <div className="form-group">
               <label className="text-muted">Name</label>
               <input type="text" 
                      className="form-control"
                      onChange={handleChange}
                      value={name}
                      autofocus
                      required/>
           </div>
           <button className="btn btn-outline-primary" onClick={clickSubmit}>
                  Create Category
              </button>
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
                        {newCategoryForm()}
                        </div>
                    </div>
                </Layout>

    );
}

export default AddCategory;