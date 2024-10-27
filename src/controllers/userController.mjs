import User from '../models/user.mjs';
import { Router } from "express";
import { hashPassword, passwordValidator } from '../utilities/hashHelper.mjs';
import loginChecker from '../utilities/loginChecker.mjs';

const userRouter = Router();

// Create User 
userRouter.post('/users', async (req, res) => {
    try {
      if (loginChecker(req)){
      req.body.password = hashPassword(req.body.password);
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
      }else {
        res.status(401).json({mssg:"please login"});
      } 
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
// Read Users
userRouter.get('/users', async (req, res) => {
  try {
    if (loginChecker(req)){ //this condition checks if the user is logged in
      const users = await User.find();
      return res.status(200).send(users);
    }else {
      res.status(401).json({mssg:"please login"});
    } 
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read User by ID
userRouter.get('/users/:id', async (req, res) => {
  try {
    if (loginChecker(req)){
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  }else {
    res.status(401).json({mssg:"please login"});
  } 
  } catch (error) {
    res.status(500).send(error);
  }
});

//work on this function
// Update User
userRouter.patch('/users/:id', async (req, res) => {
  if (loginChecker(req)){
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'displayName', 'password'];
  const isValidOperation = updates.every((update) => 
    {allowedUpdates.includes(update);
      console.log(update)
    });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
}else {
  res.status(401).json({mssg:"please login"});
} 
});

// Delete User
userRouter.delete('/users/:id', async (req, res) => {
  if (loginChecker(req)){
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
}else {
  res.status(401).json({mssg:"please login"});
} 
});

// Password reset route
userRouter.post('/users/reset-password', async (req, res) => {
  try {
    if (loginChecker(req)){
      const { currentPassword, newPassword } = req.body;
      
      // Get the user from the database
      const user = await User.findById(req.user.id);
      
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if the current password is correct
      const isMatch = passwordValidator(currentPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update the user's password
      user.password = hashPassword(newPassword);
      await user.save();

      res.json({ message: "Password updated successfully" });
    }else {
      res.status(401).json({mssg:"please login"});
    } 
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
});

export default userRouter;