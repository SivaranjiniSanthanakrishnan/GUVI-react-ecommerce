import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Grid, Card, CardContent, CardActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import jwt from 'jsonwebtoken';

function ProductComponent() {

    const [productList, setProductList] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token")

    useEffect(async () => {
        var decodedToken = jwt.decode(token);
        if(decodedToken.exp * 1000 < Date.now() ){
            navigate('/');
        } else {
            var response = await axios.get('http://localhost:3002/product/get', {
                headers: {
                    "access-token": token
                }
            });
            setProductList(response.data);
        }
        
    }, [])

    const updateProduct = async (id, userQuantity) =>{
        var decodedToken = jwt.decode(token);
        if(decodedToken.exp * 1000 < Date.now() ){
            navigate('/');
        } else {
            var response = await axios.put(`http://localhost:3002/product/update/${id}`, {
                userQuantity: userQuantity
            }, {
                headers: {
                    "access-token": token
                }
            })
        
            var index = productList.findIndex(row => row.id === id);
            var productListCopy = [...productList];
            productListCopy[index] = response.data.value;
            setProductList(productListCopy);
        }
    }
    const logout = async () => {
        await localStorage.removeItem("token");
        navigate('/')
    }
    return (
        <Grid>
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
                        <Button color="inherit" onClick={logout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <br />
            <Grid container spacing={2} style={{ margin: '2%' }}>
                {productList.map(row => (
                    <Grid item key={row._id}>
                        <Card sx={{ width: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {row.productName}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {row.description}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Price: {row.price}
                                </Typography>
                                <Typography variant="body2">
                                    Quantity: {row.quantity}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={e => updateProduct(row._id, ++row.userQuantity)} disabled={row.userQuantity >= row.quantity}>+</Button>  
                                    {row.userQuantity}
                                <Button onClick={e => updateProduct(row._id, --row.userQuantity)} disabled={row.userQuantity <= 0}>-</Button> 
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
        </Grid>
    )
}

export default ProductComponent;

// axios.get: 1st param: URL, 2nd param: headers
// axios.post: 1st param: URL, 2nd param: req.body, 3rd: headers
// axios.put: 1st param: URL, 2nd param: req.body, 3rd: headers
// axios.delete: 1st param: URL, 2nd param: headers