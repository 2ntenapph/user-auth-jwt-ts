"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const nock_1 = __importDefault(require("nock"));
describe('Auth Proxy Route', () => {
    beforeEach(() => {
        nock_1.default.cleanAll();
    });
    it('should proxy a request to the Auth Service', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, nock_1.default)('http://auth-service:4000')
            .post('/signup')
            .reply(201, { message: 'User created' });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/signup')
            .send({ email: 'test@example.com', password: 'password123', role: 'user' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created');
    }));
});
