import BaseRepository from "./base.repository";

export interface IFacebookTokenResponse {
  accessToken: string;
  userAccessToken?: string;
  pageId: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
}

class FacebookRepository extends BaseRepository {
  static async getToken(): Promise<IFacebookTokenResponse> {
    return this.request("/admins/facebook-token", "get");
  }

  static async updateToken(data: {
    accessToken: string;
    userAccessToken?: string;
    pageId?: string;
    expiresAt?: string;
  }): Promise<{ message: string; token: IFacebookTokenResponse }> {
    return this.request("/admins/facebook-token", "post", data);
  }

  static async disconnect(): Promise<{ message: string }> {
    return this.request("/admins/facebook-token", "delete");
  }

  static async getAuthUrl(): Promise<{ url: string }> {
    return this.request("/admins/facebook/auth-url", "get");
  }

  static async getManagedPages(): Promise<IFacebookPage[]> {
    return this.request("/admins/facebook/pages", "get");
  }
}

export default FacebookRepository;
