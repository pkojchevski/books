import React, {useState} from 'react';
import Layout from '../core/Layout';
import { Link } from 'react-router-dom';
import { signup } from '../auth'

const Signup = () => {

    const [values, setValues] = useState({
        name:'',
        email:'', 
        password:'', 
        error:'', 
        success:false,
    })

    const handleChange = name => event => {
       setValues({...values,error:false, [name]:event.target.value})
    }

    const {name, email, password, error, success} = values;

    const clickSubmit = (event) => {
       event.preventDefault();
       console.log('submit:', name, email,password)
       setValues({...values, error: false})
       signup({name, email,password})
       .then(data => {
           console.log('data:', data)
           if(data.error) {
               setValues({...values, error:data.error, success:false })
           } else {
               setValues(
                   {...values, 
                     name:'',
                     email:'', 
                     password:'', error:'', success:true})
           }
       })
    }


const signUpForm = () => (
        <form>
            <div className="form-group">
                <label htmlFor="" className="text-muted">
                    Name
                </label>
                <input onChange={handleChange('name')} 
                       type="text" 
                       className="form-control"
                       value={name}/>
            </div>
            <div className="form-group">
                <label htmlFor="" className="text-muted">
                    Email
                </label>
                <input onChange={handleChange('email')} 
                type="text" 
                className="form-control"
                value={email}/>
            </div>
            <div className="form-group">
                <label htmlFor="" className="text-muted">
                    Password
                </label>
                <input onChange={handleChange('password')} 
                        type="password"
                        className="form-control"
                        value={password}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
)

const showError = () => {
    return (<div className="alert alert-danger"
        style={{display: error ? '' : 'none'}}>
            {error}
        </div>)
  }

const showSuccess = () => (
    <div className="alert alert-info" style={{display: success ? '' :'none'}}>
        New account is created. Please <Link to='/signin'><strong>SIGNUP</strong></Link>
    </div>
)


return (
    <Layout
          title="Signup"
          description="Signup to BookShelf"
            >
                <div className="row">
                <div className="col-md-8 offset-2">
                    {showSuccess()}
                {showError()}
         {signUpForm()} 
                    </div>
                </div>

    </Layout>
)
    
}

export default Signup;

