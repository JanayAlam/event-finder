import axios from "axios";
import {
  SSL_COMMERZ_PASSWORD,
  SSL_COMMERZ_STORE_ID
} from "../../settings/config";

const BASE_URL = "https://sandbox.sslcommerz.com";

const INITIATE_URL = `${BASE_URL}/gwprocess/v4/api.php`;
const VALIDATE_URL = `${BASE_URL}/validator/api/validationserverphp.php`;

export type TSSLCommerzInitiateData = {
  total_amount: number;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  product_name: string;
  product_category: string;
};

export const initiatePayment = async (data: TSSLCommerzInitiateData) => {
  const formData = new URLSearchParams();
  formData.append("store_id", SSL_COMMERZ_STORE_ID!);
  formData.append("store_passwd", SSL_COMMERZ_PASSWORD!);
  formData.append("total_amount", data.total_amount.toString());
  formData.append("currency", "BDT");
  formData.append("tran_id", data.tran_id);
  formData.append("success_url", data.success_url);
  formData.append("fail_url", data.fail_url);
  formData.append("cancel_url", data.cancel_url);
  formData.append("cus_name", data.cus_name);
  formData.append("cus_email", data.cus_email);
  formData.append("cus_add1", "N/A");
  formData.append("cus_city", "Dhaka");
  formData.append("cus_postcode", "1212");
  formData.append("cus_country", "Bangladesh");
  formData.append("cus_phone", data.cus_phone || "01700000000");
  formData.append("shipping_method", "NO");
  formData.append("product_name", data.product_name);
  formData.append("product_category", data.product_category);
  formData.append("product_profile", "general");

  const response = await axios.post(INITIATE_URL, formData);
  return response.data;
};

export const validatePayment = async (val_id: string) => {
  const response = await axios.get(VALIDATE_URL, {
    params: {
      val_id,
      store_id: SSL_COMMERZ_STORE_ID,
      store_passwd: SSL_COMMERZ_PASSWORD,
      format: "json"
    }
  });
  return response.data;
};
