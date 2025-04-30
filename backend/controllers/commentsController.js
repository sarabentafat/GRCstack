const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");

/**----------------------------------------------
 * @desc    Create new Comment
 * @route   POST /api/comments
 * @method  POST
 * @access  private (only logged-in user)
 * ----------------------------------------------*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const profile = await User.findById(req.user._id);
  const comment = await Comment.create({
    productId: req.body.productId,
    text: req.body.text,
    user: req.user._id,
    username: profile.username,
  });

  res.status(201).json({ message: "Comment created successfully", comment });
});

/**----------------------------------------------
 * @desc   Get all Comments
 * @route   GET /api/comments
 * @method  GET
 * @access  private (only logged-in user)
 * ----------------------------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {

  const comments = await Comment.find().populate("user");
  res.status(200).json(comments);
});

/**----------------------------------------------
 * @desc   Delete Comment
 * @route   DELETE /api/comments/:id
 * @method  DELETE
 * @access  private (only logged-in user)
 * ----------------------------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment has been deleted" });
  } else {
    return res
      .status(403)
      .json({ message: "Access denied, not allowed to delete this comment" });
  }
});
