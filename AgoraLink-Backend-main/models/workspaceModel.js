const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    workspaceName: {
      type: String,
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model(
  "Workspace",
  workspaceSchema
);

module.exports = Workspace;