// import mongoose
import mongoose from "mongoose";

// Create a Schema
const Types = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

Types.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

// export model
export default mongoose.model("Types", Types);
