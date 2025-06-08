jest.mock("../src/db.js");

const DB = require("../src/db.js");
const DropHandler = require("../src/handlers/drop.js");

describe('Drop handler test', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("User reset", async () => {
		const ctx = {
			from: {id: 123},
			reply: jest.fn()
		};

		const dbState = {
			123: {
				day_start: 5000,
				last_smoke: 123,
				last_smoke_undo: 123,
				cigarettes_daily: 123,
				cigarettes_start: 20,
				recommended_interval: 1000,
				days_total: 20,
				days_passed: 15,
				cigarettes_today: 4
			}
		};

		DB.dropUser.mockImplementation((id) => {
			dbState[id] = {
				day_start: 7000,
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

		await DropHandler(ctx);

		expect(dbState[123]).toStrictEqual({
			day_start: 7000,
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