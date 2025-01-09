import axios from "axios";
import React, { useState , useEffect  } from "react";
import { FaTrash } from "react-icons/fa";
import {baseurl} from "../../config/url"
const CreateProduct = () => {
    
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [stock, setStock] = useState(0);
  const [minquantity, setMinquantity] = useState("");
  const [maxquantity, setMaxquantity] = useState("");
  const [gstnumber, setGstnumber] = useState("");
  const [hsncode, setHsncode] = useState("");
  const [saleMode, setSaleMode] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [deliveryUnit, setDeliveryUnit] = useState("Days");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  


  // Fetch categories
  useEffect(() => {
    axios
      .get(`${baseurl}/api/category/get-all`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryToggle = (category) => {
    setSelectedCategory(category?._id);
    // Toggle the expand/collapse state for the clicked category
    if (expandedCategory && expandedCategory._id === category._id) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);

      // Fetch subcategories for the category if not already loaded
      if (!subcategories[category._id]) {
        axios
          .get(`${baseurl}/api/subcategory/category/${category._id}`)
          .then((response) => {
            setSubcategories((prevState) => ({
              ...prevState,
              [category._id]: response.data,
            }));
          })
          .catch((error) =>
            console.error("Error fetching subcategories:", error)
          );
      }
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory._id);
  };

  

  const validUnits = [
    "Perkg",
    "PerNumber",
    "PerMeter",
    "PerLiter",
    "PerCum",
    "PerCft",
    "PerMT",
    "PerBox",
    "PerRF",
    "PerRM",
    "PerLtr",
    "PerSqft",
    "perBundle",
    "PerRoll",
  ];

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubcategory) {
      alert("Please select a category and subcategory.");
      return;
    }
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productPrice", productPrice);
    formData.append("priceUnit", priceUnit);
    formData.append("stock", stock);
    formData.append("minquantity", minquantity);
    formData.append("maxquantity", maxquantity);
    formData.append("gstnumber", gstnumber);
    formData.append("hsncode", hsncode);
    formData.append("saleMode", saleMode);
    formData.append("deliveryDuration", deliveryDuration);
    formData.append("deliveryUnit", deliveryUnit);
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);

    if (image) formData.append("mainImage", image);

    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      const response = await axios.post(`${baseurl}/api/seller/sell-product`, formData, {
        headers: { "Content-Type": "multipart/form-data",
"Authorization": `Bearer ${token}`

         },
      });
      if (response.status === 201) alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [visibilityLevel, setVisibilityLevel] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState({
    baseCharge: "",
    perKmCharge: "",
    weightCharge: "",
    maxDistance: "",
  });

  const handleImageChange = (event) => {
    const selectedImages = event.target.files;
    const updatedImages = [...images];

    for (let i = 0; i < selectedImages.length; i++) {
      updatedImages.push(selectedImages[i]);
    }
    if (updatedImages.length > 5) {
      
      return;
    }
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleVisibilityChange = (value) => {
    setVisibilityLevel(value);
  };

  const handleDeliveryChargesChange = (field, value) => {
    setDeliveryCharges((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceUnitChange = (e) => {
    setPriceUnit(e.target.value);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Sidebar: Categories */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Select Category</h2>
          <ul>
            {categories.map((category) => (
              <li key={category._id} className="mb-2">
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className={`w-full flex justify-between items-center p-2 rounded ${
                    expandedCategory?._id === category._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {category.name}
                  <span>
                    {expandedCategory?._id === category._id ? "-" : "+"}
                  </span>
                </button>
                {expandedCategory?._id === category._id &&
                  subcategories[category._id]?.length > 0 && (
                    <ul className="ml-4 mt-2">
                      {subcategories[category._id].map((subcategory) => (
                        <li key={subcategory._id}>
                          <button
                            onClick={() => handleSubcategorySelect(subcategory)}
                            className={`w-full text-left p-2 rounded ${
                              selectedSubcategory === subcategory._id
                                ? "bg-green-500 text-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </div>


        {/* Right: Product Details */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Product Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Product Price */}
            <div>
              <label className="block text-sm font-medium">Price</label>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Enter price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                />
                <select
                  value={priceUnit}
                  onChange={handlePriceUnitChange}
                  className="p-2 border rounded-r"
                >
                  <option value="">--Select Unit--</option>
                  {validUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
         
            </div>

            {/* Product Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium">
                Product Description
              </label>
              <textarea
                placeholder="Enter description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full p-2 border rounded"
              ></textarea>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium">Size</label>
              <input
                type="text"
                placeholder="Enter size"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Minimum Quantity */}
            <div>
              <label className="block text-sm font-medium">Minimum Quantity</label>
              <input
                type="number"
                placeholder="Enter minimum quantity"
                value={minquantity}
                onChange={(e) => setMinquantity(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Maximum Quantity */}
            <div>
              <label className="block text-sm font-medium">Maximum Quantity</label>
              <input
                type="number"
                placeholder="Enter maximum quantity"
                value={maxquantity}
                onChange={(e) => setMaxquantity(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* GST */}
            <div>
              <label className="block text-sm font-medium">GST</label>
              <input
                type="number"
                placeholder="Enter GST percentage (e.g., 18)"
                value={gstnumber}
                onChange={(e) => setGstnumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* HSN Code */}
            <div>
              <label className="block text-sm font-medium">HSN Code</label>
              <input
                type="text"
                placeholder="Enter HSN code"
                value={hsncode}
                onChange={(e) => setHsncode(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Sale Mode */}
            <div>
              <label className="block text-sm font-medium">Sale Mode</label>
              <select
                value={saleMode}
                onChange={(e) => setSaleMode(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">--Select--</option>
                <option value="Sale By Seller">Sale By Seller</option>
                <option value="Sale By OGCS">Sale By OGCS</option>
              </select>

              {saleMode == "Sale By Seller" && (
          <label className="text-sm font-medium text-gray-700">
            Visibility Level
            <select
              name="visibilityLevel"
              value={visibilityLevel}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            >
              <option value="">--Select Visibility Level--</option>
              <option value="1X">1X</option>
              <option value="2X">2X</option>
              <option value="3X">3x</option>
              <option value="4X">4X</option>
            </select>
          </label>
        )}
      </div>

      {saleMode === "Sale By OGCS" && (
        <div className="mb-2">
          <h2 className="text-xl font-semibold mb-2">Delivery Charges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Base Charge
              <input
                required
                type="number"
                value={deliveryCharges.baseCharge}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleDeliveryChargesChange("baseCharge", value); // Only allow positive numbers
                  }
                }}
                placeholder="Enter base charge"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Per Km Charge
              <input
                required
                type="number"
                value={deliveryCharges.perKmCharge}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleDeliveryChargesChange("perKmCharge", value); // Only allow positive numbers
                  }
                }}
                placeholder="Enter per km charge"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Weight Charge
              <input
                required
                type="number"
                value={deliveryCharges.weightCharge}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleDeliveryChargesChange("weightCharge", value); // Only allow positive numbers
                  }
                }}
                placeholder="Enter weight charge"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Max Km Distance
              <input
                required
                type="number"
                value={deliveryCharges.maxDistance}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    handleDeliveryChargesChange("maxDistance", value); // Only allow positive numbers
                  }
                }}
                placeholder="Enter max distance"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              />
            </label>
          </div>
        </div>
      )}

      {/* //end */}
             

            {/* Delivery Preference */}
            <div>
              <label className="block text-sm font-medium">Delivery Duration</label>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Enter amount (e.g., 5)"
                  value={deliveryDuration}
                  onChange={(e) => setDeliveryDuration(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                />
                <select
                  value={deliveryUnit}
                  onChange={(e) => setDeliveryUnit(e.target.value)}
                  className="p-2 border rounded-r"
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                </select>
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700">
        Main Product Image
        <input
          type="file"
          required
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];

            setImage(file); // Store the file in state
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const imgPreview = document.getElementById("image-preview");
                imgPreview.src = reader.result;
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
        />
      </label>
      {image && (
        <div className="relative w-fit">
          <img
            id="image-preview"
            alt="Selected Product"
            className="w-24 h-24 object-cover border rounded"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-700"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {/* multiple images */}
      <label className="block my-2 text-sm font-medium text-gray-700">
        Additional Images
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
        />
      </label>

      {images.length > 0 && true && (
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
          >
            Create Product
          </button>
        </div>
      </div>
     </div>
     
     </div>
  );
};

export default CreateProduct;
