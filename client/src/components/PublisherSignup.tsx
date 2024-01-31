import { useState } from "react";
import { Button, Card, TextField, Typography } from "@mui/material";
import logo from "../assets/gamecentrallogo.png"
import gamecover from "../assets/gamescover.png"
import axios from "axios";


const PublisherSignup = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const handleSignup = async () => {
        try {
            const res = await axios.post("http://localhost:3000/publisher/signup", { publisherEmail : email, publisherPassword : password, publisherUsername : username })
            if (res) {
                localStorage.setItem("token", res.data.token);
                //navigate
                console.log("Success : "+res.data.token)
            } else {
                console.log("Internal Server Error")
            }
        } catch (error) {
            console.error(error + "Internal Server Error");
        }
    }

    return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '641px' }}>
        <Card className="card-global-style" style={{ height: '500px', width: '800px', borderRadius: '20px', display: 'flex', justifyContent: 'center' }}>
            <div>
                <img src={gamecover} style={{ height: '500px', width: '400px', objectFit: 'cover' }} />
            </div>
            <Card className="card-global-style" style={{
                width: '400px', padding: '75px 50px 50px 50px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ height: '50px', width: '50px', marginRight: '20px' }}>
                        <img src={logo} style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
                    </div>
                    <Typography variant="h6">PUBLISHER SIGNUP</Typography>
                </div>
                <TextField id="username" label="Username" variant="outlined" size="small" style={{ width: '100%', marginTop: '40px' }}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}></TextField>
                <TextField id="email" label="Email" variant="outlined" size="small" style={{ width: '100%', marginTop: '20px' }}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}></TextField>
                <TextField id="password" label="Password" variant="outlined" size="small" type="password" style={{ width: '100%', marginTop: '20px' }}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}></TextField>
                <Button variant="contained" style={{ width: '100%', marginTop: '20px' }}
                    onClick={handleSignup}><b>Signup</b></Button>
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px', padding: '5px' }}>
                    <Typography variant="body2">Publisher Login</Typography>
                </div>
            </Card >
        </Card>
    </div >
    )
}

export default PublisherSignup;