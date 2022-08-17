const {paramCase} = require('change-case');
let appName = require(__dirname + '/../package.json').name;
if (appName === 'server') appName = paramCase(require(__dirname + '/../package.json').description);
const {lodash:{lget}} = require('@iy4u/common-server-lib').packages;

const serverHost = lget(process.env, 'HOST') || 'localhost';
const serverPort = lget(process.env, 'PORT') || 3030;
const serverUrl = lget(process.env, 'SERVER_URL') || 'http://' + serverHost + ':' + serverPort;
const clientUrl = lget(process.env, 'CLIENT_URL') || 'http://localhost:8080';

const STORAGE_TYPES = {
  's3': 's3',
  'local-private': 'local-private',
  'local-public': 'local-public',
  'google-cloud': 'google-cloud',
  'others': 'others'
};

const MONGO_SSH_PRIVATE_KEY = lget(process.env, 'SSH_PRIVATE_KEY') ? require('fs').readFileSync(lget(process.env, 'SSH_PRIVATE_KEY')) : undefined;
// const REDIS_SSH_PRIVATE_KEY = lget(process.env, 'REDIS_SSH_PRIVATE_KEY') || lget(process.env, 'SSH_PRIVATE_KEY') ? require('fs').readFileSync(lget(process.env, 'REDIS_SSH_PRIVATE_KEY') || lget(process.env, 'SSH_PRIVATE_KEY')) : undefined;

