jest.mock("../src/db.js");

const DB = require("../src/db.js");
const SmokeHandler = require("../src/handlers/smoke.js");

describe('Start handler test', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it("Smoke registration", async () => {
		jest.setSystemTime(3000000);

		const ctx = {
			from: {id: 123},
			reply: jest.fn()
		};

		const dbState = {
			123: {
				day_start: 5000,
				last_smoke: 1000,
				last_smoke_undo: 0,
				cigarettes_daily: 5,
				cigarettes_start: 5,
				recommended_interval: 1000,
				days_total: 20,
				days_passed: 0,
				cigarettes_today: 0
			}
		};

		DB.userInfo.mockImplementation((id) => {
			return dbState[id];
		});
		
		DB.registerSmoke.mockImplementation((id) => {
			dbState[id].last_smoke_undo = dbState[id].last_smoke;
			dbState[id].last_smoke = new Date()/1000;
			dbState[id].cigarettes_today++;
		});

		await SmokeHandler(ctx);

		expect(dbState[123]).toStrictEqual({
			day_start: 5000,
			last_smoke: 3000,
			last_smoke_undo: 1000,
			cigarettes_daily: 5,
			cigarettes_start: 5,
			recommended_interval: 1000,
			days_total: 20,
			days_passed: 0,
			cigarettes_today: 1
		});
		expect(ctx.reply).toHaveBeenCalled();
	});
});