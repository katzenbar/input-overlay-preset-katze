import { createMemoryHistory } from "history";
import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConfiguration, ConfigurationProvider } from "./useConfiguration";

describe.concurrent("useConfiguration", () => {
  it("returns the default configuration when no options are set", () => {
    const { result } = renderHook(() => useConfiguration(), { wrapper: ConfigurationProvider });
    expect(result.current).toEqual({
      configuration: expect.objectContaining({
        configuration_ui: true,
        event_source: "browser",
        mouse_click_highlight_color: "#38BDF8",
      }),
      setConfiguration: expect.any(Function),
    });
  });

  describe("event_source", () => {
    it("defaults to document", () => {
      const { result } = renderHook(() => useConfiguration(), { wrapper: ConfigurationProvider });
      expect(result.current).toEqual({
        configuration: expect.objectContaining({ event_source: "browser" }),
        setConfiguration: expect.any(Function),
      });
    });

    it("allows document", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=browser");

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      expect(result.current).toEqual({
        configuration: expect.objectContaining({ event_source: "browser" }),
        setConfiguration: expect.any(Function),
      });
    });

    it("allows web_socket", () => {
      const history = createMemoryHistory();
      history.replace("/?event_source=web_socket");

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      expect(result.current).toEqual({
        configuration: expect.objectContaining({ event_source: "web_socket" }),
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
        configuration: expect.objectContaining({ event_source: "browser" }),
        errors: "boop",
        setConfiguration: expect.any(Function),
      });
    });

    it("sets the value of event source to web_socket", () => {
      const history = createMemoryHistory();

      const { result } = renderHook(() => useConfiguration(), {
        wrapper: (props) => <ConfigurationProvider {...props} customHistory={history} />,
      });

      act(() => {
        result.current.setConfiguration({ event_source: "web_socket" });
      });

      expect(result.current).toEqual({
        configuration: expect.objectContaining({ event_source: "web_socket" }),
        setConfiguration: expect.any(Function),
      });
    });
  });
});
