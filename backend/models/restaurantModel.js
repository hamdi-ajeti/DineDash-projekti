import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  resId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, required: false },
  image: { type: String, required: false },
  foodMenu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food"
    }
  ]
});

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;
