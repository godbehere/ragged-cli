# rag-cli

A TypeScript CLI for interacting with a configurable API.

## Features
- Ingest files and URLs via `/api/ingest/files`
- Query the API via `/api/query`
- Configurable API address (default: http://localhost:3000)

## Usage

```
npm install
npm run build
node dist/index.js [command]
```

### Commands

- `ingest --files <file1,file2,...> --urls <url1,url2,...>`
- `query --query <string> [--topK <int>] [--generate]`

## Configuration

Set the API address using the `--api` flag or environment variable `API_ADDRESS`.
