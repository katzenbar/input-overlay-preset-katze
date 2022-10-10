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
    "System Settings": folder({
      configuration_ui: { label: "Show UI?", value: configuration.configuration_ui },
      event_source: { label: "Event Source", value: configuration.event_source, options: ["browser", "web_socket"] },
    }),

    "Mouse Highlight": folder({
      mouse_click_highlight_color: { label: "Color", value: configuration.mouse_click_highlight_color },
    }),

    "Copy OBS URL": button(() =>
      navigator.clipboard.writeText(
        `${window.location.origin}/?${queryString.stringify({
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
