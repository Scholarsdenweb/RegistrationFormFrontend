import axios from "../api/axios";
import { useEffect } from "react";

const CreateInvoice = () => {
  const createInvoiceFunction = async () => {
    const response = await axios.post("/payment/create-invoice", {
      name: "John Doe",
      contact: "9719706242", // User's phone
      email: "john@example.com",
      amount: 500,
    });

    console.log("response from createInvoiceFunction",response.data); // Contains the invoice link, etc.
  };

  useEffect(() => {
    createInvoiceFunction();
  }, []);

  return <div>CreateInvoice</div>;
};

export default CreateInvoice;
