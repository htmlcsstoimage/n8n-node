import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const vendorPath = path.join(root, 'vendor/html-css-to-image-client');
const hiddenPath = path.join(path.dirname(root), `.hcti-client-lint-${process.pid}`);
const args = ['lint', ...process.argv.slice(2)];

let moved = false;
try {
	if (fs.existsSync(vendorPath)) {
		fs.renameSync(vendorPath, hiddenPath);
		moved = true;
	}

	const command = path.join(root, 'node_modules/.bin/n8n-node');
	const result = spawnSync(command, args, {
		cwd: root,
		stdio: 'inherit',
		env: process.env,
	});
	process.exitCode = result.status ?? 1;
} finally {
	if (moved) {
		fs.renameSync(hiddenPath, vendorPath);
	}
}
