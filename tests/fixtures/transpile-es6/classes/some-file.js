class A {
  static foo() {
    return "foo";
  }

  bar() {
    return "bar";
  }

  foobar() {
    return this.constructor.foo() + this.bar();
  }
}

class B extends A {
  baz() {
    return "baz";
  }

  foobarbaz() {
    return this.foobar() + this.baz();
  }
}
