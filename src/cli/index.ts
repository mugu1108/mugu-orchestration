#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('mugu-orch')
  .description('Mugu Orchestration System CLI')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Supabase project and run migrations')
  .action(async () => {
    console.log(chalk.blue.bold('\n🚀 Initializing Supabase...\n'));
    console.log(chalk.yellow('Run the following commands to set up Supabase:'));
    console.log(chalk.cyan('\n  npx supabase init'));
    console.log(chalk.cyan('  npx supabase start\n'));
    console.log(chalk.green('Then copy the schema from src/lib/supabase/schema.sql'));
    console.log(chalk.green('and run it in the Supabase dashboard or via SQL Editor.\n'));
  });

program
  .command('list')
  .description('List all skills')
  .action(async () => {
    console.log(chalk.blue.bold('\n📋 Available Skills\n'));
    console.log(chalk.yellow('Skill listing will be available after Supabase setup.'));
    console.log(chalk.cyan('Run: mugu-orch init\n'));
  });

program.parse();