module.exports = {
  host: serverHost,
  port: serverPort,
  serverUrl: serverUrl,
  clientUrl: clientUrl,
  clientLoginUrl: clientUrl + (lget(process.env, 'CLIENT_LOGIN_PATH') || '/login'),
  public: '../public/',
  paginate: {
    default: 500,
    max: 1000
  },
  logger: {
    blacklist: [],
    searchIn: [],
  },
  apminsight: {
    licenseKey: lget(process.env, 'APMINSIGHT_LICENSEKEY'),
    appName: lget(process.env, 'APMINSIGHT_APPNAME', appName),
    port: lget(process.env, 'APMINSIGHT_PORT', serverPort),
    // proxyServerHost: lget(process.env, 'APMINSIGHT_PROXYSERVERHOST', serverHost),
    // proxyServerPort: lget(process.env, 'APMINSIGHT_PROXYSERVERPORT', 443),
    // proxyAuthUser: lget(process.env, 'APMINSIGHT_PROXYAUTHUSER'),
    // proxyAuthPassword: lget(process.env, 'APMINSIGHT_PROXYAUTHPASSWORD')
  },
  s3: {
    bucket: lget(process.env, 'AWS_BUCKET_NAME'),
    accessKeyId: lget(process.env, 'AWS_ACCESS_KEY'),
    secretAccessKey: lget(process.env, 'AWS_SECRET_ACCESS_KEY'),
    signedUrlExpires: 900
  },
  applicationRegistry: {
    name: lget(process.env, 'APP_NAME') || appName,
    secret: lget(process.env, 'APPLICATIONREG_SECRET', lget(process.env, 'APP_SECRET', '716b430a674beac1dc55330f5a5fcc656e92667adfa4cbd94c8825ca8bea3533a8bab27c24dd146ac70feea03202d770ebb8f375863fd55214a96c698c2f7765d0c7374fa9a49cea58dcedeca93ba9a7fc2fc15d1e1acd2a21999db08addc41e17bfb0395775440757c880b8bac0cbe9a3803042fd5e241c42b3fc1fcdec0739e314e499552418b8697915f4e6d8dd262d79be876db4e55dcec9af4be554dd7abd5ed7aca9fe3d76b7a02fb0484d3c4d912ff61ca6dbe5e1c553143b2019d743b57e0e0d653db40d21d3ac6a459880958bbf0ca1a6e8375300a291019cd48f6d6d45bdf9e17ecab401ecdfba94d09b9df202eb61920f9113f38276797a0283b2')),
    idm: {
      host: lget(process.env, 'SERVER_URL'),
    },
    jwtOptions: {
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_EXPIRESIN', '1d'),
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: lget(process.env, 'AUTHENTICATION_SECRET', lget(process.env, 'APP_SECRET', '716b430a674beac1dc55330f5a5fcc656e92667adfa4cbd94c8825ca8bea3533a8bab27c24dd146ac70feea03202d770ebb8f375863fd55214a96c698c2f7765d0c7374fa9a49cea58dcedeca93ba9a7fc2fc15d1e1acd2a21999db08addc41e17bfb0395775440757c880b8bac0cbe9a3803042fd5e241c42b3fc1fcdec0739e314e499552418b8697915f4e6d8dd262d79be876db4e55dcec9af4be554dd7abd5ed7aca9fe3d76b7a02fb0484d3c4d912ff61ca6dbe5e1c553143b2019d743b57e0e0d653db40d21d3ac6a459880958bbf0ca1a6e8375300a291019cd48f6d6d45bdf9e17ecab401ecdfba94d09b9df202eb61920f9113f38276797a0283b2')),
    authStrategies: [
      'jwt',
      'local',
      'api-key',
      'api-key-file-uploader'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_EXPIRESIN', '1d'),
    },
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    'api-key': {
      headerField: 'x-api-key', // Required
      entity: 'key', // Required - The name of the key field
      service: 'secret/keys', // Required - The name of the service to use.
      revokedField: 'revoked', // Optional - The name of the revoked field
      activeField: 'active', // Optional - The name of the active field
      authorizedField: 'authorized' // Optional - The name of the authorized field
    },
    'api-key-file-uploader': {
      headerField: 'x-api-key', // Required
      entity: 'api-key', // Required - The name of the key field
      service: 'll-host-keys', // Required - The name of the service to use.
      revokedField: 'revoked', // Optional - The name of the revoked field
      activeField: 'active', // Optional - The name of the active field
      authorizedField: 'authorized' // Optional - The name of the authorized field
    },
    enforceWhitelist: true,
    whitelistUserFields: [
      'email',
      'theme',
      'roles',
      '_fastjoin',
      'rules'
    ],
    blacklistUserFields: [],
  },
  appauth: {
    entity: 'application',
    service: 'applications',
    secret: lget(process.env, 'APPAUTH_SECRET', lget(process.env, 'APP_SECRET', '5087cc3e6d61591ed5715c5fbf0056a69b0090800d12992368ec267179c30b90748fac4c504aafff0638bb02fb3f78cf15ce31868ab217cd51237614a9ae6d99ea2593184b2cc509d403186b8bc3f440ecdb082ce6e62842105e4cf3e046ce2f16f854c4ac84b7b04b120dd362571bcee606c4bb9b76639111a72e18eb9316d454ba1d74c5c34cd22ce89d51d1e321681b6768f03ac525fb8dc9b89ed6ab4cf2a0e6a6a07b9ce07983c62b7c208fbcbe49ca6a1914547e765a89f08fbca28524ee3231eb1d5cb6ea57a3d56bb8401f3db34ac73e52417032d1449b4ce2e9684bacd365f8385341ab9fa3b58dadf02218c5f74142e52aeed9cc32feab35b520de')),
    authStrategies: [
      'applocal',
      'jwt'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_APPAUTH_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_APPAUTH_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_APPAUTH_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_APPAUTH_EXPIRESIN', '1d'),
    },
    applocal: {
      usernameField: 'name',
      passwordField: 'secret'
    }
  },
  userVault: {
    entity: 'vault',
    service: 'vaults',
    secret: lget(process.env, 'USERVAULT_SECRET', lget(process.env, 'APP_SECRET', 'bfdec02854a97b734f81a9278b05dc91bf596831855d3493ac9c3893b6a80020f8cabfd7b1cbb69ecf55f089cc1dcd5c3de12c5df7631d87b3c72c3672553262723ba4dbde8b114c56ed99cf35ffd8589955ec36544ede190fc3dbf46614764b9ea14b7459d4a066c687aa72e651e676360f7d38156807d91ad8c4dd60bb7821787725910eda7a580eb71e54eb83a4730c79f2838da00a0039fd98ec6f1c72b3d9112ce77d325d57bf555ef145728fafe821e05ab2dcfa2a11a6f04ac2066f86a08c3076b5884e77c2327c4db2f59805365ca0fd999dba0079b403ec8364928568972482980d05f485256eb15bc42b454f5865647887008d88a2e657163815b5')),
    authStrategies: [
      'vaultWithApp'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_USERVAULT_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_USERVAULT_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_USERVAULT_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_USERVAULT_EXPIRESIN', '1d'),
    },
    vaultWithApp: {
      masterUserField: 'user_id',
      usernameField: 'username',
      applicationField: 'app_id',
      passwordField: 'password'
    }
  },
  uploads: {
    privateFolder: '../private-files',
    services: {
      's3': true,
      'local-private': true,
      'local-public': true,
      'google-cloud': false
    },
    defaultFileService: 'local-public',
    blockDeleteDocumentWhenDeleteFileFailed: false,
    blockUpdateDocumentWhenReplaceFileFailed: false,
    enums: {
      STORAGE_TYPES,
      UPLOAD_SERVICES: {
        [STORAGE_TYPES['local-private']]: 'upload-local-private',
        [STORAGE_TYPES['local-public']]: 'upload-local-public',
        [STORAGE_TYPES.s3]: 'uploads-s3',
        [STORAGE_TYPES['google-cloud']]: 'uploads-google'
      },
      UPLOAD_PUBLIC_FILE_KEY: Symbol.for('public-file')
    }
  },
  sms: {
    default: 'twilio',
    from: lget(process.env, 'FROM_NUMBER'),
    verifyResetUrl: lget(process.env, 'SMS_URL') || clientUrl || serverUrl,
    identifyUserProps: ['_id', 'username', 'email', 'phone.number.e164'],
    shortTokenLen: lget(process.env, 'SMS_SHORTTOKEN_LENGTH') || 6,
    shortTokenDigits: lget(process.env, 'SMS_SHORTTOKEN_DIGITS') || true,
    twilio: {
      apiKey: lget(process.env, 'TWILIO_API_KEY'),
      domain: lget(process.env, 'TWILIO_DOMAIN'),
    },
  },
  mailer: {
    default: lget(process.env, 'MAILER_DEFAULT', 'mailgun'),
    from: lget(process.env, 'FROM_EMAIL', 'account-management@ionrev.com'),
    verifyResetUrl: lget(process.env, 'MAILER_URL') || clientUrl || serverUrl,
    helpEmail: lget(process.env, 'HELP_EMAIL') || 'account-management@ionrev.com',
    logo: lget(process.env, 'MAILER_LOGO') || 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/rayray/rayray_logo.png',
    mailgun: {
      host: lget(process.env, 'MAILGUN_HOST', 'smtp.mailgun.org'),
      port: lget(process.env, 'MAILGUN_PORT', 587),
      secure: false, // use SSL
      auth: {
        user: lget(process.env, 'MAILGUN_USER', 'postmaster@sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org'),
        pass: lget(process.env, 'MAILGUN_PASS', '3825009be5a3c8a1e3703b12c1401ab5-3939b93a-acc390be')
        // apikey: lget(process.env, 'MAILGUN_API_KEY', 'key-b16caad205345c8408746ff25c545b07'),
        // domain: lget(process.env, 'MAILGUN_DOMAIN', 'sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org')
      },
      tls: {
        ciphers: 'SSLv3'
      }
    },
    sendgrid: {
      host: lget(process.env, 'SENDGRID_HOST', 'smtp.sendgrid.net'),
      port: lget(process.env, 'SENDGRID_PORT', 587),
      secure: true,
      auth: {
        // apikey: lget(config, 'sendgrid.apiKey')
        apiUser: lget(process.env, 'SENDGRID_API_USER'),
        apiKey: lget(process.env, 'SENDGRID_API_KEY')
      }
    },
    ses: {
      host: lget(process.env, 'SES_HOST', 'email-smtp.us-west-2.amazonaws.com'),
      port: lget(process.env, 'SES_PORT', 587),
      secure: true,
      auth: {
        user: lget(process.env, 'SES_SMTP_USER'),
        pass: lget(process.env, 'SES_SMTP_PASS')
      }
    },
    sparkpost: {
      host: lget(process.env, 'SPARKPOST_HOST', 'smtp.sparkpostmail.com'),
      port: lget(process.env, 'SPARKPOST_PORT', 587),
      secure: false,
      ignoreTLS: false,
      auth: {
        user: lget(process.env, 'SPARKPOST_USER', 'SMTP_Injection'),
        pass: lget(process.env, 'SPARKPOST_API_KEY', 'Spark Key')
      }
    }
  },
  redis: {
    secret: lget(process.env, 'REDIS_PASSWORD'),
    host: lget(process.env, 'REDIS_HOST') || lget(process.env, 'REDIS_DB_HOST') || 'localhost',
    port: lget(process.env, 'REDIS_PORT') || lget(process.env, 'REDIS_DB_PORT') || 6379,
    password: lget(process.env, 'REDIS_PASSWORD') || 'my password',
    db: lget(process.env, 'REDIS_DB') || 1,
    sshTunnelConfig: {
      agent: lget(process.env, 'REDIS_SSH_AUTH_SOCK') || lget(process.env, 'SSH_AUTH_SOCK'),
      username: lget(process.env, 'REDIS_SSH_USERNAME') || lget(process.env, 'SSH_USERNAME'),
      privateKey: lget(process.env, 'REDIS_SSH_PRIVATE_KEY') || lget(process.env, 'SSH_PRIVATE_KEY'),
      passphrase: lget(process.env, 'REDIS_SSH_KEY_PASSPHRASE') || lget(process.env, 'SSH_KEY_PASSPHRASE'),
      host: lget(process.env, 'REDIS_SSH_HOST') || lget(process.env, 'SSH_HOST'),
      port: lget(process.env, 'REDIS_SSH_PORT') || lget(process.env, 'SSH_PORT'),
      dstHost: lget(process.env, 'REDIS_SSH_DST_HOST') || lget(process.env, 'SSH_DST_HOST'),
      dstPort: lget(process.env, 'REDIS_SSH_DST_PORT') || 6379,
      localHost: lget(process.env, 'REDIS_DB_HOST') || 'localhost',
      localPort: lget(process.env, 'REDIS_DB_PORT') || 6380,
    }
  },
  mongo: {
    uri: lget(process.env, 'MONGO_DB_URI', 'mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb'),
    options: {
      keepAlive: (lget(process.env, 'MONGO_DB_KEEPALIVE') === 'true'),
      keepAliveInitialDelay: lget(process.env, 'MONGO_DB_KEEPALIVE_DELAY', 200000),
      useUnifiedTopology: lget(process.env, 'MONGO_DB_USE_UNIFIED_TOPOLOGY', true),
      useNewUrlParser: lget(process.env, 'MONGO_DB_USE_NEW_URL_PARSER', true),
      useCreateIndex: lget(process.env, 'MONGO_DB_USE_CREATE_INDEX', true),
      replicaSet: lget(process.env, 'MONGO_DB_REPLICA_SET', 'atlas-b13tbl-shard-0'),
      // readPreference: lget(process.env, 'MONGO_DB_READ_PREFERENCE', 'secondaryPreferred'),
      readPreference: lget(process.env, 'MONGO_DB_READ_PREFERENCE', 'primary'),
      authSource: lget(process.env, 'MONGO_DB_AUTH_SOURCE', 'admin'),
      authMechanism: lget(process.env, 'MONGO_DB_AUTH_MECHANISM', 'SCRAM-SHA-1'),
      appname: lget(process.env, 'MONGO_DB_APPNAME', appName),
    },
    tunnelMongo: (lget(process.env, 'TUNNEL_MONGO') === 'true'),
    tunnel: {
      agent: lget(process.env, 'SSH_AUTH_SOCK'),
      username: lget(process.env, 'SSH_USERNAME'),
      privateKey: MONGO_SSH_PRIVATE_KEY,
      passphrase: lget(process.env, 'SSH_KEY_PASSPHRASE', undefined),
      host: lget(process.env, 'SSH_HOST'),
      port: lget(process.env, 'SSH_PORT', 22),
      dstHost: lget(process.env, 'SSH_DST_HOST'),
      dstPort: lget(process.env, 'SSH_DST_PORT', 27017),
      localHost: lget(process.env, 'MONGO_DB_HOST'),
      localPort: lget(process.env, 'MONGO_DB_PORT', 27017),
    },
  },
  Roles: {
    serviceWhiteList: [],
    serviceBlackList: [],
    rules: {
      keyPathName: 'keyPath'
    }
  }
};
