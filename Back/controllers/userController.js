import User from "../models/User.js"

export const addUser = async(req,res) => {
    // need to add validations
    const message = await userValidation(req.body.username, req.body.password, req.body.email);
    if(message != '') // if there is an error message
    {
        res.status(401).json({success: false, message: message});
        return;
    }
    try {
        const user = await User.create(req.body);
        return res.status(201).json({success: true});
    } catch (error) {
        // Handle any errors during user creation
        console.error('Error creating user:', error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

async function userValidation(username, password, email) {
    if(!username || !password || !email)
        return 'One of the following inputs is empty';

    if(username.length > 20)
        return 'Username must be under 20 charecter'
    else
    {
        const user = await User.findOne({ username: username });
        if(user)
            return 'Username is already taken'
    }
    if(password.length < 8)
        return 'Password must be longer than 8 characters'

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!regex.test(email))
        return 'Email is incorrect, must contains @ exmaple: XXX@XXX.XX'
    else
    {
        const user = await User.findOne({ email: email });
        if(user)
            return 'Email is already taken'
    }
    return '';
}

export const login = async(req,res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({success: false, message: 'Username/Email and password are required' });
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
            return res.status(404).json({success: false, message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            // Password is correct, send success response
            res.status(200).json({
                success: true,
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
            res.status(401).json({success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({success: false, message: 'An error occurred during login' });
    }
}