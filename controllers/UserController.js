const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find();

    if (!data) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // const currentUser = async () => {
    //     return await User.findOne({ equals: email })
    // }
    //
    // if (email === currentUser.email) {
    //     return res.status(400).json({ message: "user already exists" })
    // }

    const user = await User.insertOne({
      name: name,
      email: email,
      password: password,
      role: "admin",
    });

    res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

