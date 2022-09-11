import { createBrowserHistory, History } from "history";
import queryString from "query-string";
import React from "react";
import { z } from "zod";

const defaultHistory = createBrowserHistory();

const configSchema = z.object({
  event_source: z.enum(["web_socket", "document"]).default("web_socket"),
});

export type Configuration = {
  configuration: z.infer<typeof configSchema>;
  errors?: string;
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

export const useConfiguration = (customHistory?: History): Configuration => {
  const history = customHistory || defaultHistory;
  const [configuration, setConfiguration] = React.useState(parseConfig(history.location.search));

  React.useEffect(() => {
    return history.listen((update) => {
      setConfiguration(parseConfig(update.location.search));
    });
  }, [history]);

  return configuration;
};
