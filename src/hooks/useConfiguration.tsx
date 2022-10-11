import { createBrowserHistory, History } from "history";
import { isEqual } from "lodash";
import queryString from "query-string";
import React from "react";
import { z } from "zod";

const defaultHistory = createBrowserHistory();

const configSchema = z.object({
  configuration_ui: z.boolean().default(true),
  event_source: z.enum(["web_socket", "browser"]).default("browser"),
  mouse_click_highlight_color: z.string().default("#EE0000"),
});

export type Configuration = z.infer<typeof configSchema>;

export type ParsedConfiguration = {
  configuration: Configuration;
  errors?: string;
};

export type ConfigurationContextType = ParsedConfiguration & {
  setConfiguration: (newConfiguration: Partial<Configuration>) => void;
};

const parseConfig = (urlQueryString: string) => {
  const result = configSchema.safeParse(queryString.parse(urlQueryString, { parseBooleans: true, parseNumbers: true }));

  if (!result.success) {
    // Return a default configuration
    return { configuration: configSchema.parse({}), errors: "boop" };
  } else {
    return { configuration: result.data };
  }
};

const ConfigurationContext = React.createContext<ConfigurationContextType>({
  ...parseConfig(""),
  setConfiguration: () => {
    return;
  },
});

export type ConfigurationProviderProps = React.PropsWithChildren<{ customHistory?: History }>;

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = (props) => {
  const history = props.customHistory || defaultHistory;
  const [parsedConfig, setParsedConfiguration] = React.useState(parseConfig(history.location.search));

  React.useEffect(() => {
    return history.listen((update) => {
      const newParsedConfig = parseConfig(update.location.search);

      if (!isEqual(parsedConfig, newParsedConfig)) {
        setParsedConfiguration(newParsedConfig);
      }
    });
  }, [history, parsedConfig]);

  const setConfiguration = React.useCallback<ConfigurationContextType["setConfiguration"]>(
    (newConfig) => {
      const updatedConfiguration = { ...parsedConfig.configuration, ...newConfig };
      const newParsedConfig = configSchema.safeParse(updatedConfiguration);

      if (newParsedConfig.success) {
        if (!isEqual(parsedConfig.configuration, newParsedConfig.data)) {
          setParsedConfiguration({ configuration: newParsedConfig.data });
          history.push(`${history.location.pathname}?${queryString.stringify(updatedConfiguration)}`);
        }
      } else {
        // TODO set errors
        // eslint-disable-next-line no-console
        console.error(newParsedConfig.error);
      }
    },
    [parsedConfig.configuration, history],
  );

  return <ConfigurationContext.Provider {...props} value={{ ...parsedConfig, setConfiguration }} />;
};

export const useConfiguration = (): ConfigurationContextType => {
  return React.useContext(ConfigurationContext);
};
