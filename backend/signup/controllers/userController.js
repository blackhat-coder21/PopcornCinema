export const registerUser = (req, res) => {
    const { username, email, password } = req.body;
  
    // You can add DB saving logic here later
    console.log('Received:', { username, email, password });
  
    res.status(201).json({ message: 'User registered successfully' });
  };
  