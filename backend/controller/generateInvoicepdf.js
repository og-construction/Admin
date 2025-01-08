const { jsPDF } = require("jspdf");

const generateInvoicePDF = async (invoiceData) => {
  console.log("Starting PDF generation...");

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("BuildPro OGCS", 105, 10, { align: "center" });
  doc.setFontSize(14);
  doc.text("Order Invoice", 105, 20, { align: "center" });

  // Order Details
  doc.setFontSize(12);
  doc.text(`Order ID: ${invoiceData.orderId}`, 10, 40);
  doc.text(`Total Amount: ₹${invoiceData.totalAmount.toFixed(2)}`, 10, 50);
  doc.text(`GST: ₹${invoiceData.gst.toFixed(2)}`, 10, 60);
  doc.text(`Delivery Charges: ₹${invoiceData.deliveryCharges.toFixed(2)}`, 10, 70);
  doc.text(`Status: ${invoiceData.status}`, 10, 80);

  // Delivery Address
  doc.text("Delivery Address:", 10, 90);
  doc.text(`House/Apartment: ${invoiceData.address.houseNumberOrApartment}`, 10, 100);
  doc.text(`Street/Area: ${invoiceData.address.areaOrStreet}`, 10, 110);
  doc.text(`Landmark: ${invoiceData.address.landmark}`, 10, 120);
  doc.text(`City: ${invoiceData.address.cityOrTown}`, 10, 130);
  doc.text(`State: ${invoiceData.address.selectedState}`, 10, 140);
  doc.text(`Postal Code: ${invoiceData.address.postalCode}`, 10, 150);

  // Items
  doc.text("Items:", 10, 160);
  let yOffset = 170;
  invoiceData.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. Product: ${item.name}, Quantity: ${item.quantity}, Price: ₹${item.price.toFixed(
        2
      )}, GST: ₹${item.gst.toFixed(2)}, Subtotal: ₹${item.subtotal.toFixed(2)}`,

      10,
      yOffset
    );
    yOffset += 10;
  });

  const pdfBuffer = doc.output("arraybuffer");
  console.log("PDF generation completed successfully.");
  return pdfBuffer;
};

module.exports = generateInvoicePDF;
