import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { REQUEST_CACHE_TTL } from "../config/from-env";

export type URLMeta = {
  site: {
    theme_color?: string;
    logo?: string;
    facebook?: string;
    cms?: string;
    twitter?: string;
    name?: string;
    favicon?: string;
    manifest?: string;
    canonical?: string;
  };
  locale?: string;
  keywords?: string[];
  author?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  datePublished?: string;
  category?: string;
};

export class URLMetaAPI extends RESTDataSource {
  baseURL = process.env.URLMETA_API_BASE_URL;
  emailAddress = process.env.URLMETA_EMAIL_ADDRESS;
  apiKey = process.env.URLMETA_API_KEY;

  willSendRequest(request: RequestOptions) {
    const basicAuthBase64 = Buffer.from(
      `${this.emailAddress}:${this.apiKey}`
    ).toString("base64");

    request.headers.set("Authorization", `Basic ${basicAuthBase64}`);
    request.cacheOptions = {
      ttl: REQUEST_CACHE_TTL,
    };
  }

  async getMetaFromURL(url: string): Promise<URLMeta> {
    const data = await this.get("", {
      url,
    });

    return data.meta;
  }
}
