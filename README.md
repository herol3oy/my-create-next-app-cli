# My customize create-next-app CLI

The CLI creates the latest version of the Next.js app with my favorite configurations that I consistently apply to all my Next.js projects and save 20-30 mins of my time.

- Install `prettier` and add my prettier rules
- Install `prettier-plugin-tailwindcss` and add the plugin to the `.prettier` config file
- Install `eslint-plugin-simple-import-sort` and add the ESLint rules to the `.eslintrc.json`
- Install `husky` and `lint-staged` to automatically apply Prettier and ESLint formatting when committing files

## Install

```bash
cd my-create-next-app-cli && npm install 
```

## Run the cli

```bash
npm link && my-next-js-app projectName
```
