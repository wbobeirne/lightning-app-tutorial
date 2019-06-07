# Lightning App Tutorial

This is the code for the [Lightning App Tutorial: Part 3](https://medium.com/@wbobeirne/making-a-lightning-web-app-part-3-58d8c7351175) post. If you're not following along with that, here are some basic setup instructions.

## Requirements

* Node 8+
* An [LND node](https://github.com/lightningnetwork/lnd)

## Setup the Project

Copy the environment configuration file with
```
cp .env.example .env
```

Edit the following fields in your new .env file with information about your node. You can get some help finding this info using this tool: https://lightningjoule.com/tools/node-info
* `LND_GRPC_URL` - The location to connect to your node. If you're running with default settings locally, this should be `127.0.0.1:10009`.
* `LND_MACAROON` - Your `invoice.macaroon` file, base64 encoded. Run `base64 invoice.macaroon` in your macaroon directory to get this.
* `LND_TLS_CERT` - Your TLS certificate, also base 64 encoded. Run `base64 tls.cert` in your data directory to get this.

## Run the Project

Install dependencies and run the app with
```sh
npm install && npm run dev
# OR #
yarn && yarn dev
```
