## How to run?

- Clone the repository `https://github.com/thedanielmark/subnets-prediction-market`

### Start the server

- run `cd server`
- run `pnpm install`
- replace the path of ipc-cli from `/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli` to your current path (preferrably use absolute path) in `index.js`
- run `node index.js`

### Start the client

- run `cd web`
- run `yarn`
- run `yarn dev`
- open `http://localhost:3000` in your browser to access shady
