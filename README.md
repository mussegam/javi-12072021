# Order Book

By Javi Dolcet - 12-07-2021

Small application that renders a live orderbook capable of displaying orders from two different markets (XTC/USD and ETH/USD).

## Setup

This is a React Native application. To run it, you'll need:

- Dependencies: node, npm, watchman, xcode, android-sdk, react-native-cli, yarn, cocoapods. More info [here](https://reactnative.dev/docs/environment-setup)
- Run `yarn install`
- Run `npx pod-install`.
- Run `npx react-native run-ios` to build and run the project in the iOS simulator
- Run `npx react-native run-android` to build and run the Android app

## Test

The project includes a small test suite covering the critical components of the application.

- Run `yarn test` to run the test suite.

## Architecture approach

My main goal building this application was simplicity.
I've tried using the right React tools/techniques for the job and to use as few external libraries as possible.
Not only to avoid 'extra weight', but also to reduce the burden due to updates/vulnerabilities.
At my current job, I've recently had to patch several libraries due to vulnerabilities.

To improve performance I decided to follow a ViewModel approach with the orderbook data.
When a message is received from the WebSocket, the app updates its orderbook model composed of two maps (asks and bids).
This way, the orderbook always contains the most recent data.
Once the orderbook is updated, the app tries to refresh the Orderbook view model.
This is the most expensive task, since besides rendering we have to process the raw data to sort it and add all the data needed to render each order book level.
To keep this performant, this update function is throttled to run at most every 300ms.

Regarding the point 4 of the task, I wasn't too sure what you were expecting.
So what I did is:

- The first time you press `Kill feed`, it calls the error handler of the websocket with a custom error.
  This closes the socket and displays an error view that informs the user that there was an error and allows her to try to reconnect.
  At the moment, the reconnect button only dismisses the error view to allow the next item.
- The second time you press `Kill feed`, the connection with the websocket is restablished.

### To Do

My idea was to integrate `react-native-web` to be able to deploy it somewhere, but unfortunately ran out of time.
As it is, the App component needs a refactor to reduce coupling with the WebSocket and OrderBook.
