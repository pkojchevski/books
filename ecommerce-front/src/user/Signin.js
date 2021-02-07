import React, {useState} from 'react';
import Layout from '../core/Layout'
import { signin , authenticate, isAuthenticated} from '../auth/index'
import { Redirect } from 'react-router-dom'

const Signin = () => {
    const[values, setValues] = useState({
        email:'',
        password:'',
        error:'',
        loading: false,
        redirectToReferrer: false
    })

    const { email,password, loading, error, redirectToReferrer} = values;
    const {user} = isAuthenticated();

    const handleChange = (name) => event => {
       setValues({...values, error:false, [name]:event.target.value})
    }
    
    const showLoading = () => {
       return loading && 
        (<div className="alert alert-info">Loading ...</div>)
    }

    const showError = () => {
      return (<div className="alert alert-danger"
          style={{display: error ? '' : 'none'}}>
              {error}
          </div>)
    }

    const onSubmit = (ev) => {
       ev.preventDefault();
       console.log('submit')
       setValues({...values, error:false, loading:true})
       signin({email, password})
       .then(data => {
           console.log('data:', data)
           if(data.error) {
              setValues({...values, error:data.error})
           } else {
               authenticate(data, () => {
                   setValues({
                       ...values,
                       redirectToReferrer:true,
                   loading:false
                   })
               })
           }
       })
    }

    const redirectUser = () => {
        if(redirectToReferrer) {
            if(user && user.role === 1) {
                return <Redirect to="/admin/dashboard"/>
            } else {
                return <Redirect to="/user/dashboard"/>
            }
        } 

        if(isAuthenticated()) {
            return <Redirect to="/"/>
        }
    }

    const signinForm = () => (
        <form>
            <div className="form-group">
                <label className='text-muted'>Email</label>
                <input type="email" className="form-control" 
                onChange={handleChange('email')}
                value={email}/>
            </div>
            <div className="form-group">
                <label className='text-muted'>Password</label>
                <input type="password" className="form-control" 
                onChange={handleChange('password')}
                value={password}/>
            </div>
            <button onClick={onSubmit} className="btn btn-primary">Submit</button>
        </form>
    )
    return (
        <Layout title="Signin" description="App">
            <div className="row">
                <div className="col-md-8 offset-2">
                {showLoading()}
            {showError()}
        {signinForm()}
        {redirectUser()}
                </div>
            </div>

    </Layout>
    );
}

export default Signin;