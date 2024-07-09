const menuModel = require('../models/menuModel');

const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { getCurrentIPAddress, generateRandomAlphaNumericID } = require("../uitls/utils");
const { port } = require("../config/config");
const restaurantModel = require('../models/restaurantModel');
const { isValidObjectId } = require('mongoose');


// ADD MENU
const addMenu = async (req, res) => {
    try {

        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "User Id is required"});
        };

        let { title, description, isActive } = req.body;
        // if (!title || !description || !isActive || !userId) {
        //     return res.status(400).send({ status: false, message: "all fields are required"});
        // };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Restaurant not found"});
        };

        // let { thumbnail } = req.files;

        let { File_Extension, File_Path, File_data, File_name } = req.body.thumbnail;

        let thumbnailObj;
        if (req.body.thumbnail) {

            let decodedData = Buffer.from(File_data, "base64");

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/menus/";
            let imgUniqName = uuid.v4() + File_Extension;
            let imgUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "menus", imgUniqName);

            fs.writeFileSync(imgSavingPath, decodedData);

            thumbnailObj = {
                imgName: imgUniqName,
                imgPath: imgUrl
            };
        }
        
        let menuData = {
            title,
            description,
            thumbnail: thumbnailObj? thumbnailObj : "",
            isActive,
            userId
        };

        let newMenu = await menuModel.create(menuData);

        return res.status(200).send({
            status: true,
            message: "Menu added successfully",
            data: newMenu,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL MENUS
const getAllMenus = async (req, res) => {
    try {
        let { userId } = req.params;

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required"});
        };

        let allMenus = await menuModel.find({userId});

        return res.status(200).send({
            status: true,
            message: "Success",
            munus: allMenus
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET MENU BY MENUID
const getMenuById = async (req, res) => {
    try {
        let { menuId } = req.params;
        if ( !menuId ) {
            return res.status(400).send({ status: false, message: "menuId is required" });
        };

        if (!isValidObjectId(menuId)) {
            return res.status(400).send({ status: false, message: "Invalid menuId"});
        };

        let menu = await menuModel.findById(menuId);

        if (!menu) {
            return res.status(400).send({ status: false, message: "Menu not found"});
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            data: menu
        })
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// UPDATE MENU
const updateMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        if (!menuId) {
            return res.status(400).send({ status: false, message: "menuId is required"});
        };

        if (!isValidObjectId(menuId)) {
            return res.status(400).send({ status: false, message: "Invalid menuId"});
        };

        let menu = await menuModel.findById(menuId);

        if (!menu) {
            return res.status(400).send({ status: false, message: "Menu not found"});
        };

        let ele = req.body;

        if ("title" in ele) {
            menu.title = ele.title;
        };

        if ("description" in ele) {
            menu.description = ele.description;
        };

        if ("isActive" in ele) {
            menu.isActive = ele.isActive;
        };

        if ("thumbnail" in ele) {

            let oldImg = menu.thumbnail.imgName;

            let oldImgPath = path.join(__dirname, "..", "..", "menus", oldImg);

            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            };

            let { File_Extension, File_Path, File_data, File_name } = req.body.thumbnail;

            let decodedImg = Buffer.from(File_data, "base64");

            let imgRelativePath = "/menus/";
            let currentIpAddress = getCurrentIPAddress();
            let imgUniqName = uuid.v4() + File_Extension;
            let imgUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "menus", imgUniqName);

            fs.writeFileSync(imgSavingPath, decodedImg);

            let imgObj = {
                imgName: imgUniqName,
                imgPath: imgUrl
            };

            menu.thumbnail = imgObj;
        };

        await menu.save();

        return res.status(200).send({
            status: true,
            message: "Menu updated successfully",
            data: menu
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE MENU BY ID
const deleteMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        if (!menuId) {
            return res.status(400).send({ status: false, message: "menuId is required"});
        };

        if (!isValidObjectId(menuId)) {
            return res.status(400).send({ status: false, message: "Invalid menuId"});
        };

        let menu = await menuModel.findById(menuId);

        if (!menu) {
            return res.status(400).send({ status: false, message: "Menu not found"});
        };

        let oldImg = menu.thumbnail.imgName;

        let oldImgPath = path.join(__dirname, "..", "..", "menus", oldImg);

        if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
        };

        await menuModel.deleteOne({ _id: menuId });

        return res.status(200).send({
            status: true,
            message: "Menu deleted successfully",
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};

module.exports = {
    addMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
};