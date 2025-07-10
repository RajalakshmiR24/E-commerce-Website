const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate invoice PDF
const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ margin: 50 });
      
      // Generate filename
      const filename = `invoice-${order.orderNumber}.pdf`;
      const filepath = path.join(__dirname, '../uploads/invoices', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Pipe to file
      doc.pipe(fs.createWriteStream(filepath));
      
      // Add company header
      doc.fontSize(20)
         .text('ABI STORE', 50, 50)
         .fontSize(10)
         .text('Your One-Stop Shopping Destination', 50, 75)
         .text('123 Store Street, City, State 12345', 50, 90)
         .text('Phone: +91 98765 43210 | Email: info@abistore.com', 50, 105);
      
      // Add invoice title
      doc.fontSize(16)
         .text('INVOICE', 400, 50)
         .fontSize(10)
         .text(`Invoice Number: INV-${order.orderNumber}`, 400, 75)
         .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 90)
         .text(`Due Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 105);
      
      // Add line
      doc.moveTo(50, 130)
         .lineTo(550, 130)
         .stroke();
      
      // Add billing information
      doc.fontSize(12)
         .text('Bill To:', 50, 150)
         .fontSize(10)
         .text(order.shippingAddress.name, 50, 170)
         .text(order.shippingAddress.address, 50, 185)
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`, 50, 200)
         .text(`Phone: ${order.shippingAddress.phone}`, 50, 215);
      
      // Add order information
      doc.fontSize(12)
         .text('Order Details:', 300, 150)
         .fontSize(10)
         .text(`Order Number: ${order.orderNumber}`, 300, 170)
         .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 300, 185)
         .text(`Payment Method: ${order.payment.method.toUpperCase()}`, 300, 200)
         .text(`Payment Status: ${order.payment.status.toUpperCase()}`, 300, 215);
      
      // Add table header
      const tableTop = 250;
      doc.fontSize(10)
         .text('Item', 50, tableTop)
         .text('Qty', 300, tableTop)
         .text('Price', 350, tableTop)
         .text('Total', 450, tableTop);
      
      // Add line under header
      doc.moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();
      
      // Add items
      let yPosition = tableTop + 30;
      order.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        
        doc.text(item.product.name || 'Product', 50, yPosition)
           .text(item.quantity.toString(), 300, yPosition)
           .text(`₹${item.price.toFixed(2)}`, 350, yPosition)
           .text(`₹${itemTotal.toFixed(2)}`, 450, yPosition);
        
        yPosition += 20;
      });
      
      // Add totals
      yPosition += 20;
      doc.moveTo(300, yPosition)
         .lineTo(550, yPosition)
         .stroke();
      
      yPosition += 15;
      doc.text('Subtotal:', 350, yPosition)
         .text(`₹${order.pricing.subtotal.toFixed(2)}`, 450, yPosition);
      
      yPosition += 15;
      doc.text('Shipping:', 350, yPosition)
         .text(`₹${order.pricing.shipping.toFixed(2)}`, 450, yPosition);
      
      yPosition += 15;
      doc.text('Tax (GST 18%):', 350, yPosition)
         .text(`₹${order.pricing.tax.toFixed(2)}`, 450, yPosition);
      
      if (order.pricing.discount > 0) {
        yPosition += 15;
        doc.text('Discount:', 350, yPosition)
           .text(`-₹${order.pricing.discount.toFixed(2)}`, 450, yPosition);
      }
      
      yPosition += 15;
      doc.moveTo(300, yPosition)
         .lineTo(550, yPosition)
         .stroke();
      
      yPosition += 15;
      doc.fontSize(12)
         .text('Total:', 350, yPosition)
         .text(`₹${order.pricing.total.toFixed(2)}`, 450, yPosition);
      
      // Add footer
      yPosition += 50;
      doc.fontSize(10)
         .text('Thank you for your business!', 50, yPosition)
         .text('For any queries, contact us at support@abistore.com', 50, yPosition + 15);
      
      // Add payment information if paid
      if (order.payment.status === 'completed') {
        yPosition += 40;
        doc.text('Payment Information:', 50, yPosition)
           .text(`Transaction ID: ${order.payment.razorpayPaymentId}`, 50, yPosition + 15)
           .text(`Payment Date: ${new Date(order.payment.paidAt).toLocaleDateString()}`, 50, yPosition + 30);
      }
      
      // Finalize the PDF
      doc.end();
      
      // Return the file path
      doc.on('end', () => {
        resolve(`/uploads/invoices/${filename}`);
      });
      
      doc.on('error', (error) => {
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

// Generate invoice number
const generateInvoiceNumber = (orderNumber) => {
  return `INV-${orderNumber}`;
};

module.exports = {
  generateInvoice,
  generateInvoiceNumber
};