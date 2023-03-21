// import mongoose
import mongoose from "mongoose";

// Create a Schema
const Items = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latinaName: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

Items.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

// export model
export default mongoose.model("Items", Items);
