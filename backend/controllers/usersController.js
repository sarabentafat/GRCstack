const fs = require("fs/promises");
const asyncHandler = require("express-async-handler");
const {
  User,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User");

const bcrypt = require("bcryptjs");
const path = require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");


/**----------------------------------------------
 * @desc   Get all users' profiles
 * @route  GET /api/users/profile
 * @access Private (only admin)
 * ----------------------------------------------*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .populate("subfield field level")
      .exec();
    const user = users[0];
    // Add the number of followers to each user
    const usersWithFollowerCount = users.map((user) => ({
      ...user.toObject(),
      followerCount: user.followers.length,
      followingCount:user.following.length
    }));

    res.status(200).json(usersWithFollowerCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**----------------------------------------------
 * @desc   Get user profile
 * @route  /api/users/profile/:id
 * @method GET
 * @access Public
 * ----------------------------------------------*/
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")

  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(user);
  }
});

/**----------------------------------------------
 * @desc   UPDATE user profile
 * @route   /api/users/profile
 * @method  UPDATE
 * @access  private (only user himself)
 * ----------------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true } // Added missing comma
  ).select("-password");

  res.status(200).json(updatedUser);

});
/**----------------------------------------------
 * @desc   get users count
 * @route   /api/users/count
 * @method  GET
 * @access  private (only admin)
 * ----------------------------------------------*/
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments({});
  res.status(200).json(count);
});
/**----------------------------------------------
 * @desc   Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged user)
 * ----------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  let imagePath;

  try {
    // 1. Validate file presence
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // 2. Get the path of the uploaded image
    imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    // 3. Upload image to Cloudinary
    const result = await cloudinaryUploadImage(imagePath);
    // 4. Fetch the user from the database
    const user = await User.findById(req.user._id);
    // 5. Delete old profile photo if it exists
    if (user && user.profilePic && user.profilePic.publicId) {
      await cloudinaryRemoveImage(user.profilePic.publicId);
    }

    // 6. Update user's profile photo in the database
    user.profilePic = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await user.save();

    // 7. Send success response with updated profile pic info
    res.status(200).json({
      message: "Your profile picture was uploaded successfully",
      profilePic: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    // 8. Handle errors gracefully
  
    res.status(500).json({ message: "Error uploading profile picture" });
  } finally {
    // 9. Remove the uploaded image from the server
    if (imagePath) {
      try {
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error(`Error removing image at ${imagePath}:`, unlinkError);
      }
    }
  }
});
/**----------------------------------------------
 * @desc   DELEte User profile
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 * ----------------------------------------------*/
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  //1. get the user from the db 7
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: "user is not found ",
    });
  }

  //get all posts from db
  //get the public ids from the posts
  //delete all posts image from cloudinary  that belongd to this user
  //delete the profile picture from clouadinary
  if (user.profilePic.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePic.publicId);
  }
  // delete user posts and comments
  //delete the user himsself
  await User.findByIdAndDelete(req.params.id);
  //send a response to the server
  res.status(200).json({
    message: "user deleted succefully",
  });
});
/**----------------------------------------------
 * @desc   add points (gims) score to the profile
 * @route   /api/users/profile/add-points/:id
 * @method  PUT
 * @access  private (only admin or user himself)
 * ----------------------------------------------*/
module.exports.addPointsCtrl = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const userId=req.params.id

  // Validate that points is a number and greater than 0
  if (typeof points !== "number" || points <= 0) {
    return res
      .status(400)
      .json({ message: "Points must be a positive number" });
  }

  try {
  
    // Find the user by ID
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add points to the user's totalScore
    user.statistics.totalScore += points;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Points added successfully",
      totalScore: user.statistics.totalScore,
    });
  } catch (error) {
    console.error("Error adding points:", error);
    res.status(500).json({ message: "Error adding points", error });
  }
});

/**------------------------------------------------
 @desc   Update streak days for the user
 @route  PUT /api/users/profile/update-streak/:id
 @method PUT
 @access private (only admin or user himself)
 ------------------------------------------------*/

module.exports.updateStreakCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.id;
;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Initialize streakDays and lastActivityDate if not defined
    if (!user.statistics.streakDays) {
      user.statistics.streakDays = [];
    }
    if (!user.statistics.lastActivityDate) {
      user.statistics.lastActivityDate = new Date();
    }
     
    
    

    // Define current date and last activity date
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const lastActivityDate = user.statistics.lastActivityDate.toISOString().split("T")[0];
if (
  user.statistics.lastActivityDate &&
  user.statistics.streakDays[user.statistics.streakDays.length - 1] !== today
) {
  user.statistics.streakDays.push(today);
}
// calculate streak days 

function calculateStreakLength(streakDays) {
  if (streakDays.length === 0) return 0;

  let streakLength = 1; // Start with a minimum streak of 1

  for (let i = streakDays.length - 1; i > 0; i--) {
    const currentDay = new Date(streakDays[i]);
    const previousDay = new Date(streakDays[i - 1]);

    // Check if the days are consecutive
    if ((currentDay - previousDay) / (1000 * 3600 * 24) === 1) {
      streakLength++;
    } else {
      break; // Streak is broken, stop counting
    }
  }

  return streakLength;
}

const s=calculateStreakLength(user.statistics.streakDays);
user.statistics.streakLength = s;








    await user.save();
    // Define yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if the streak is already updated today
    if (lastActivityDate === today) {
      return res.status(200).json({
        message: "Streak already updated today",
        streakDays: user.statistics.streakDays,
        streakLength: user.statistics.streakLength,
        isAlreadyUpdated:true
      });
    }

    // Update the streak based on the last activity date
    if (lastActivityDate === yesterdayDate) {
      // Continue the streak
      user.statistics.streakLength += 1;
      user.statistics.streakDays.push(today);
    } else {
      // Reset the streak
      user.statistics.streakLength = 1;
      user.statistics.streakDays = [today];
    }

    // Update the last activity date to today
    user.statistics.lastActivityDate = new Date();

    // Save the updated user


    res.status(200).json({
      message: "Streak updated successfully",
      streakDays: user.statistics.streakDays,
      streakLength: user.statistics.streakLength,
      isAlreadyUpdated: false,
    });
    await user.save();
  } catch (error) {
    // console.error("Error updating streak:", error);
    res.status(500).json({ message: "Error updating streak", error });
  }
});
