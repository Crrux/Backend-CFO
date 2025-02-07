module.exports = {
    apps: [{
        name: 'BackEnd',
        script: 'npm',
        args: 'run start:prod',
        env: {
            NODE_ENV: 'production',
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log'
    }]
}