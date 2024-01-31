import { useRecoilValue } from "recoil"
import { gameAtom } from "../store/atoms/gameAtom"
import { Button, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


const FeaturedCover = () => {
    const games = useRecoilValue(gameAtom);
    const [currGameIndex, setCurrGameIndex] = useState<number>(0);
    var featuredGames: any[] = [];
    if (games) {
        featuredGames = games.slice(-5);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrGameIndex((prevIndex) => (prevIndex + 1) % featuredGames.length);
        }, 5000)

        return () => {
            clearInterval(intervalId);
        };
    })


    if (!featuredGames || featuredGames.length === 0) {
        return (<div>Loading</div>)
    }
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop : '16px' }}>
            <Card className="card-global-style" style={{ width: "75%", height: "480px", backgroundImage: `url(${featuredGames[currGameIndex].coverPhoto})`, backgroundSize: "cover"}}>
                <div style={{ display: "flex",justifyContent : "space-between", alignItems: "center", marginTop : '415px', padding : '10px 30px 20px 30px'}}>
                    <div>
                        <Typography variant="h4" style={{ color: "white", textShadow: "-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black" }}>{featuredGames[currGameIndex].title}</Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>

                        <Typography variant="h5" style={{color: "white", textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black" }}>₹{featuredGames[currGameIndex].price}</Typography>
                        <Button variant="contained" style={{ marginLeft: "20px" }} startIcon = {<AddShoppingCartIcon/>}><b>Add to cart</b></Button>
                    </div>
                </div>
            </Card>
            <div style={{width : "25%", height: "450px"}}>
                {featuredGames.map((game, index)=>(
                    <Card  key={index} className="card-global-style" style={{ display : "flex", alignItems : "center", padding : '6px 6px 6px 18px', margin : '0px 10px 10px 10px', background : currGameIndex === index ? '#1976d2' : 'inherit'}}>
                        <img src = {game.coverPhoto} style={{height : '73px', width : '55px', objectFit: 'cover', marginRight : '12px'}}/>
                        <Typography variant="caption" style={{fontWeight : 'bold', marginRight : '3px'}}>{game.title}</Typography>
                    </Card>
                )
                )}
            </div>
        </div>
    );
}

export default FeaturedCover