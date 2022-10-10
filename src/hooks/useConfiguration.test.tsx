import { createMemoryHistory } from "history";
import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConfiguration, ConfigurationProvider } from "./useConfiguration";

describe.concurrent("useConfiguration", () => {
  it("returns the default configuration when no options are set", () => {
    const { result } = renderHook(() => useConfiguration(), { wrapper: ConfigurationProvider });
    expect(result.current).toEqual({
      configuration: { event_source: "web_socket" },
      setConfiguration: expect.any(Function),
    });
  });

  describe("event_source", () => {
    it("defaults to web_socket", () => {
      const { result } = renderHook(() => useConfiguration(), { wrapper: ConfigurationProvider });
      expect(result.current).toEqual({
        configuration: { event_source: "web_socket" },
        setConfiguration: expect.any(Function),
      });
    });

    it("allows document", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=document");

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      expect(result.current).toEqual({
        configuration: { event_source: "document" },
        setConfiguration: expect.any(Function),
      });
    });

    it("resets the configuration if an invalid value type is provided", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=2");

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      expect(result.current).toEqual({
        configuration: { event_source: "web_socket" },
        errors: "boop",
        setConfiguration: expect.any(Function),
      });
    });

    it("sets the value of event source to document", () => {
      const history = createMemoryHistory();

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      act(() => {
        result.current.setConfiguration({ event_source: "document" });
      });

      expect(result.current).toEqual({
        configuration: { event_source: "document" },
        setConfiguration: expect.any(Function),
      });
    });
  });
});
