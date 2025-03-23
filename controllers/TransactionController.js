const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const midtransClient = require("midtrans-client");

// exports.createTransaction = async (req, res) => {
//   const { first_name, amount, quantity, product_id } = req.body;
//   try {
//     const snap = new midtransClient.Snap({
//       isProduction: false,
//       serverKey: process.env.MIDTRANS_SERVER_KEY,
//     });
//
//     const orderId = "ORDER-" + new Date().getTime();
//
//     const transactionPayload = {
//       transaction_details: {
//         order_id: orderId,
//         gross_amount: amount,
//       },
//       credit_card: {
//         secure: true,
//       },
//       customer_detail: {
//         first_name: first_name,
//       },
//     };
//
//     const transaction = await snap.createTransaction(transactionPayload);
//
//     const transactionUrl = transaction.redirect_url;
//
//     const transactionData = await Transaction.insertOne({
//       product_id: product_id,
//       first_name: first_name,
//       amount: amount,
//       quantity: quantity,
//       midtrans_url: transactionUrl,
//       transaction_id: orderId,
//     });
//
//     const productData = await Product.findById({ _id: product_id });
//
//     if (productData.stock == 0 || quantity > productData.stock) {
//       return res.status(400).json({ message: "stok tidak mencukupi" });
//     }
//
//     await Product.findOneAndUpdate(
//       { _id: product_id },
//       {
//         $inc: { stock: -quantity, sold: quantity },
//       },
//       { new: true },
//     );
//
//     res.status(200).json(transactionData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createTransaction = async (req, res) => {
  try {
    const { first_name, amount, quantity, product_id } = req.body;

    const productData = await Product.findById(product_id);
    if (!productData || productData.stock < quantity) {
      return res.status(400).json({ message: "Stok tidak mencukupi" });
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const orderId = "ORDER-" + new Date().getTime();

    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: first_name,
      },
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${process.env.CLIENT_URL}/payment-success`,
      },
    };

    const transaction = await snap.createTransaction(transactionPayload);
    console.log(transaction);
    const snapToken = transaction.token;

    const transactionData = await Transaction.create({
      product_id: product_id,
      first_name: first_name,
      amount: amount,
      quantity: quantity,
      midtrans_url: snapToken,
      transaction_id: orderId,
    });

    await Product.findByIdAndUpdate(product_id, {
      $inc: { stock: -quantity, sold: quantity },
    });

    res.status(200).json({ snap_token: snapToken, order_id: orderId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

