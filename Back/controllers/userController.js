import User from "../models/User.js"

export const addUser = async(req,res) => {
    // need to add validations
    const user = User.create(req.body);
    res.status(201).json({user});
}

export const login = async(req,res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    try {
        // Find the user by username or email
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        });

        // If no user is found, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            // Password is correct, send success response
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    kittyCoins: user.kittyCoins
                }
            });
        } else {
            // Password is incorrect
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
    // const isExist = [];
    // if (req.body.username && req.body.password)
    //     isExist = await db.collection("Users").find({ $and: [ { username: req.body.username, password: req.body.password } ] }).toArray();
    // if (isExist.length === 1)
    //     res.status(200).json({"username": req.body.username});
    // else
    //     res.status(401).json();
}