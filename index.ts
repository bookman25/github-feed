import './tsHelpers';
import * as jsonfile from 'jsonfile';
import { usage } from 'yargs';
import email from './email/email';
import query from './query/query';

const { argv: { r: to, t: token, config } } = usage('Usage: $0 -r [email]')
	.option('r', {
		alias: 'recipient',
		describe: 'Recipient email adress',
		demand: true,
		type: 'string',
		requiresArg: true
	})
	.option('t', {
		alias: 'github-token',
		describe: 'private github token used to increase rate-limit for github apis',
		type: 'string'
	})
	.coerce('config', path => jsonfile.readFileSync(path))
	.default('config', './config.json')
	.help('h')
	.alias('h', 'help')
	.example('$0 info@email.com', 'Send email for repositories')
	.example('$0 -r info@email.com -t privateToken', '');

query({
	token,
	repositories: config.repositories
}).then(repositories => email({ smtpSettings: config.smtp, to, repositories }))
	.catch(console.error);