import { User } from "../models/User.js";
import { jwtAuthMiddleware,generateToken } from "../middleware/auth.js";


// Register 


export const register = async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'User already exists' });

        const user = new User({ name, email, password, role, company })
        const response = await user.save()
        console.log("response", response);

        const token = generateToken({ id: user._id, email: user.email, role: user.role });
       



        if (response) {
            res.status(200).json({message:"Data is", response,token:token});
        }
        return res.status(500).json({ msg: 'Error creating user' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const token = generateToken({ email: user.email, password: user.password });
        return res.status(200).json({ msg: 'Login successful', token });


    } catch (error) {
        console.error(error);
        res.status(500).json({error:"An error occurred while logging in"})

    }
}