const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const midtransClient = require("midtrans-client");

exports.createTransaction = async (req, res) => {
  const { first_name, amount, quantity, product_id } = req.body;
  try {
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
      credit_card: {
        secure: true,
      },
      customer_detail: {
        first_name: first_name,
      },
    };

    const transaction = await snap.createTransaction(transactionPayload);

    const transactionUrl = transaction.redirect_url;

    const transactionData = await Transaction.insertOne({
      product_id: product_id,
      first_name: first_name,
      amount: amount,
      quantity: quantity,
      midtrans_url: transactionUrl,
      transaction_id: orderId,
    });

    const productData = await Product.findById({ _id: product_id });

    if (productData.stock == 0 || quantity > productData.stock) {
      return res.status(400).json({ message: "stok tidak mencukupi" });
    }

    await Product.findOneAndUpdate(
      { _id: product_id },
      {
        $inc: { stock: -quantity, sold: quantity },
      },
      { new: true },
    );

    res.status(200).json(transactionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

