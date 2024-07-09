const restaurantModel = require("../models/restaurantModel");
const deletedUserModel = require('../models/deleteUserModel');
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../uitls/utils");
const { port } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const { adminSecretKey } = require('../config/config');


// LOGIN USER
const authenticateAdmin = async (req, res) => {
    try {
        let { userId, userName, email, profilePic } = req.body;

        const isUserExists = await restaurantModel.findOne({ userId });

        if (!isUserExists) {
            let userObj = {
                userId,
                userName,
                email,
                profilePic
            };

            let newUser = await restaurantModel.create(userObj);
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: newUser
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Authentication successful",
                data: isUserExists,
            });
        };

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// REGISTER USER
const updateRestaurantDatails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
        };

        let reqBody = req.body;

        if ("userName" in reqBody) {
            restaurant.userName = reqBody.userName;
        };

        if ("restaurantName" in reqBody) {
            restaurant.restaurantName = reqBody.restaurantName;
        };

        if ("mobile" in reqBody) {
            restaurant.mobile = reqBody.mobile;
        };

        if ("description" in reqBody) {
            restaurant.description = reqBody.description;
        };

        if ("restaurant_address" in reqBody) {
            if ("address" in reqBody.restaurant_address) {
                restaurant.restaurant_address.address = reqBody.restaurant_address.address;
            };

            if ("apartment" in reqBody.restaurant_address) {
                restaurant.restaurant_address.apartment = reqBody.restaurant_address.apartment;
            };

            if ("city" in reqBody.restaurant_address) {
                restaurant.restaurant_address.city = reqBody.restaurant_address.city;
            };

            if ("post_code" in reqBody.restaurant_address) {
                restaurant.restaurant_address.post_code = reqBody.restaurant_address.post_code;
            };

            if ("state" in reqBody.restaurant_address) {
                restaurant.restaurant_address.state = reqBody.restaurant_address.state;
            }
        };

        if ("slug" in reqBody) {
            let allRestaurant = await restaurantModel.find();

            for (let obj of allRestaurant) {
                if (reqBody.slug === obj.slug) {
                    return res.status(200).send({ status: false, message: "This slug is duplicate"});
                }
            };
            restaurant.slug = reqBody.slug;
        };

        if ("sitting_capacity" in reqBody) {
            restaurant.sitting_capacity = reqBody.sitting_capacity;
        };

        if ("isVeg" in reqBody) {
            restaurant.isVeg = reqBody.isVeg;
        };

        if ("max_allow_seating" in req.body) {
            restaurant.max_allow_seating = reqBody.max_allow_seating;
        };

        if ("contact_number" in reqBody) {
            restaurant.contact_number  = reqBody.contact_number
        };

        if ("contact_person" in reqBody) {
            restaurant.contact_person = reqBody.contact_person;
        };

        if ("website" in reqBody) {
            restaurant.website = reqBody.website;
        };

        if ("rating_review_url" in reqBody) {
            restaurant.rating_review_url = reqBody.rating_review_url;
        };

        if ("GST_number" in reqBody) {
            restaurant.GST_number = reqBody.GST_number;
        };

        if ("isActive" in reqBody) {
            restaurant.isActive = reqBody.isActive;
        };

        await restaurant.save();

        return res.status(200).send({
            status: true,
            message: "Restaurant updated successfully",
            data: restaurant,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// ADD OR UPDATE LOGO
const addUpdateLogo = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
        };

        let { File_Extension, File_Path, File_data, File_name } = req.body;

        let decodedData = Buffer.from(File_data, "base64");

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/banners/";
        let imgUniqName = uuid.v4() + File_Extension;
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "banners", imgUniqName);

        let oldImgName = restaurant.logo.logoName;

        if (oldImgName) {
            let oldImgPath = path.join(__dirname, "..", "..", "banners", oldImgName);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            };
        };
        
        fs.writeFileSync(imgSavingPath, decodedData);

        let logoObj = {
            logoName: imgUniqName,
            logoPath: imgFullUrl
        };

        restaurant.logo = logoObj;

        await restaurant.save();

        return res.status(200).send({
            status: true,
            message: "logo updated successfully",
            logo: restaurant.logo,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET USER BY ID
const getRestaurantById = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId ) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        // };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: restaurant
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET ALL USERS
const getAllRestaurants = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "key is required"});
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!"});
        };

        let restaurants = await restaurantModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: restaurants
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE USER
const deleteRestaurant = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({
                status: false,
                message: "Restaurant not found",
            });
        };

        const { reason, feedback} = req.body;

        let restaurantData = {
            restaurant,
        };

        let jsonStr = JSON.stringify(restaurantData);

        await restaurantModel.deleteOne({ userId });

        let deletedUserData = {
            userId,
            deletedRestaurantData: jsonStr,
            reason,
            feedback,
            deletedAt: new Date().toLocaleString()
        };

        await deletedUserModel.create(deletedUserData);

        return res.status(200).send({
            status: true,
            message: "Restaurant deleted successfully",
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


module.exports = {
    authenticateAdmin,
    updateRestaurantDatails,
    addUpdateLogo,
    deleteRestaurant,
    getRestaurantById,
    getAllRestaurants
};
