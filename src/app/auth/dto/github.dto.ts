export class GHAccessTokenRequest {
  client_id: string;
  client_secret: string;
  code: string;
}

export class GHAccessTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

export class GithubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  type: string;
  name: string;
  company?: any;
  email?: any;
  two_factor_authentication: boolean;
}
