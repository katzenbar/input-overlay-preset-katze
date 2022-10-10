import { createBrowserHistory, History } from "history";
import queryString from "query-string";
import React from "react";
import { z } from "zod";

const defaultHistory = createBrowserHistory();

const configSchema = z.object({
  event_source: z.enum(["web_socket", "document"]).default("web_socket"),
});

export type Configuration = z.infer<typeof configSchema>;

export type ParsedConfiguration = {
  configuration: Configuration;
  errors?: string;
};

export type ConfigurationContextType = ParsedConfiguration & {
  setConfiguration: (newConfiguration: Configuration) => void;
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
  const [parsedConfiguration, setParsedConfiguration] = React.useState(parseConfig(history.location.search));

  React.useEffect(() => {
    return history.listen((update) => {
      setParsedConfiguration(parseConfig(update.location.search));
    });
  }, [history]);

  const setConfiguration = React.useCallback(
    (newConfig: Partial<Configuration>) => {
      const updatedConfiguration = { ...parsedConfiguration.configuration, ...newConfig };
      setParsedConfiguration({ configuration: updatedConfiguration });
      history.push(`/?${queryString.stringify(updatedConfiguration)}`);
    },
    [parsedConfiguration.configuration, history],
  );

  return <ConfigurationContext.Provider {...props} value={{ ...parsedConfiguration, setConfiguration }} />;
};

export const useConfiguration = (): ConfigurationContextType => {
  return React.useContext(ConfigurationContext);
};
