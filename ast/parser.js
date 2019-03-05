const fs = require('fs');
const ohm = require('ohm-js');

const Program = require('./Program');
const LetExp = require('./LetExp');
const IfExp = require('./IfExp');
const WhileExp = require('./WhileExp');
const ForExp = require('./ForExp');
const Assignment = require('./Assignment');
const Break = require('./Break');
const TypeDec = require('./TypeDec');
const NamedType = require('./NamedType');
const ArrayType = require('./ArrayType');
const Field = require('./Field');
const FunDec = require('./FunDec');
const VarDec = require('./VarDec');
const BinaryExp = require('./BinaryExp');
const NegationExp = require('./NegationExp');
const Call = require('./Call');
const ArrayExp = require('./ArrayExp');
const RecordExp = require('./RecordExp');
const ExpSeq = require('./ExpSeq');
const Literal = require('./Literal');

const grammar = ohm.grammar(fs.readFileSync('grammar/tiger.ohm'));

// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation('ast', {
  Program(exp) {
    return new Program(exp.ast());
  },
  Exp_let(_1, decs, _2, exps, _3) {
    return new LetExp(decs.ast(), exps.ast());
  },
  Exp_if(_1, test, _2, consequent, _3, alternate) {
    return new IfExp(test.ast(), consequent.ast(), arrayToNullable(alternate.ast()));
  },
  Exp_while(_1, test, _2, body) {
    return new WhileExp(test.ast(), body.ast());
  },
  Exp_for(_1, id, _2, initial, _3, test, _4, body) {
    return new ForExp(id.sourceString, initial.ast(), test.ast(), body.ast());
  },
  Exp_assign(target, _1, source) {
    return new Assignment(target.ast(), source.ast());
  },
  Exp_break(_1) {
    return new Break();
  },
  TypeDec(_1, id, _2, type) {
    return new TypeDec(id.ast(), type.ast());
  },
  Type_named(id) {
    return new NamedType(id.ast());
  },
  ArrayType(_1, _2, id) {
    return new ArrayType(id.ast());
  },
  RecordType(_1, fieldDecs, _2) {
    return new RecordType(fieldDecs.ast());
  },
  FieldDec(id, _1, typeid) {
    return new Field(id.ast(), typeid.ast())
  },
  FunDec(_1, id, _2, params, _4, _5, typeid, _6, body) {
    return new FunDec(id.ast(), params.ast(), typeid.ast(), body.ast());
  },
  VarDec(_1, id, _2, typeid, _3, init) {
    return new VarDec(id.ast(), typeid.ast(), init.ast());
  },
  Exp1_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp2_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp3_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp4_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp5_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp6_negation(_1, operand) {
    return new NegationExp(operand.ast());
  },
  Literal_nil(_1) {
    return new Nil();
  },
  Var_subscripted(base, _1, subscript, _2) {
    return new SubscriptedVar(base.ast(), subscript.ast());
  },
  Var_field(record, _1, field) {
    return new MemberVar(record.ast(), field.ast());
  },
  ArrayExp(type, _1, size, _2, _3, fill) {
    return new ArrayExp(type.ast(), size.ast(), fill.ast());
  },
  RecordExp(type, _1, fields, _2) {
    return new RecordExp(type.ast(), fields.ast());
  },
  FieldBind(id, _1, value) {
    return new FieldBind(id.ast(), value.ast())
  },
  Call(callee, _1, args, _2) {
    return new Call(callee.ast(), args.ast());
  },
  ExpSeq(_1, exps, _2) {
    return new ExpSeq(exps.ast());
  },
  NonemptyListOf(first, _, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
  intlit(digits) {
    return new Literal(+this.sourceString);
  },
  stringlit(_1, chars, _6) {
    return new Literal(this.sourceString.slice(1, -1));
  },
  id(_1, _2) {
    return this.sourceString;
  },
  _terminal() {
    return this.sourceString;
  },
});
/* eslint-enable no-unused-vars */

module.exports = (text) => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};