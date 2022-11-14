# input-overlay preset - katze

A browser-based preset for the [input-overlay (v5.0.0+)](https://github.com/univrsal/input-overlay) plugin for [OBS Studio (v28.0.0+)](https://obsproject.com/).

# Using the preset

## Configuring input overlay plugin

## Configuration options

You can configure this page by passing in different options through the url's [query string](https://en.wikipedia.org/wiki/Query_string). The supported options and their values are listed below.

### System settings

#### Show UI - `configuration_ui`

- `true` - default
- `false`

Displays the configuration UI, allowing an easy way to set configurable settings in the browser before copying the link into OBS.

#### Event Source - `event_source`

- `browser` - default
- `web_socket`

Allows switching to use events from the browser to preview settings without having to open the page in OBS.

### Mouse highlight

#### Radius - `mouse_highlight_radius`

The center radius of the circle shown around the mouse highlight.

### Mouse click highlight

Settings for the visualizations when a mouse button is pressed

#### Color - `mouse_click_highlight_color`

A hex color for the circle and mouse button indicators shown when the mouse is down.

#### Ring width - `mouse_click_highlight_width`

The thickness of the ring drawn around the mouse when a mouse button is pressed

#### Outline - `mouse_click_highlight_outline`

The hex color for the outline around the mouse click highlight elemnents.

#### Outline width - `mouse_click_highlight_outline_width`

The thickness of the outline around the mouse click highlight elements.

#### Mouse button dot ratio - `mouse_click_indicator_size_ratio`

The size of the mouse button indicator dots, relative to the ring width.

#### Middle mouse button pill ratio - `mouse_click_indicator_mmb_size_ratio`

The length of the middle mouse button pill indicator, relative to the size of the mouse button dot size.

#### Mouse button spacing ratio - `mouse_click_indicator_spacing`

The space between the mouse highlight ring and the indicators, relative to the size of the mouse button dot size.

#### Animation duration - `mouse_click_animation_duration`

The duration of animating the mouse click indicators in and out of view.

#### Animation bounce - `mouse_click_animation_bounce`

The bounciness of animating the mouse click indicators. See [Framer Motion's documentation](https://www.framer.com/docs/transition/###bounce) for more details.

#### O

# Development

This project uses [Vite](https://vitejs.dev/) to build a single-page application using [React](https://reactjs.org/).

## Requirements

- [Node 16+](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

## Running the development server

- Fork and clone the repository to your development environment
- In the repository directory, run `pnpm install` to install project dependencies
- Run `pnpm dev` to start the development server
