/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser');
const analyze = require('../../semantics/analyzer');
const generate = require('../javascript-generator');

const fixture = {
  hello: [
    String.raw`print("Hello, world\n")`,
    String.raw`console.log("Hello, world\n")`,
  ],

  arithmetic: [
    String.raw`5 * -2 + 8`,
    String.raw`((5 * (-(2))) + 8)`,
  ],

  letAndAssign: [
    String.raw`let var x := 3 in x := 2 end`,
    /let x_(\d+) = 3;\s+x_\1 = 2/,
  ],

  call: [
    String.raw`let function f(x: int, y: string) = () in f(1, "") end`,
    /function f_(\d+)\(x_\d+, y_\d+\) \{\s*};\s*f_\1\(1, ""\)/,
  ],

  whileLoop: [
    String.raw`while 7 do nil`,
    /while \(7\) \{\s*null\s*\}/,
  ],

  ifThen: [
    String.raw`if 3 then 5`,
    '((3) ? (5) : (null))',
  ],

  ifThenElse: [
    String.raw`if 3 then 5 else 8`,
    '((3) ? (5) : (8))',
  ],

  member: [
    String.raw`let type r = {x:string} var p := r{x="@"} in print(p.x) end`,
    /let p_(\d+) = \{\s*x: "@"\s*\};\s*console.log\(p_\1\.x\)/,
  ],
};

describe('The JavaScript generator', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
