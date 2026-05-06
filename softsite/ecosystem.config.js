module.exports = {
  apps: [{
    name: 'soft-hub',
    script: 'server.js',
    env: {
      PORT: 3000,
      ADMIN_TOKEN: '******'
    }
  }]
}

