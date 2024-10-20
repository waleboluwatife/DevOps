export const createPaymentSession = async (params) => {
  try {
    // Call your payment provider's API to create the session (BudPay in this case)
    const response = await fetch("https://api.budpay.com/api/v2/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BUDPAY_API_KEY}`
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        customer_email: params.customer.email,
        return_url: params.cancelUrl,
        // Additional required fields for BudPay...
      }),
    });

    const data = await response.json();
    return data; // Return the created session
  } catch (error) {
    console.error("Error creating payment session:", error);
    return null;
  }
};

