import { response } from "express";
import foodModel from "../models/foodModel.js";
import fs from 'fs'
import { error, log } from "console";
import restaurantModel from "../models/restaurantModel.js";

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    restaurantId: req.body.restaurantId, // <-- add this
});

    try {
        const savedFood = await food.save();

        // Attach food to a restaurant
        await restaurantModel.findByIdAndUpdate(
            req.body.restaurantId, // this must be sent from client
            { $push: { foodMenu: savedFood._id } },
            { new: true }
        );

        res.json({ 
            success: true, 
            message: "Food Added & Linked to Restaurant", 
            foodId: savedFood._id 
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food" });
    }
};

// list for all food (GET food items)

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}).populate("restaurantId", "name"); // populate only name
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};



//remove food item 
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) return res.json({ success: false, message: "Food not found" });

        fs.unlink(`uploads/${food.image}`, () => {});

        // Remove food ref from all restaurants (or just one if you track it)
        await restaurantModel.updateMany(
            { foodMenu: food._id },
            { $pull: { foodMenu: food._id } }
        );

        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


//remove food item 
//const removeFood = async (req, res) => {
//    try {
//       const food = await foodModel.findById(req.body.id);  //to find food model using id
//        fs.unlink(`uploads/${food.image}`, () => {})         // to delete file from "uploads" folder

        // to delete product data from mongoDB database
//        await foodModel.findByIdAndDelete(req.body.id)
//        res.json({success: true, message: "Food Removed"})
//    } catch (error) {
//        console.log(error);
//       res.json({success: false, message: "Error"})
//    }
//}



// update food item data content
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, restaurantId } = req.body;

        // Find the food item by ID
        const food = await foodModel.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // Prepare updated data
        let updatedData = {
            name: name || food.name,
            description: description || food.description,
            price: price || food.price,
            category: req.body.category !== undefined ? req.body.category : food.category,
        };

        // Handle image update
        if (req.file) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) console.log("Error deleting old image:", err);
            });
            updatedData.image = req.file.filename;
        }

        // Handle restaurant change
        const currentRestaurantId = food.restaurantId?.toString();

        if (restaurantId && restaurantId !== currentRestaurantId) {
            // Remove from old restaurant
            if (currentRestaurantId) {
                await restaurantModel.findByIdAndUpdate(currentRestaurantId, {
                    $pull: { foodMenu: food._id }
                });
            }

            // Add to new restaurant
            await restaurantModel.findByIdAndUpdate(restaurantId, {
                $addToSet: { foodMenu: food._id }
            });

            updatedData.restaurantId = restaurantId;
        }

        // Update the food item
        await foodModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.json({ success: true, message: "Food updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
};




const getRestaurantMenu = async (req, res) => {
    try {
        const restaurant = await restaurantModel
            .findById(req.params.restaurantId)
            .populate("foodMenu");

        if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });

        res.json({ success: true, data: restaurant.foodMenu });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood, updateFood, getRestaurantMenu}
