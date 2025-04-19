module.exports = {
    apps: [
        {
            name: 'crossfit-obernai-api',
            script: 'dist/main.js',
            instances: 1,
            instance_var: "BACKEND_INSTANCE",
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 3001
            }
        }
    ]
};
