import { User } from "../models/User.js";


// Register 


export const register = async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'User already exists' });

        const user = new User({ name, email, password, role, company })
        const response = await user.save()
        console.log("response", response);

        if (response) {
            return res.status(201).json({ msg: 'User created successfully' });
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
        
        return res.status(200).json({ msg: 'Login successful', user });


    } catch (error) {
        console.error(error);
        res.status(500).json({error:"An error occurred while logging in"})

    }
}