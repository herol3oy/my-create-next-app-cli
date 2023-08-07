#!/usr/bin/env node

import { program } from "commander";
import { createNextApp } from './src/utils/create-next-app.js'

program
  .description("Create a customized Next.js project")
  .arguments("<projectName>")
  .action(createNextApp);

program.parse(process.argv);
