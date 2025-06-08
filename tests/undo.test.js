jest.mock("../src/db.js");

const DB = require("../src/db.js");
const UndoHandler = require("../src/handlers/undo.js");

describe('Undo handler test', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Undo smoke", async () => {
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
		DB.undoSmoke.mockImplementation((id) => {
			dbState[id].last_smoke = dbState[id].last_smoke_undo;
		});

		await UndoHandler(ctx);

		expect(dbState[123]).toStrictEqual({
			day_start: 5000,
			last_smoke: 0,
			last_smoke_undo: 0,
			cigarettes_daily: 5,
			cigarettes_start: 5,
			recommended_interval: 1000,
			days_total: 20,
			days_passed: 0,
			cigarettes_today: 0
		});
		expect(ctx.reply).toHaveBeenCalled();
	});
});