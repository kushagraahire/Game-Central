import React, { useEffect, useState } from "react";
import icon from '../assets/gamecentrallogo.png'
import { Switch, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/userAtom";
import axios from "axios";

interface AppBarProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ isDarkMode, toggleDarkMode }) => {
    const [selected, setSelected] = useState("HOME");
    const setUser = useSetRecoilState(userAtom)


    const items = ['HOME', 'BROWSE', 'SEARCH', 'NEW'];

    useEffect(() => {
        try {
            const fetchUser = async () => {
                const user = await axios.get("http://localhost:3000/user/profile", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    }
                });
                setUser(user.data.user);
            }
            fetchUser();
        } catch (error) {
            console.log("Internal server error : " + error)
        }
    }, [setUser])

    const user = useRecoilValue(userAtom);
    var profilePicture = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    if (user != null) {
        profilePicture = user.profilePicture;
    }

    const handleItemClick = (index: number) => {
        setSelected(items[index]);
    }

    const appBarBackground = isDarkMode ? 'rgba(18,18,18,0.9)' : 'rgba(255,255,255,0.9)'

    return (<div style={{ background: appBarBackground, borderBottom: '1px solid rgba(128, 128, 128, 0.3)', maxHeight: '60px', display: "flex", justifyContent: "space-between", alignItems: "center", padding: '34px 5% 33px 5%', position: "sticky", top: '0px', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ height: '43px', width: '43px', marginRight: '50px' }}>
                    <img src={icon} alt="not found" style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: "3px" }}>
                    {items.map((item, index) => (
                        <Typography
                            key={index}
                            variant="button"
                            style={{
                                padding: '3px 15px 3px 15px',
                                marginRight: '10px',
                                color: selected === items[index] ? '#1976d2' : 'inherit',
                                cursor: selected !== items[index] ? 'pointer' : 'default',
                                fontWeight: selected === items[index] ? 'bold' : 'normal',
                            }}
                            onClick={() => handleItemClick(index)}>{item}</Typography>
                    ))}
                </div>
            </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            {user ? (<div style={{ borderRadius: '50%', overflow: 'hidden', width: '40px', height: '40px' }}>
                <img
                    src={profilePicture}
                    alt="User Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>) : (<div style={{ borderRadius: '50%', overflow: 'hidden', width: '40px', height: '40px' }}>
                <img
                    src={profilePicture}
                    alt="User Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>)}
            <Switch style={{ color: '#1976d2' }} checked={isDarkMode} onChange={toggleDarkMode} />
        </div>
    </div>)
}

export default AppBar;