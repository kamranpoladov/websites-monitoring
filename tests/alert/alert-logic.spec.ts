import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { AlertRepository } from '../../src/Modules/alert/alert.repository';
import { AlertService } from '../../src/Modules/alert/alert.service';
import { AlertType } from '../../src/Modules/alert/constants';
import { ResponseModule } from '../../src/Modules/response';
import { ResponseService } from '../../src/Modules/response/response.service';
import {
  AppConfigModule,
  HttpModule,
  LoggerService
} from '../../src/Providers';

describe('AlertService Logic', () => {
  const website = 'example.com';

  let alertService: AlertService;
  let alertRepository: AlertRepository;
  let loggerService: LoggerService;
  let responseService: ResponseService;

  let getAvailabilitySpy: jest.SpyInstance;
  let getIsDownSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot({ global: true }),
        ConfigModule.forRoot({ isGlobal: true }),
        AppConfigModule,
        HttpModule,
        ResponseModule
      ],
      providers: [
        AlertService,
        {
          provide: LoggerService,
          useValue: {
            alert: jest.fn()
          }
        },
        {
          provide: AlertRepository,
          useValue: {
            getIsDown: jest.fn(),
            setIsDown: jest.fn()
          }
        }
      ]
    }).compile();

    alertService = module.get(AlertService);
    alertRepository = module.get(AlertRepository);
    loggerService = module.get(LoggerService);
    responseService = module.get(ResponseService);

    getAvailabilitySpy = jest.spyOn(responseService, 'getAvailability');
    getIsDownSpy = jest.spyOn(alertRepository, 'getIsDown');
  });

  beforeEach(async () => {
    await alertService.onRegisterResponse({ website });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when availability is less than 80%', () => {
    beforeAll(() => {
      getAvailabilitySpy.mockReturnValue(79);
    });

    // beforeEach(() => {
    //   alertService.onRegisterResponse({ website });
    // });

    describe('and when website is not currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(false);
      });

      it('then should trigger alert', () => {
        expect(loggerService.alert).toBeCalled();
      });

      it('then should trigger alert with "Down" payload', () => {
        expect(loggerService.alert).toBeCalledWith({
          availability: 79,
          website,
          type: AlertType.Down,
          time: expect.anything()
        });
      });
    });

    describe('and when website is currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(true);
      });

      it('then should not trigger alert', () => {
        expect(loggerService.alert).not.toBeCalled();
      });
    });
  });

  describe('when availability is greater than or equal to 80%', () => {
    beforeAll(() => {
      getAvailabilitySpy.mockReturnValue(80);
    });

    // beforeEach(() => {
    //   alertService.onRegisterResponse({ website });
    // });

    describe('and when website is currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(true);
      });

      it('then should trigger alert', () => {
        expect(loggerService.alert).toBeCalled();
      });

      it('then should trigger alert with "Recover" payload', () => {
        expect(loggerService.alert).toBeCalledWith({
          availability: 80,
          website,
          type: AlertType.Recover,
          time: expect.anything()
        });
      });
    });

    describe('and when website is not currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(false);
      });

      it('then should not trigger alert', () => {
        expect(loggerService.alert).not.toBeCalled();
      });
    });
  });
});
