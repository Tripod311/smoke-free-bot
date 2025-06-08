jest.mock("../src/db.js");

const DB = require("../src/db.js");
const RegisterHandler = require("../src/handlers/register.js");

describe('Register handler test', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it("User data fill success", async () => {
		jest.setSystemTime(5000000);
		const seconds_in_day = (24 * 60 * 60);

		const ctx = {
			from: {id: 123},
			reply: jest.fn(),
			message: {
				text: "10 20"
			}
		};

		const dbState = {
			123: {
				day_start: 5000,
				last_smoke: 0,
				last_smoke_undo: 0,
				cigarettes_daily: 0,
				cigarettes_start: 0,
				recommended_interval: 0,
				days_total: 0,
				days_passed: 0,
				cigarettes_today: 0
			}
		};

		DB.fillUserInfo.mockImplementation((id, daily, total) => {
			const day_start = new Date()/1000;
			const recommended_interval = Math.floor(seconds_in_day/daily);
			
			dbState[id].day_start = day_start;
			dbState[id].last_smoke_undo = day_start;
			dbState[id].last_smoke = day_start;
			dbState[id].cigarettes_daily = daily;
			dbState[id].cigarettes_start = daily;
			dbState[id].recommended_interval = recommended_interval;
			dbState[id].days_total = total;
		});

		await RegisterHandler(ctx);

		expect(dbState[123]).toStrictEqual({
			day_start: 5000,
			last_smoke: 5000,
			last_smoke_undo: 5000,
			cigarettes_daily: 10,
			cigarettes_start: 10,
			recommended_interval: Math.floor(seconds_in_day/10),
			days_total: 20,
			days_passed: 0,
			cigarettes_today: 0
		});
		expect(ctx.reply).toHaveBeenCalled();
	});

	it("User data fill failure", async () => {
		const seconds_in_day = (24 * 60 * 60);

		const ctx = {
			from: {id: 123},
			reply: jest.fn(),
			message: {
				text: "some other text"
			}
		};

		const dbState = {
			123: {
				day_start: 5000,
				last_smoke: 0,
				last_smoke_undo: 0,
				cigarettes_daily: 0,
				cigarettes_start: 0,
				recommended_interval: 0,
				days_total: 0,
				days_passed: 0,
				cigarettes_today: 0
			}
		};

		DB.fillUserInfo.mockImplementation((id, daily, total) => {
			const day_start = new Date()/1000;
			const recommended_interval = Math.floor(seconds_in_day/daily);
			
			dbState[id].day_start = day_start;
			dbState[id].last_smoke_undo = day_start;
			dbState[id].last_smoke = day_start;
			dbState[id].cigarettes_daily = daily;
			dbState[id].cigarettes_start = daily;
			dbState[id].recommended_interval = recommended_interval;
			dbState[id].days_total = total;
		});

		await RegisterHandler(ctx);

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