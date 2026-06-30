module.exports = {
	/**
	 * Application declaration section
	 * https://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: 'islamic-gpt-frontend',
			script: "node_modules/next/dist/bin/next",
			args: "start",
			instances: 1,
			exec_mode: 'cluster',
			watch: false,
			// allocate 1024MB memory for each instance
			node_args: ['--max-old-space-size=1024'],
			max_memory_restart: '1G',
			out_file: './logs/islamic-gpt-frontend-out.log',
			error_file: './logs/islamic-gpt-frontend-error.log',
			env_develop: {
				'NODE_ENV': 'production',
				'PORT': 49311
			},
			env_production: {
				'NODE_ENV': 'production',
				'PORT': 59311,
				'PRODUCTION': true
			}
		}
	],

	/**
 * Deployment section
 * https://pm2.keymetrics.io/docs/usage/deployment/
 */
	deploy: {
		develop: {
			user: 'islamic-gpt-frontend-dev',
			host: 'axentec-ecs-prod-1.asf.sh',
			port: '5468',
			ssh_options: 'StrictHostKeyChecking=no',
			ref: 'origin/develop',
			repo: 'git@gitlab.com:as-sunnah-foundation/islamic-gpt/islamic-gpt-frontend.git',
			path: '/home2/islamic-gpt-frontend-dev/deploy/islamic-gpt-frontend/pm2',
			'pre-deploy': 'git fetch --all',
			'post-deploy':
				// eslint-disable-next-line max-len
				'export PATH="$HOME/.local/share/fnm:$HOME/.local/bin:$PATH" && eval "$(fnm env --use-on-cd --shell bash)" && cp -rf /home2/islamic-gpt-frontend-dev/deploy/islamic-gpt-frontend/secrets/.env . && npm ci && npm run build && pm2 startOrReload ecosystem.config.js --env develop'
		},
		production: {
			user: 'islamic-gpt-frontend-prod',
			host: 'axentec-ecs-prod-1.asf.sh',
			port: '5468',
			ssh_options: 'StrictHostKeyChecking=no',
			ref: 'origin/main',
			repo: 'git@gitlab.com:as-sunnah-foundation/islamic-gpt/islamic-gpt-frontend.git',
			path: '/home1/islamic-gpt-frontend-prod/deploy/islamic-gpt-frontend/pm2',
			'pre-deploy': 'git fetch --all',
			'post-deploy':
				// eslint-disable-next-line max-len
				'export PATH="$HOME/.local/share/fnm:$HOME/.local/bin:$PATH" && eval "$(fnm env --use-on-cd --shell bash)" && cp -rf /home1/islamic-gpt-frontend-prod/deploy/islamic-gpt-frontend/secrets/.env . && npm ci && npm run build && pm2 startOrReload ecosystem.config.js --env production'
		}
	}
};
