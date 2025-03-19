const Transaction = require("../models/Transaction")
const midtransClient = require("midtrans-client")

exports.createTransaction = async (req, res) => {
    const { first_name, amount } = req.body
    try {
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY
        })

        const orderId = "ORDER-" + new Date().getTime()

        const transactionPayload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount
            },
            credit_card: {
                secure: true
            },
            customer_detail: {
                first_name: first_name
            }
        }


        const transaction = await snap.createTransaction(transactionPayload)

        const transactionUrl = transaction.redirectUrl

        const transactionData = await Transaction.insertOne({
            first_name: first_name,
            amount: amount,
            midtrans_url: transactionUrl,
            transaction_id: orderId
        })

        res.status(200).json(transactionData)

    } catch (error) {

    }
}