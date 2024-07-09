const { isValidObjectId } = require('mongoose');
const restaurantModel = require('../models/restaurantModel');

// DELETE BANNER IMAGE BY ID
const deleteBannerImage = async (req, res) => {
    try {
        let { userId, imageId } = req.params;
        if (!userId || !imageId) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        };

        let restaurant = await restaurantModel.findOne({ userId });

        if (!restaurant) {
            return res.status(400).send({ status: false, message: "Not Found!!!" });
        };

        // Filter out the image with the specified imageId
        const updatedBanners = restaurant.banners.filter(banner => banner._id.toString() !== imageId);

        if (updatedBanners.length === restaurant.banners.length) {
            return res.status(400).send({ status: false, message: "Image not found in banners" });
        };

        restaurant.banners = updatedBanners;
        await restaurant.save();

        return res.status(200).send({
            status: true,
            message: "Banner deleted successfully",
            banners: restaurant.banners,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// ADD OR UPDATE BANNER IMAGES
const addUpdateImage = async (req, res) => {
    try {
        let { imageId } = req.params;

        if (!imageId) {
            return res.status(400).send({ status: false, message: "Image Id is required" });
        };

        if (!isValidObjectId(imageId)) {
            return res.status(400).send({ status: false, message: "Invalid imageId"});
        };

        let item = await itemModel.findOne({ userId: userId });

        if (!item) {
            return res.status(400).send({ status: false, message: "Item not found"});
        };

        let arr = item.itemImages;

        if (arr.length) {
            for (let i=0; i<arr.length; i++) {
                if ( imgId === arr[i]._id.toString() ) {
                    let arr = item.itemImages;
                    arr.splice(i, 1);
                    await item.save();
                }
            }
        };

        // if (arr.length) {
        //     for (let i=0; i<arr.length; i++) {
        //         if (imgId)
        //     }
        // }

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = { deleteBannerImage };

function table1(n) {
    let ans = 1;

    for (let i=1; i<11; i++) {
        ans = n * i;
        console.log(n, "X", i, "=", ans );
    }
};

function table(n) {
    let ans = 1;
    let i = 73;

    while (i < 658) {
        ans = n * i;
        console.log(n, "X", i, "=", ans);
        i += 73;
    }
};

table(152207);