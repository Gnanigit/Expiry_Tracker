const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    mfgDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    prodImage: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
