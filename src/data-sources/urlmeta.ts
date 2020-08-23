import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

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

const REQUEST_CACHE_TTL: number = parseInt(
  process.env.REQUEST_CACHE_TTL ?? (5 * 60).toString()
);

export class URLMetaAPI extends RESTDataSource {
  baseURL = process.env.URLMETA_API_BASE_URL;
  emailAddress = process.env.URLMETA_EMAIL_ADDRESS;
  apiKey = process.env.URLMETA_API_KEY;

  willSendRequest(request: RequestOptions) {
    const basicAuthBase64 = Buffer.from(
      `${this.emailAddress}:${this.apiKey}`
    ).toString("base64");

    request.cacheOptions = {
      ttl: REQUEST_CACHE_TTL,
    };
    request.headers.set("Authorization", `Basic ${basicAuthBase64}`);
  }

  async getMetaFromURL(url: string): Promise<URLMeta> {
    const data = await this.get("", {
      url,
    });

    return data.meta;
  }
}