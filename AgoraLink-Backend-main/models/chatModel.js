const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text message (optional because user can send only a file)
    content: {
      type: String,
      default: "",
    },

    // Uploaded file path
    file: {
      type: String,
      default: "",
    },

    // Workspace reference
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    // Group reference
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;