import { createMemoryHistory } from "history";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useConfiguration } from "./useConfiguration";

describe.concurrent("useConfiguration", () => {
  it("returns the default configuration when no options are set", () => {
    const { result } = renderHook(() => useConfiguration());
    expect(result.current).toEqual({ configuration: { event_source: "web_socket" } });
  });

  describe("event_source", () => {
    it("defaults to web_socket", () => {
      const { result } = renderHook(() => useConfiguration());
      expect(result.current).toEqual({ configuration: { event_source: "web_socket" } });
    });

    it("allows document", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=document");

      const { result } = renderHook(() => useConfiguration(history));
      expect(result.current).toEqual({ configuration: { event_source: "document" } });
    });

    it("resets the configuration if an invalid value type is provided", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=2");

      const { result } = renderHook(() => useConfiguration(history));
      expect(result.current).toEqual({ configuration: { event_source: "web_socket" }, errors: "boop" });
    });
  });
});
