import { OpenIDConnectSettings } from '@cnj/uikit';

export interface AppConfig {
  name: string;
  production: boolean;
  api: {
    url: string;
  };
  authentication: OpenIDConnectSettings;
}
