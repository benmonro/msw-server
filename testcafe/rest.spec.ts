import { screen } from "@testing-library/testcafe";

fixture("Rest").page`http://localhost:3000`;

// test("heading", async t => {
//   await t.expect(screen.findByText(/example app|loading/i).exists).ok();
// });

test("should do a GET", async (t) => {
  await t.expect(screen.findByRole("heading", { name: /foo/ }).exists).ok();
});
test("should do a DELETE", async (t) => {
  await t
    .expect(screen.findAllByRole("heading", { name: /foo|bar/ }).count)
    .eql(2)
    .hover(screen.findByRole("heading", { name: "foo" }))
    .click(screen.findByRole("button", { name: /done/i }))
    .expect(screen.findAllByRole("heading", { name: /foo|bar/ }).count)
    .eql(1);
});
test("should do a POST", async (t) => {
  await t
    .typeText(screen.findByRole("textbox"), "baz")
    .pressKey("enter")
    .expect(screen.findByRole("heading", { name: "baz" }).exists)
    .ok();
});

test("should do a PUT", async (t) => {
  await t
    .hover(screen.findByRole("heading", { name: "bar" }))
    .click(screen.findByRole("button", { name: /edit/i }))
    .typeText(screen.findByDisplayValue("bar"), "qux")
    .pressKey("enter")
    .expect(screen.findByRole("heading", { name: "barqux" }).exists)
    .ok();
});
