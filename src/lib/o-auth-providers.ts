import { IconBrandGithub, IconBrandGoogle, type Icon as TablerIcon } from "@tabler/icons-react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

type OAuthProviderDetails = {
  name: string;
  Icon: TablerIcon; 
};

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  OAuthProviderDetails
> = {
  google: { name: "Google", Icon: IconBrandGoogle },
  github: { name: "GitHub", Icon: IconBrandGithub },
};
