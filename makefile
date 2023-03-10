install: install-deps

install-deps:
	npm ci

build:
	npm run build

serve:
	npm run serve

run:
	make build
	make serve

lint:
	npx eslint .

publish:
	npm publish --dry-run
