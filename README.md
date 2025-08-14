
# ragged-cli

This CLI is designed for use with the [rag-project](https://github.com/godbehere/rag-project).

You can run the API server using Docker:
	[Docker Hub: godbehere/rag-server](https://hub.docker.com/r/godbehere/rag-server)

Source code for the API server:
	[GitHub: godbehere/rag-project](https://github.com/godbehere/rag-project)


## Features
- Ingest files and URLs via `/api/ingest/files`
- Query the API via `/api/query`
- Configurable API address (default: http://localhost:3000)



### Install globally via npm

```
npm install -g ragged-cli
```

### Usage

After installing globally, use the `ragged-cli` command from anywhere:

```
ragged-cli [command] [options]
```

Or, for local development:

```
npm install
npm run build
node dist/index.js [command]
```


### Commands

- `ingest --files <file1,file2,...> --urls <url1,url2,...>`
	- Ingests documents and/or URLs using the `/api/ingest/files` endpoint of the rag-project API. Sources are chunked and embedded using an LLM, then upserted to the vector store.

- `query <string> [--topK <int>] [--generate]`
	- Queries the stored vectors. The `topK` option limits the number of citations used for context. A response is generated only if the `--generate` flag is present; otherwise, only citations are returned.

- `clear`
	- Clears the vector store after double confirmation.

## Configuration

Set the API address using the `--api` flag or environment variable `API_ADDRESS`.
