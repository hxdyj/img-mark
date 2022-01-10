// Invoked on the commit-msg git hook by yorkie.

import { readFileSync } from 'fs'
const msgPath = process.argv.slice(2)[0]
const msg = readFileSync(msgPath, 'utf-8').trim()
const releaseRE = /^v\d/
const commitRE = /^(revert: )?(feat|fix|docs|dx|refactor|perf|test|workflow|build|ci|chore|types|wip|release|deps)(\(.+\))?: .{1,50}/

async function check() {
	const { default: chalk } = await import('chalk')
	if (!releaseRE.test(msg) && !commitRE.test(msg)) {
		console.log()
		console.error(
			`  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
			chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
			`    ${chalk.green(`feat: add 'comments' option`)}\n` +
			`    ${chalk.green(`fix: handle events on blur (close #28)`)}\n\n` +
			chalk.red(`  See README.md #Git Commit Message Convention for more details.\n`)
		)
		process.exit(1)
	}
}
check()
