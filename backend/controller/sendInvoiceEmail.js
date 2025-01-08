const sendEmail = require("./emailCtrl");
const asyncHandler = require("express-async-handler"); // Add this import

const sendInvoiceEmail = asyncHandler(async (req, res) => {
  const {
    sellerEmail,
    productName,
    productPrice,
    maxQuantity,
    visibilityLevel,
    visibilityCharges,
    depositCharges,
    saleMode,
  } = req.body;

  if (!sellerEmail || !productName || !productPrice || !maxQuantity) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const templateData = {
      productName,
      productPrice,
      maxQuantity,
      visibilityLevel,
      visibilityCharges: visibilityCharges || null,
      depositCharges: depositCharges || null,
      saleMode,
    };

    const subject =
      saleMode === "Sale By OGCS"
        ? "OGCS Deposit Invoice"
        : "BuildPro Visibility Invoice";

    await sendEmail({
      to: sellerEmail,
      subject,
      type: "orderInvoice",
      templateData,
    });

    res.status(200).json({ message: "Invoice email sent successfully" });
  } catch (error) {
    console.error("Error sending invoice email:", error.message);
    res.status(500).json({ message: "Error sending invoice email" });
  }
});

module.exports = { sendInvoiceEmail };
