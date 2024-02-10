import { spawn } from "child_process";
import fs from "fs/promises";
import { prettierConfig } from "../constance/prettier-config.js";
import { esLintConfig } from "../constance/es-lint-config.js";

export const createNextApp = async (projectName) => {
  try {
    const createNextJSAppCommand = `
    npx create-next-app@latest ${projectName} \
      --ts \
      --tailwind \
      --eslint \
      --app \
      --import-alias \
      --use-npm
  `;
    const createProcess = spawn("sh", ["-c", createNextJSAppCommand], {
      stdio: "inherit",
    });

    await new Promise((resolve, reject) => {
      createProcess.on("close", (createCode) => {
        if (createCode === 0) {
          console.log("Next.js project created successfully!");
          resolve();
        } else {
          reject(`Error: Project creation failed with code ${createCode}`);
        }
      });
    });

    console.log(`Installing prettier in ${projectName}...`);
    const installDependenciesCommand = `
    cd ${projectName} &&
    npm install -D prettier prettier-plugin-tailwindcss eslint-plugin-simple-import-sort husky lint-staged &&
    npx husky init
  `;
    const installDependenciesProcess = spawn(
      "sh",
      ["-c", installDependenciesCommand],
      {
        stdio: "inherit",
      },
    );

    await new Promise((resolve, reject) => {
      installDependenciesProcess.on("close", (installDependenciesCode) => {
        if (installDependenciesCode === 0) {
          console.log("Dependencies installed successfully!");
          resolve();
        } else {
          reject(
            `Error: Dependencies installation failed with code ${installDependenciesCode}`,
          );
        }
      });
    });

    const projectPath = `${projectName}/`;

    await fs.writeFile(`${projectPath}prettier.config.cjs`, prettierConfig);
    await fs.writeFile(`${projectPath}.eslintrc.json`, esLintConfig);
    await fs.writeFile(`${projectPath}.husky/pre-commit`,'npx lint-staged\n')

    console.log("Prettier and ESLint configurations created successfully!");

    const packageJsonPath = `${projectPath}package.json`;
    const packageJsonContents = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContents);

    packageJson["lint-staged"] = {
      "**/*.{ts,tsx}": "eslint --fix",
      "**/*": "prettier --write --ignore-unknown",
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    const gitIgnoreContent = await fs.readFile(
      `${projectPath}.gitignore`,
      "utf-8",
    );
    await fs.writeFile(`${projectPath}.prettierignore`, gitIgnoreContent);

    console.log("Running ESLint and Prettier...");
    const runPrettierEslintCommand = `cd ${projectPath} && npx eslint --fix ./ && npx prettier . --write`;
    const runPrettierEslintProcess = spawn(
      "sh",
      ["-c", runPrettierEslintCommand],
      { stdio: "inherit" },
    );

    await new Promise((resolve, reject) => {
      runPrettierEslintProcess.on("close", (runPrettierEslintCode) => {
        if (runPrettierEslintCode === 0) {
          console.log("ESLint and Prettier command executed successfully!");
          resolve();
        } else {
          reject(
            `Error: ESLint and Prettier command failed with code ${runPrettierEslintCode}`,
          );
        }
      });
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
