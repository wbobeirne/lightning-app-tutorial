# Lightning App Tutorial

This is a step-by-step tutorial project for learning to build Lightning applications. It's broken out into 5 parts, which you can find as separate posts on Medium and branches here on GitHub.

* [Part 1 - Connecting to your Node](https://medium.com/p/4a13c82f3f78) ([`part-1` branch](https://github.com/wbobeirne/lightning-app-tutorial/tree/part-1))
* [Part 2 - Receiving Payments](https://medium.com/@wbobeirne/making-a-lightning-web-app-part-2-414f5d23c2d7) ([`part-2` branch](https://github.com/wbobeirne/lightning-app-tutorial/tree/part-2))
* [Part 3 - Instant Updates w/ Websockets](https://medium.com/@wbobeirne/making-a-lightning-web-app-part-3-58d8c7351175) ([`part-3` branch](https://github.com/wbobeirne/lightning-app-tutorial/tree/part-3))
* Part 4 - Integrating WebLN (Coming soon!)
* Part 5 - Launching to Production (Coming soon!)

If you'd rather read the code than a post, feel free to dive in directly with the following instructions:

## Requirements

* Node 8+
* An [LND node](https://github.com/lightningnetwork/lnd)

If you want an LND node but have trouble setting it up with LND directly, I suggest either following [Pierre Rochard's Easiest Lightning Node guide](https://medium.com/lightning-power-users/windows-macos-lightning-network-284bd5034340), or downloading the [Lightning App from Lightning Labs](https://github.com/lightninglabs/lightning-app).

If you'd rather not deal with getting your hands on some Bitcoin or waiting for block times to open channels, you can setup your own [simulated Lightning network cluster](https://dev.lightning.community/tutorial/01-lncli/).

## Development

Install dependencies and run the app with
```sh
npm install && npm run dev
# OR #
yarn && yarn dev
```

## Building & Deploying

Coming soon.
