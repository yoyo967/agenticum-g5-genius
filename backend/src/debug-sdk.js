const DiscoveryEngine = require('@google-cloud/discoveryengine');
console.log('DiscoveryEngine Keys:', Object.keys(DiscoveryEngine));
if (DiscoveryEngine.v1) {
  console.log('v1 Keys:', Object.keys(DiscoveryEngine.v1));
} else {
  console.log('v1 is undefined');
}
