import { TPaymentResponseDto } from "../../common/types";
import BaseRepository from "./base.repository";

class PaymentRepository extends BaseRepository {
  static apiRoute = "/payments";

  constructor() {
    super();
  }

  static async getMyPayments() {
    const url = `${this.apiRoute}/me`;
    return this.request<undefined, TPaymentResponseDto[]>(url, "get");
  }
}

export default PaymentRepository;
