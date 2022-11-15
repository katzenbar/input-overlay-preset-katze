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

### Key input

### Show key input - `key_input_show`

- `true` - default
- `false`

Show/hide the key input indicator.

#### Font color - `key_input_color`

A hex color for the font of the key input indicator.

#### Background color - `key_input_bg`

A hex color for the background color of the key input indicator when the key has been released.

#### Pressed background color - `key_input_down_bg`

A hex color for the background color of the key input indicator when the key is actively pressed.

#### Pressed scale - `key_input_down_scale`

The scale of the key input indicator when the key is actively pressed.

#### Outline - `key_input_outline`

A hex color for the outline around the key input indicator, to make it stand out over colors that are similar to the background color.

##### Outline width - `key_input_outline_width`

The thickness of the outline around the key input indicator.

#### Animation duration - `key_input_animation_duration`

The duration of animating the key input indicators in and out of view.

#### Animation bounce - `key_input_animation_bounce`

The bounciness of animating the key input indicators. See [Framer Motion's documentation](https://www.framer.com/docs/transition/###bounce) for more details.

#### Min display - `key_input_min_display_ms`

The minimum amount of time to display a key press (both down and up states) in milliseconds.

#### Min up display - `key_input_min_up_display_ms`

The minimum amount of time to display a key press in the up state, if it was pressed for the min display time already. Set this to 0 to not show the key in an up state if held for the min display time.

### Mouse highlight

#### Show click highlight - `mouse_click_show`

- `true` - default
- `false`

Show/hide the mouse click indicator.

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
