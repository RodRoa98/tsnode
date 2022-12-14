export interface IDefault {
  service: {
    name: string;
    port: number;
    databases: {
      main: {
        dialect: string;
        host: string;
        port: number;
        dbName: string;
        user: string;
        password: string;
      };
    };
    jwt: {};
    mail: {
      host: string;
      name: string;
      user: string;
      pass: string;
      cc: string[];
      port: number;
      replyToMail: string;
      replyToName: string;
    };
  };
  metadata: {
    enviroment: string;
    cookie: {
      domain: '';
      sameSite: string;
      httpOnly: string;
    };
  };
}

export interface IConfig {
  default: IDefault;
}
