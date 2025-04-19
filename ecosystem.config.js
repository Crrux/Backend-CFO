module.exports = {
    apps: [
        {
            name: 'backend-cfo',
            script: 'npm',
            args: 'run start:prod',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
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
