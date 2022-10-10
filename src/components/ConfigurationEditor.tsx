import queryString from "query-string";
import { button, useControls } from "leva";
import React from "react";
import { Configuration, ConfigurationContextType, useConfiguration } from "../hooks/useConfiguration";

type Props = {
  configurationContext: ConfigurationContextType;
};
const ConfigurationEditorImpl: React.FC<Props> = (props) => {
  const { configurationContext } = props;

  const controlSettings = useControls({
    configuration_ui: { label: "Show UI?", value: true },
    event_source: { label: "Event Source", value: "browser", options: ["browser", "web_socket"] },
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
