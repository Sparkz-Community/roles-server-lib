const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');

const $lomitBy = require('lodash.omitby');
const $lisNil = require('lodash.isnil');

const { utils } = require('@iy4u/common-server-lib');
const logger = utils.logger;
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

module.exports = function (app) {
  mongoose.set('debug', process.env.NODE_ENV === 'production' ? false : true);

  const mongoConfig = app.get('mongo');
  let uri = '';
  let options = {
    poolSize: 5,	// optional - The maximum size of the individual server pool
    sslValidate: false, // optional - Validate mongod server certificate against Certificate Authority
    tls: false, //	optional - Enable TLS connections
    tlsInsecure: false, //	optional - Relax TLS constraints, disabling validation
    tlsCAFile: undefined, //	optional (string) - A path to file with either a single or bundle of certificate authorities to be considered trusted when making a TLS connection
    tlsCertificateKeyFile: undefined, // optional (string) - A path to the client certificate file or the client private key file; in the case that they both are needed, the files should be concatenated
    tlsCertificateKeyFilePassword: undefined, // optional (string) - The password to decrypt the client private key to be used for TLS connections
    tlsAllowInvalidCertificates: undefined, // optional (boolean) - Specifies whether or not the driver should error when the server’s TLS certificate is invalid
    tlsAllowInvalidHostnames: undefined, // optional (boolean) - Specifies whether or not the driver should error when there is a mismatch between the server’s hostname and the hostname specified by the TLS certificate
    autoReconnect: undefined, // optional (boolean) - Enable autoReconnect for single server instances
    noDelay: true,	// optional - TCP Connection no delay
    keepAlive: true, //	optional - TCP Connection keep alive enabled
    keepAliveInitialDelay: 120000,	// optional - The number of milliseconds to wait before initiating keepAlive on the TCP socket
    connectTimeoutMS: 10000, //	optional - How long to wait for a connection to be established before timing out
    socketTimeoutMS: 0, //	optional - How long a send or receive on a socket can take before timing out
    family: null, // optional (number) - Version of IP stack. Can be 4, 6 or null (default). If null, will attempt to connect with IPv6, and will fall back to IPv4 on failure
    reconnectTries: undefined, // optional (number) - Server attempt to reconnect #times
    reconnectInterval: undefined, // optional (number) - Server will wait # milliseconds between retries
    ha: true, // optional - Control if high availability monitoring runs for Replicaset or Mongos proxies
    haInterval: 10000, // optional - The High availability period for replicaset inquiry
    replicaSet: undefined, // optional (string) - The Replicaset set name
    secondaryAcceptableLatencyMS: 15, // optional - Cutoff latency point in MS for Replicaset member selection
    acceptableLatencyMS: 15, // optional - Cutoff latency point in MS for Mongos proxies selection
    connectWithNoPrimary: false, // optional - Sets if the driver should connect even if no primary is available
    authSource: undefined, // optional - Define the database to authenticate against
    writeConcern: undefined, // optional (object | WriteConcern) - Specify write concern settings.
    forceServerObjectId: false, // optional - Force server to assign _id values instead of driver
    serializeFunctions: false, // optional - Serialize functions on any object
    ignoreUndefined: false, // optional - Specify if the BSON serializer should ignore undefined fields
    raw: false, // optional - Return document results as raw BSON buffers
    bufferMaxEntries: undefined, // optional (number) - Sets a cap on how many operations the driver will buffer up before giving up on getting a working connection, default is -1 which is unlimited
    readPreference: undefined, // optional (ReadPreference | string) - The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY, ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST)
    pkFactory: undefined, // optional (object) - A primary key factory object for generation of custom _id keys
    promiseLibrary: undefined, // optional (object) - A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible
    readConcern: undefined, // optional (object) - Specify a read concern for the collection (only MongoDB 3.2 or higher supported)
    maxStalenessSeconds: undefined, // optional (number) - The max staleness to secondary reads (values under 10 seconds cannot be guaranteed)
    loggerLevel: undefined, // optional (string) - The logging level (error/warn/info/debug)
    logger: undefined, // optional (object) - Custom logger object
    promoteValues: true, // optional - Promotes BSON values to native types where possible, set to false to only receive wrapper types
    promoteBuffers: false, // optional - Promotes Binary BSON values to native Node Buffers
    promoteLongs: true, // optional - Promotes long values to number if they fit inside the 53 bits resolution
    domainsEnabled: false, // optional - Enable the wrapping of the callback in the current domain, disabled by default to avoid perf hit
    validateOptions: false, // optional - Validate MongoClient passed in options for correctness
    appname: undefined, // optional (string) - The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections
    auth: {
      user: undefined, // optional (string) - The username for auth
      password: undefined, // optional (string) - The password for auth
    },
    authMechanism: undefined, // optional (string) - An authentication mechanism to use for connection authentication, see the authMechanism reference for supported options.
    compression: undefined, // optional (object) - Type of compression to use: snappy or zlib
    readPreferenceTags: undefined, // optional (array) - Read preference tags
    numberOfRetries: 5, // optional - The number of retries for a tailable cursor
    auto_reconnect: true, // optional - Enable auto reconnecting for single server instances
    monitorCommands: false, // optional - Enable command monitoring for this client
    minSize: undefined, // optional (number) - If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections
    useNewUrlParser: true, // optional - Determines whether or not to use the new url parser. Enables the new, spec-compliant, url parser shipped in the core driver. This url parser fixes a number of problems with the original parser, and aims to outright replace that parser in the near future. Defaults to true, and must be explicitly set to false to use the legacy url parser.
    useUnifiedTopology: undefined, // optional (boolean) - Enables the new unified topology layer
    // localThresholdMS: 15, // optional - Only applies to the unified topology The size of the latency window for selecting among multiple suitable servers
    serverSelectionTimeoutMS: 30000, // optional - Only applies to the unified topology How long to block for server selection before throwing an error
    heartbeatFrequencyMS: 10000, // optional - Only applies to the unified topology The frequency with which topology updates are scheduled
    maxPoolSize: 10, // optional - Only applies to the unified topology The maximum number of connections that may be associated with a pool at a given time. This includes in use and available connections.
    minPoolSize: 0, // optional - Only applies to the unified topology The minimum number of connections that MUST exist at any moment in a single connection pool.
    maxIdleTimeMS: undefined, // optional (number) - Only applies to the unified topology The maximum amount of time a connection should remain idle in the connection pool before being marked idle. The default is infinity.
    waitQueueTimeoutMS: 0, // optional - Only applies to the unified topology The maximum amount of time operation execution should wait for a connection to become available. The default is 0 which means there is no limit.
    autoEncryption: undefined, // optional (AutoEncrypter~AutoEncryptionOptions) - Optionally enable client side auto encryption
    driverInfo: undefined, // optional (DriverInfoOptions) - Allows a wrapping driver to amend the client metadata generated by the driver to include information about the wrapping driver
    directConnection: false, // optional - Enable directConnection
  };

  if (mongoConfig.useUnifiedTopology) {
    console.log('Here!');
    options.autoReconnect = true; // DeprecationWarning: The option `autoReconnect` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
    options.reconnectTries = 30; // DeprecationWarning: The option `reconnectTries` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
    options.reconnectInterval = 1000; // DeprecationWarning: The option `reconnectInterval` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
    options.bufferMaxEntries = -1; // DeprecationWarning: The option `bufferMaxEntries` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
  }


  if (mongoConfig.uri.length > 0) {
    uri = mongoConfig.uri;
  }


  options.loggerLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  options.logger = function(collectionName, methodName, ...methodArgs) {
    logger[process.env.NODE_ENV === 'production' ? 'info' : 'debug'](`${collectionName}.${methodName}(${methodArgs.join(', ')})`);
  };
  options = $lomitBy({...options, ...mongoConfig.options}, $lisNil);

  if(mongoConfig.tunnelMongo) {
    tunnel(mongoConfig.tunnel, (error) => {
      if (error) {
        logger.error('SSH tunnel connection for MongoDB via SSH host - ' + mongoConfig.tunnel.host + error);
        process.exit(1);
      } else {
        logger.info('SSH tunnel ready for MongoDB via SSH host - ' + mongoConfig.tunnel.host);
      }
    });
  }
  logger.debug('mongo uri - ' + uri);
  try {
    mongoose.connect(uri, options, () => {
      logger.info('Successfully connected to mongoDB :)');
    });
  } catch (error) {
    logger.error('ERROR: could not connect to mongoDB :( - ' + error);
  }

  app.set('mongooseClient', mongoose);
};

