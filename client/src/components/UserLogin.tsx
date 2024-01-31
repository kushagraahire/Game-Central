import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import logo from "../assets/gamecentrallogo.png"
import gamecover from "../assets/gamescover.png"
import axios from "axios";

const UserLogin = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3000/user/signin", { email, password })
            if (res) {
                localStorage.setItem("token", res.data.token);
                //navigate
            } else {
                console.log("Internal Server Error")
            }
        } catch (error) {
            console.error(error + "Internal Server Error");
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '571px' }}>
            <Card className="card-global-style" style={{ height: '500px', width: '800px', borderRadius: '20px', display: 'flex', justifyContent: 'center' }}>
                <div>
                    <img src={gamecover} style={{ height: '500px', width: '400px', objectFit: 'cover' }} />
                </div>
                <Card className="card-global-style" style={{
                    width: '400px', padding: '85px 50px 50px 50px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ height: '50px', width: '50px', marginRight: '20px' }}>
                            <img src={logo} style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
                        </div>
                        <Typography variant="h5">LOGIN</Typography>
                    </div>
                    <TextField id="email" label="Email" variant="outlined" size="small" style={{ width: '100%', marginTop: '30px' }}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}></TextField>
                    <TextField id="password" label="Password" variant="outlined" size="small" type="password" style={{ width: '100%', marginTop: '20px' }}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}></TextField>
                    <Button variant="contained" style={{ width: '100%', marginTop: '20px' }}
                        onClick={handleLogin}><b>Login</b></Button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '5px' }}>
                        <Typography variant="body2">Publisher Login</Typography>
                        <Typography variant="body2">User Signup</Typography>
                    </div>
                </Card >
            </Card>
        </div >
    )
}

export default UserLogin