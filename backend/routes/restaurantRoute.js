import express from "express";
import multer from "multer";
import {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getMenuForRestaurant,
    addFoodToMenu,
    removeFoodFromMenu
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

// Set up multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
restaurantRouter.post(
    "/add",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]),
    createRestaurant
);

restaurantRouter.post("/remove-food", removeFoodFromMenu);
restaurantRouter.get("/list", getAllRestaurants);
restaurantRouter.get("/get/:id", getRestaurantById);
restaurantRouter.put(
    "/update/:id",
    upload.fields([
        { name: "logo", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]),
    updateRestaurant
);
restaurantRouter.delete("/delete/:id", deleteRestaurant);
restaurantRouter.get("/menu/:id", getMenuForRestaurant);
restaurantRouter.post("/add-food", addFoodToMenu);

export default restaurantRouter;