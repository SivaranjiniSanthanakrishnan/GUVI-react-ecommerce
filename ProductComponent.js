import React, {useEffect, useState} from 'react';
import {AppBar, Box, Toolbar, Button, IconButton, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { getThemeProps } from '@mui/system';

function ProductComponent(props){
    const [productList, setProductList] = useState([]);
    const [cart, setCart] = useState(0);
    useEffect(async () => {
        const localToken = localStorage.getItem('token');
        var decodedToken = jwt.decode(localToken);
        if(decodedToken.exp*1000 <= Date.now()){
            props.history.push('/')
        } else {
            var response = await axios.get('https://guvi-node-ecommerce.herokuapp.com/product/getproduct', 
            {
                headers: {
                    token: localToken
                }
            })
            setProductList(response.data);
            updateCart(response.data)
        }
    }, [])
    const updateProduct = async (id, userQuantity) => {
        const localToken = localStorage.getItem('token');
        var decodedToken = jwt.decode(localToken);
        if(decodedToken.exp*1000 <= Date.now()){
            props.history.push('/')
        } else {
            var response = await axios.patch(`https://guvi-node-ecommerce.herokuapp.com/product/updateProduct/${id}`, 
            {
                userQuantity: userQuantity
            },
            {
                headers: {
                    token: localToken
                }
            })
            var productListCopy = [...productList];
            var index = productListCopy.findIndex(row => row._id === response.data._id);
            productListCopy[index] = response.data;
            setProductList(productListCopy);
            updateCart(productList)
        }
    }
    const updateCart = (products) => {
        var cart = products.reduce((accumulator, currentValue) => {
            return (currentValue.userQuantity) ? accumulator +1 : accumulator
        }, 0)
        setCart(cart);
    }
    const logout = () => {
        localStorage.removeItem('token');
        props.history.push('/')
    }
    return(
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Guvi - Products
            </Typography>
            
            <ShoppingCartIcon />
            <h3>{cart} </h3>
            <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
        </AppBar>
            <div style={{padding: '25px'}}>
            <Grid container spacing={2}>
                {productList.map(row=> (
                    <Grid item key={row._id}>
                        <Card sx={{ width: 200 }}>
                            <CardContent>
                                <Typography gutterBottom>
                                {row.productName}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Rs.{row.price}.00
                                </Typography>
                                <Typography >
                                Available Quantity: {row.quantity}
                                </Typography>
                                <Typography variant="body2">
                                {row.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => updateProduct(row._id, ++row.userQuantity)} disabled={row.userQuantity >= row.quantity}> + </Button> 
                                {row.userQuantity} 
                                <Button onClick={() => updateProduct(row._id, --row.userQuantity)} disabled={row.userQuantity<=0}>-</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </div>
        </Box>
    )
}

export default ProductComponent;