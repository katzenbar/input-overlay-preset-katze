import queryString from "query-string";
import { button, folder, useControls } from "leva";
import React from "react";
import { Configuration, ConfigurationContextType, useConfiguration } from "../hooks/useConfiguration";

type Props = {
  configurationContext: ConfigurationContextType;
};
const ConfigurationEditorImpl: React.FC<Props> = (props) => {
  const { configurationContext } = props;
  const { configuration } = configurationContext;

  const controlSettings = useControls({
    "System Settings": folder(
      {
        configuration_ui: { label: "Show UI?", value: configuration.configuration_ui },
        event_source: { label: "Event Source", value: configuration.event_source, options: ["browser", "web_socket"] },
      },
      { collapsed: true },
    ),

    "Mouse Highlight": folder({
      mouse_click_highlight_color: { label: "Color", value: configuration.mouse_click_highlight_color },
      mouse_click_highlight_radius: {
        label: "Radius",
        value: configuration.mouse_click_highlight_radius,
      },
      mouse_click_highlight_width: {
        label: "Width",
        value: configuration.mouse_click_highlight_width,
      },

      mouse_click_highlight_outline: { label: "Outline", value: configuration.mouse_click_highlight_outline },
      mouse_click_highlight_outline_width: {
        label: "Outline Width",
        value: configuration.mouse_click_highlight_outline_width,
      },

      mouse_click_indicator_size_ratio: {
        label: " MB Dot Ratio",
        value: configuration.mouse_click_indicator_size_ratio,
      },
      mouse_click_indicator_mmb_size_ratio: {
        label: "MMB Pill Ratio",
        value: configuration.mouse_click_indicator_mmb_size_ratio,
      },
      mouse_click_indicator_spacing: {
        label: "MB Spacing Ratio",
        value: configuration.mouse_click_indicator_spacing,
      },

      mouse_click_animation_duration: {
        label: "Ani Duration",
        value: configuration.mouse_click_animation_duration,
      },
      mouse_click_animation_bounce: {
        label: "Ani Bounce",
        value: configuration.mouse_click_animation_bounce,
      },
    }),

    "Copy OBS URL": button(() =>
      navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}?${queryString.stringify({
          ...configurationContext.configuration,
          configuration_ui: false,
          event_source: "web_socket",
        })}`,
      ),
    ),
  });

  React.useEffect(() => {
    configurationContext.setConfiguration(controlSettings as Configuration);
  }, [configurationContext, controlSettings]);

  return null;
};

export const ConfigurationEditor: React.FC = () => {
  const configurationContext = useConfiguration();
  return configurationContext.configuration.configuration_ui ? (
    <ConfigurationEditorImpl configurationContext={configurationContext} />
  ) : null;
};
