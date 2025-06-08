const { seconds_to_format } = require("../src/handlers/common.js");

test("formatting test", () => {
	expect(seconds_to_format(60*60*4 + 60*32 + 44)).toBe("4:32:44");
});