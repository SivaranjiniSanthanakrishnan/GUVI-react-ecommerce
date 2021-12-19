import React from 'react';
import LoginComponent from './LoginComponent';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import ProductComponent from './ProductComponent';
function HomeComponent(props){
    return(
        <>
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={LoginComponent}></Route>
                        <Route exact path="/products" component={ProductComponent}></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        </>
    )
}

export default HomeComponent;