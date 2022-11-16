import { createBrowserHistory, History } from "history";
import { isEqual } from "lodash";
import queryString from "query-string";
import React from "react";
import { z } from "zod";

const defaultHistory = createBrowserHistory();

const configSchema = z.object({
  configuration_ui: z.boolean().default(true),
  event_source: z.enum(["web_socket", "browser"]).default("browser"),

  key_input_show: z.boolean().default(true),
  key_input_color: z.string().default("#ffffff"),
  key_input_bg: z.string().default("#334155"),
  key_input_down_bg: z.string().default("#1e293b"),
  key_input_down_scale: z.number().default(0.75),
  key_input_outline: z.string().default("#94a3b8"),
  key_input_outline_width: z.number().default(2),

  key_input_animation_duration: z.number().default(0.5),
  key_input_animation_bounce: z.number().default(0.5),

  key_input_min_display_ms: z.number().default(1500),
  key_input_min_up_display_ms: z.number().default(500),

  mouse_highlight_radius: z.number().default(10),
  mouse_click_show: z.boolean().default(true),

  mouse_click_highlight_color: z.string().default("#38bdf8"),
  mouse_click_highlight_width: z.number().default(3),

  mouse_click_highlight_outline: z.string().default("#075985"),
  mouse_click_highlight_outline_width: z.number().default(1),

  mouse_click_indicator_size_ratio: z.number().default(0.35),
  mouse_click_indicator_mmb_size_ratio: z.number().default(2.5),
  mouse_click_indicator_spacing: z.number().default(1.2),

  mouse_click_animation_duration: z.number().default(0.2),
  mouse_click_animation_bounce: z.number().default(0.5),
});

export const defaultConfig = configSchema.parse({});

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
          const queryConfig = getNonDefaultConfigurationSettings(newParsedConfig.data);
          history.push(`${history.location.pathname}?${queryString.stringify(queryConfig)}`);
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

export const getNonDefaultConfigurationSettings = (configuration: Configuration): Partial<Configuration> => {
  const queryConfig: Partial<Configuration> = {};
  let key: keyof Configuration;

  for (key in configuration) {
    if (configuration[key] !== defaultConfig[key]) {
      queryConfig[key] = configuration[key] as any;
    }
  }

  return queryConfig;
};
