#!/usr/bin/env node
import { Command } from 'commander';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';

const program = new Command();
const DEFAULT_API = 'http://localhost:3000';

function getApiAddress(cmdApi?: string) {
  return cmdApi || process.env.API_ADDRESS || DEFAULT_API;
}

program
  .name('ragged-cli')
  .description('CLI for interacting with a RAG API')
  .version('0.1.0');

program
  .command('ingest')
  .description('Ingest files and/or URLs')
  .option('--files <files>', 'Comma-separated list of file paths')
  .option('--urls <urls>', 'Comma-separated list of URLs')
  .option('--api <address>', 'API address')
  .action(async (opts: { files?: string; urls?: string; api?: string }) => {
    const api = getApiAddress(opts.api);
    const files = opts.files ? opts.files.split(',').map((f: string) => f.trim()) : [];
    const urls = opts.urls ? opts.urls.split(',').map((u: string) => u.trim()) : [];
    const form = new FormData();
    for (const file of files) {
      if (fs.existsSync(file)) {
        form.append('files', fs.createReadStream(path.resolve(file)));
      } else {
        console.error(`File not found: ${file}`);
        process.exit(1);
      }
    }
    form.append('urls', JSON.stringify(urls));
    try {
      const res = await axios.post(`${api}/api/ingest/files`, form, {
        headers: form.getHeaders(),
      });
      console.log(res.data);
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      process.exit(1);
    }
  });

program
  .command('query <query>')
  .description('Query the API')
  .option('--topK <topK>', 'Number of top results', parseInt)
  .option('--generate', 'Generate results', false)
  .option('--api <address>', 'API address')
  .action(async (query, opts: { topK?: number; generate?: boolean; api?: string }) => {
    const api = getApiAddress(opts.api);
    const payload: any = { query: query };
    if (opts.topK) payload.topK = opts.topK;
    if (opts.generate) payload.generate = true;
    try {
      const res = await axios.post(`${api}/api/query`, payload);
      console.log(res.data);
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      process.exit(1);
    }
  });

program
  .command('clear')
  .description('Clear the vectorstore (requires double confirmation)')
  .option('--api <address>', 'API address')
  .action(async (opts: { api?: string }) => {
    const readline = await import('readline');
    function ask(question: string): Promise<string> {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
    }
    const first = (await ask('Are you sure you want to clear the vectorstore? (yes/no): ')).toLowerCase();
    if (first !== 'yes') {
      console.log('Aborted.');
      process.exit(0);
    }
    const second = (await ask('This action is irreversible. Confirm again (yes/no): ')).toLowerCase();
    if (second !== 'yes') {
      console.log('Aborted.');
      process.exit(0);
    }
    const api = getApiAddress(opts.api);
    try {
      const res = await axios.post(`${api}/api/vectorstore/clear`);
      console.log('Vectorstore cleared:', res.data);
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
