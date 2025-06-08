jest.mock("../src/db.js");

const DB = require("../src/db.js");
const CanIHandler = require("../src/handlers/cani.js");
const { seconds_to_format } = require("../src/handlers/common.js");

describe('CanI handler test', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it("allow test", async () => {
		jest.setSystemTime(1000000);

		const ctx = {
			from: {id: 123},
			reply: jest.fn()
		};

		const dbState = {
			123: {
				day_start: 1000,
				last_smoke: 0,
				last_smoke_undo: 0,
				cigarettes_daily: 20,
				cigarettes_start: 20,
				recommended_interval: 1000,
				days_total: 20,
				days_passed: 0,
				cigarettes_today: 20
			}
		};

		DB.userInfo.mockImplementation((id) => {
			return dbState[id];
		});

		await CanIHandler(ctx);

		expect(ctx.reply).toHaveBeenCalledWith(expect.stringMatching(/You can smoke now$/));
	});

	it("forbid test", async () => {
		jest.setSystemTime(800000);

		const ctx = {
			from: {id: 123},
			reply: jest.fn()
		};

		const dbState = {
			123: {
				day_start: 1000,
				last_smoke: 0,
				last_smoke_undo: 0,
				cigarettes_daily: 20,
				cigarettes_start: 20,
				recommended_interval: 1000,
				days_total: 20,
				days_passed: 0,
				cigarettes_today: 20
			}
		};

		DB.userInfo.mockImplementation((id) => {
			return dbState[id];
		});

		await CanIHandler(ctx);

		const formatted = seconds_to_format(Date.now()/1000 - 0);

		expect(ctx.reply).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`Wait ${formatted}$`)));
	});
});