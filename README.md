# input-overlay preset - katze

A browser-based preset for the [input-overlay (v5.0.0+)](https://github.com/univrsal/input-overlay) plugin for [OBS Studio (v28.0.0+)](https://obsproject.com/).

# Using the preset

## Configuration options

You can configure this page by passing in different options through the url's [query string](https://en.wikipedia.org/wiki/Query_string). The supported options and their values are listed below.

### event_source

- `web_socket` - default
- `document`

Allows switching to use events from the browser to preview settings without having to open the page in OBS.

# Development

This project uses [Vite](https://vitejs.dev/) to build a single-page application using [React](https://reactjs.org/).

## Requirements

- [Node 16+](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

## Running the development server

- Fork and clone the repository to your development environment
- In the repository directory, run `pnpm install` to install project dependencies
- Run `pnpm dev` to start the development server
