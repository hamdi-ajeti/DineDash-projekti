import fs from 'fs';
import restaurantModel from "../models/restaurantModel.js";
import foodModel from "../models/foodModel.js";

// create restaurant
const createRestaurant = async (req, res) => {
    const logo = req.files?.logo?.[0]?.filename || "";
    const image = req.files?.image?.[0]?.filename || "";

    const restaurant = new restaurantModel({
        resId: req.body.resId,
        name: req.body.name,
        logo: logo,
        image: image
    });

    try {
        await restaurant.save();
        res.json({ success: true, message: "Restaurant created" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating restaurant" });
    }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find();
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurants" });
    }
};

// Get a restaurant by ID (with menu)
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findById(req.params.id).populate("foodMenu");
        if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });

        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurant" });
    }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
      const restaurant = await restaurantModel.findById(req.params.id);
      if (!restaurant) {
          return res.json({ success: false, message: "Restaurant not found" });
      }

      let updatedData = {
          name: req.body.name || restaurant.name,
          resId: req.body.resId || restaurant.resId,
      };

      if (req.files?.logo?.[0]) {
          // delete old logo
          fs.unlink(`uploads/${restaurant.logo}`, (err) => {
              if (err) console.log("Error deleting old logo:", err);
          });
          updatedData.logo = req.files.logo[0].filename;
      } else {
          updatedData.logo = restaurant.logo;
      }

      if (req.files?.image?.[0]) {
          // delete old background image
          fs.unlink(`uploads/${restaurant.image}`, (err) => {
              if (err) console.log("Error deleting old image:", err);
          });
          updatedData.image = req.files.image[0].filename;
      } else {
          updatedData.image = restaurant.image;
      }

      await restaurantModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.json({ success: true, message: "Restaurant updated" });

  } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error updating restaurant" });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
    try {
        await restaurantModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Restaurant deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting restaurant" });
    }
};

// Get the menu for a specific restaurant
const getMenuForRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.findById(req.params.id).populate("foodMenu");
        if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });

        res.json({ success: true, data: restaurant.foodMenu });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching menu" });
    }
};


// Add a food item to a restaurant's menu
const addFoodToMenu = async (req, res) => {
  const { restaurantId, foodId } = req.body;

  try {
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });

    const food = await foodModel.findById(foodId);
    if (!food) return res.json({ success: false, message: "Food item not found" });

    // Avoid duplicates
    if (restaurant.foodMenu.includes(foodId)) {
      return res.json({ success: false, message: "Food item already in menu" });
    }

    // Add food ID to foodMenu array
    restaurant.foodMenu.push(foodId);

    await restaurant.save();

    res.json({ success: true, message: "Food added to restaurant menu" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food to menu" });
  }
};
const removeFoodFromMenu = async (req, res) => {
  const { restaurantId, foodId } = req.body;

  try {
    const restaurant = await restaurantModel.findById(restaurantId);
    if (!restaurant) return res.json({ success: false, message: "Restaurant not found" });

    restaurant.foodMenu = restaurant.foodMenu.filter(id => id.toString() !== foodId);
    await restaurant.save();

    res.json({ success: true, message: "Food removed from menu" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food from menu" });
  }
};



export {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getMenuForRestaurant,
    addFoodToMenu,
    removeFoodFromMenu
};
