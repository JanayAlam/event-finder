import { TVerificationStatusResponse } from "../../common/types";
import { TAccountVerificationRequestDto } from "../../common/validation-schemas";
import { TAccountVerification } from "../../server/models/account-verification.model";
import BaseRepository from "./base.repository";

class AccountVerificationRepository extends BaseRepository {
  static apiRoute = "/account-verifications";

  constructor() {
    super();
  }

  static async status(): Promise<TVerificationStatusResponse> {
    const url = `${this.apiRoute}/status`;
    return this.request<undefined, TVerificationStatusResponse>(url, "get");
  }

  static async initiate(
    requestBody: TAccountVerificationRequestDto
  ): Promise<TAccountVerification> {
    const formData = this.convertToFormData(requestBody);

    const data = await this.request<FormData, TAccountVerification>(
      this.apiRoute,
      "put",
      formData
    );
    return data;
  }
}

export default AccountVerificationRepository;
