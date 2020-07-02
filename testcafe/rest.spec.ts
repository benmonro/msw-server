import {screen} from '@testing-library/testcafe';

fixture`Rest`
.page`http://localhost:3000`

test("should do a GET", async t => {
    await t.debug().expect(screen.findByRole("link", {name:"xxx"}).exists).ok()
})
