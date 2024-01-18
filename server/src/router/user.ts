import jwt from "jsonwebtoken";
import express from 'express';
import { authenticateJwtUser, USERSECRET, authenticatedUserRequest } from "../middleware";
import { Game, User } from "../db";
import { Request, Response } from "express";
const userRouter = express.Router();

// user signup
userRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, username, profilePicture } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            res.status(403).json({ message: "User already exists" });
        } else {
            const newUser = new User({ email, password, username, wishlist: [], profilePicture, myGames: [], cart: [] });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, USERSECRET, { expiresIn: '1h' });
            res.json({ message: "User Signed up successfully", token });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// user signin
userRouter.post('/signin', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ id: user._id }, USERSECRET, { expiresIn: '1h' });
            res.json({ message: "User Logged in successfully", token });
        } else {
            res.status(403).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get user profile
userRouter.get('/profile', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ messaage: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// update user profile
userRouter.put('/updateProfile', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (user) {
            res.json({ message: "User Profile Updated Successfully" });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// get games purchased by the user
userRouter.get('/myGames', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id).populate('myGames');
        if (user) {
            res.json({ publishedGames: user.myGames || [] })
        } else {
            res.status(404).json({ messaage: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// add a game to the wishlist
userRouter.post('/addToWishlist/:gameId', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const user = await User.findOneAndUpdate({ _id: req.user.id }, { $addToSet: { wishlist: { _id: gameId } } }, { upsert: true, new: true })
        if (user) {
            res.json({ message: "Game added to the Wishlist" });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

// Remove a game from the wishlist
userRouter.post('/removeFromWishlist/:gameId', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $pull: { wishlist: gameId } },
            { upsert: true, new: true }
        );

        if (user) {
            res.json({ message: "Game removed from the cart", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// add a game to the cart
userRouter.post('/addToCart/:gameId', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const gameExists = user.cart?.items.includes(game._id);

        if (gameExists) {
            return res.status(400).json({ message: 'Game is already in the cart' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                $addToSet: { 'cart.items': gameId },
                $inc: { 'cart.totalAmount': game.price }
            },
            { new: true }
        );

        if (updatedUser) {
            res.json({ message: "Game added to the cart" })
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

// Remove a game from the cart
userRouter.post('/removeFromCart/:gameId', authenticateJwtUser, async (req: authenticatedUserRequest, res: Response) => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const gameExists = user.cart?.items.includes(game._id);

        if (!gameExists) {
            return res.status(400).json({ message: 'Game does not exist in the cart' });
        }

        const priceToSubtract = game.price ?? 0;

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                $pull: { 'cart.items': gameId },
                $inc: { 'cart.totalAmount': -priceToSubtract }
            },
            { new: true }
        );

        if (updatedUser) {
            res.json({ message: "Game removed from the cart" })
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { userRouter };
