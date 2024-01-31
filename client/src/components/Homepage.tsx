import { useEffect } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { gameAtom } from "../store/atoms/gameAtom";
import FeaturedCover from "./FeaturedCover";

const Homepage = () => {
    const setGames = useSetRecoilState(gameAtom);
    useEffect(() => {
        try {
            const fetchGames = async () => {
                const res = await axios.get("http://localhost:3000/game/");
                setGames(res.data.games)
            }
            fetchGames();
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <div style={{ width: "90%", margin: 'auto' }}>
            <div><FeaturedCover /></div>
        </div>
    )
}

export default Homepage;