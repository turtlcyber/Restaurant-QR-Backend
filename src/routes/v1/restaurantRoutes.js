const express = require('express');
const router = express.Router();

const {
    authenticateAdmin,
    updateRestaurantDatails,
    addUpdateLogo,
    getAllRestaurants,
    getRestaurantById,
    deleteRestaurant, 
    
} = require('../../controllers/restaurantController');

// AUTHENTICATE USER
router.post("/api/v1/authenticateRestaurant", authenticateAdmin);

// GET USER BY ID
router.get("/api/v1/getRestaurant/:userId/:key", getRestaurantById);

// GET ALL USERS
router.get("/api/v1/restaurant/:key", getAllRestaurants);

// UPDATE USER
router.post("/api/v1/updateRestaurant/:userId", updateRestaurantDatails);

// ADD UPDATE LOGO
router.post("/api/v1/updateLogo/:userId", addUpdateLogo);

// DELETE USER BY USER ID
router.delete("/api/v1/deleteRestaurant/:userId", deleteRestaurant);


module.exports = router;