import { MockedFunction } from "vitest";

type Procedure = (...args: any[]) => any;

export const asMockedFunction = <Fn extends Procedure>(fn: Fn): MockedFunction<Fn> =>
  fn as unknown as MockedFunction<Fn>;
