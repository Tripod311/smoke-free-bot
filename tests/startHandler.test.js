jest.mock("../src/db.js");

const DB = require("../src/db.js");
const StartHandler = require("../src/handlers/start.js");

describe('Start handler test', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("User creation", async () => {
		const ctx = {
			from: {id: 123},
			reply: jest.fn()
		};

		const dbState = {};

		DB.newUser.mockImplementation((id) => {
			dbState[id] = {
				day_start: 5000,
				last_smoke: 0,
				last_smoke_undo: 0,
				cigarettes_daily: 0,
				cigarettes_start: 0,
				recommended_interval: 0,
				days_total: 0,
				days_passed: 0,
				cigarettes_today: 0
			};
		});

		await StartHandler(ctx);

		expect(dbState[123]).toStrictEqual({
			day_start: 5000,
			last_smoke: 0,
			last_smoke_undo: 0,
			cigarettes_daily: 0,
			cigarettes_start: 0,
			recommended_interval: 0,
			days_total: 0,
			days_passed: 0,
			cigarettes_today: 0
		});
		expect(ctx.reply).toHaveBeenCalled();
	});
});