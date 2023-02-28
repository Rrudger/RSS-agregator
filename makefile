install: install-deps

install-deps:
	npm ci

build:
	npm run build

serve:
	npm run serve

lint:
	npx eslint .

publish:
	npm publish --dry-run
