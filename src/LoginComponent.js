import React from 'react';
import axios from 'axios';

class LoginComponent extends React.Component{
    constructor(props){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }
    render(){
        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                var response = await axios.post(
                'https://guvi-node-ecommerce.herokuapp.com/register/login', {
                    password: this.state.password,
                    email: this.state.email
                })
                if(response.data) {
                    await localStorage.setItem('token', response.data);
                    this.props.history.push('/products');
                }
            } catch (err) {
                console.warn(err)
            }
        }
        return(
            <>
                <div style={{padding:'20px'}}>
                    <h3>Login Component</h3>
                    <form onSubmit={(e)=>handleSubmit(e)}>
                        <div>
                            <label>Email</label> &nbsp;
                            <input type="email" name="email" value={this.state.email} 
                            onChange={(e)=> this.setState({email: e.target.value})}></input>
                        </div> <br/>
                        <div>
                            <label>Password</label>  &nbsp;
                            <input type="password" name="password" value={this.state.password} 
                            onChange={(e)=> this.setState({password: e.target.value})}></input>
                        </div> <br/>
                        <button type="submit">Submit</button> <br/>
                    </form>
                </div>
            </>
        )
    }
}

export default LoginComponent;