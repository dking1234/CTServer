module.exports = {
    apps: [
      {
        name: 'CTServer',
        script: 'index.js', // Change to your main application file
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'preview',
          PORT: 5000, // Set HTTPS port
          // Add other environment variables if needed
        },
      },
    ],
  };
  