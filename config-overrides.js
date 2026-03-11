module.exports = function override(config, env) {
  // Fix papaparse build issue by using mainFields to prefer main over browser
  // This avoids the minified version which causes stack overflow
  if (!config.resolve) {
    config.resolve = {};
  }
  
  config.resolve.mainFields = ['module', 'main'];
  
  return config;
};
