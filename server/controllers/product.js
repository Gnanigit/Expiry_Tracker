// import { spawn } from "child_process";
import multer from "multer";
// import getProdDetails from "../utils/getProdDetails.js";
import getProdInfo from "../utils/getProdInfo.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
// import { console } from "inspector";
import { scrapeAmazon, scrapeFlipkart } from "../utils/priceComaprison.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

// export const getBarcodeNumber = (req, res) => {
//   // Use multer middleware to parse the image
//   upload.single("file")(req, res, (err) => {
//     if (err) {
//       console.error("Multer error:", err);
//       return res.status(500).json({ error: "File upload failed" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No image data received" });
//     }

//     const pythonProcess = spawn("python", [
//       "C:\\Users\\Gnaneswar Yalla\\Desktop\\Expiry_Tracker\\server\\utils\\final.py",
//     ]);

//     // Write the file buffer to Python's stdin
//     pythonProcess.stdin.write(req.file.buffer);
//     pythonProcess.stdin.end();

//     let result = [];

//     pythonProcess.stdout.on("data", (data) => {
//       try {
//         const parsedData = JSON.parse(data);

//         // Filter and process the data
//         const validData = parsedData.filter((item) =>
//           Object.values(item).some((value) => value.length === 13)
//         );

//         if (validData.length > 0) {
//           const selectedData = validData.find((item) =>
//             Object.keys(item).includes("data_1")
//           );

//           const response = {
//             data: selectedData
//               ? selectedData.data_1
//               : Object.values(validData[0])[0],
//           };

//           result = response;
//         }
//       } catch (err) {
//         console.error("Error parsing data:", err.message);
//       }
//     });

//     pythonProcess.stderr.on("data", (error) => {
//       console.error("Error:", error.toString());
//     });

//     pythonProcess.on("close", (code) => {
//       if (code === 0) {
//         try {
//           res.status(200).json(result);
//         } catch (err) {
//           res.status(500).json({ error: "Failed to process response" });
//         }
//       } else {
//         res.status(500).json({ error: "Python script failed" });
//       }
//     });
//   });
// };

// ------------ Product Details code - 1 -----------------

// export const getProductName = async (req, res) => {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ message: "Barcode is required" });
//   }

//   try {
//     const productDetails = await getProdDetails({ barcode: code });
//     let description = productDetails["Product description"].slice(8).trim();

//     const cutIndex = description.search(/[0-9(\[{]/);

//     if (cutIndex !== -1) {
//       description = description.slice(0, cutIndex).trim();
//     }
//     const result = {
//       description: description,
//       image: productDetails.img,
//     };

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getProductName:", error);
//     return res.status(500).json({ message: "Failed to fetch product details" });
//   }
// };

export const getProductDetails = async (req, res) => {
  const { code } = req.query;
  console.log(code);
  console.log("hello");

  if (!code) {
    return res.status(400).json({ message: "Barcode is required" });
  }

  try {
    const productDetails = await getProdInfo({ barcode: code });

    const result = {
      name: productDetails["productName"],
      image: productDetails["productImage"]["src"],
      alt: productDetails["productImage"]["alt"],
      brand: productDetails["tableData"][1][1],
      ean: productDetails["tableData"][0][1],
      category: productDetails["tableData"][2][1],
      description: productDetails["div4"]["span"],

      additional_content: (() => {
        const div5 = productDetails["div5"];

        if (div5?.type === "list" && Array.isArray(div5.items)) {
          return div5.items.map((item) => {
            const key = item?.key?.trim() || null;
            const value = item?.value?.trim() || null;
            return { key, value };
          });
        } else if (div5?.span) {
          return div5.span?.trim() || null;
        } else {
          return null;
        }
      })(),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductName:", error);
    return res.status(500).json({ message: "Failed to fetch product details" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productName, imageUri, expDate, status } = req.body;

    const [day, month, year] = expDate.split("/").map(Number);
    const formattedDate = new Date(year, month - 1, day);

    const name = productName;
    const expiryDate = formattedDate;
    const prodImage = imageUri;

    const userId = req.user.userId;

    if (!name || !prodImage || !expiryDate || !status) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.numberOfProducts = user.numberOfProducts + 1;
    await user.save();

    const newProduct = new Product({
      name,
      prodImage,
      expiryDate,
      status,
      userId,
    });

    const savedProduct = await newProduct.save();

    // Convert expiryDate to ViewableDate format
    const ViewableDate = `${expiryDate.getDate()}/${
      expiryDate.getMonth() + 1
    }/${expiryDate.getFullYear()}`;

    const productWithViewableDate = {
      ...savedProduct.toObject(),
      expiryDate: ViewableDate,
    };

    res.status(201).json({
      message: "Product created successfully",
      product: productWithViewableDate,
      user,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "An error occurred while creating the product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const allProducts = await Product.find({ userId: userId });
    const formattedProducts = allProducts.map((product) => {
      const expiryDate = new Date(product.expiryDate);
      const formattedDate = `${expiryDate.getDate()}/${
        expiryDate.getMonth() + 1
      }/${expiryDate.getFullYear()}`;

      return {
        ...product._doc,
        expiryDate: formattedDate,
      };
    });

    return res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error in getProductName:", error);
    return res.status(500).json({ message: "Failed to fetch product details" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.numberOfProducts = user.numberOfProducts - 1;
    console.log(user);
    await user.save();

    return res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const { query } = req.query;

    const exactMatches = await Product.find({
      name: { $regex: `^${query}$`, $options: "i" },
      userId: userId,
    });

    const partialMatches = await Product.find({
      userId: userId,
      name: { $regex: query, $options: "i" },
    });

    let merged = exactMatches.concat(partialMatches);
    const formattedProducts = merged.map((product) => {
      const expiryDate = new Date(product.expiryDate);
      const formattedDate = `${expiryDate.getDate()}/${
        expiryDate.getMonth() + 1
      }/${expiryDate.getFullYear()}`;

      return {
        ...product._doc,
        expiryDate: formattedDate,
      };
    });
    return res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getPriceComparison = async (req, res) => {
  const { prodName } = req.query;
  console.log("Received Product Name:", prodName);

  if (!prodName) {
    return res.status(400).json({ message: "Product Name is required" });
  }

  try {
    const amazonProductDetails = await scrapeAmazon(prodName); // Fixed parameter
    const flipkartProductDetails = await scrapeFlipkart(prodName); // Fixed parameter
    console.log("Flipkart Product Details:", flipkartProductDetails);
    return res.status(200).json({
      amazon: amazonProductDetails,
      flipkart: flipkartProductDetails,
    });
  } catch (error) {
    console.error("Error in getPriceComparison:", error);
    return res.status(500).json({ message: "Failed to fetch product details" });
  }
};
