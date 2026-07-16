import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const lintRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hcti-n8n-lint-'));
const args = ['lint', ...process.argv.slice(2)];
const fix = process.argv.includes('--fix');
const lintFiles = ['eslint.config.mjs', 'package.json', 'tsconfig.json'];
const lintDirectories = ['credentials', 'nodes'];

try {
	for (const file of lintFiles) {
		fs.copyFileSync(path.join(root, file), path.join(lintRoot, file));
	}

	for (const directory of lintDirectories) {
		fs.cpSync(path.join(root, directory), path.join(lintRoot, directory), {
			recursive: true,
		});
	}

	fs.symlinkSync(path.join(root, 'node_modules'), path.join(lintRoot, 'node_modules'), 'dir');

	const command = path.join(root, 'node_modules/.bin/n8n-node');
	const result = spawnSync(command, args, {
		cwd: lintRoot,
		stdio: 'inherit',
		env: process.env,
	});

	if (fix && result.status === 0) {
		fs.copyFileSync(path.join(lintRoot, 'package.json'), path.join(root, 'package.json'));
		for (const directory of lintDirectories) {
			fs.cpSync(path.join(lintRoot, directory), path.join(root, directory), {
				recursive: true,
			});
		}
	}

	process.exitCode = result.status ?? 1;
} finally {
	fs.rmSync(lintRoot, { recursive: true, force: true });
}
