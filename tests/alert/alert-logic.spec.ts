import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { AlertRepository } from '../../src/Modules/alert/alert.repository';
import { AlertService } from '../../src/Modules/alert/alert.service';
import { AlertType } from '../../src/Modules/alert/constants';
import { ResponseModule } from '../../src/Modules/response';
import { ResponseService } from '../../src/Modules/response/response.service';
import { StatsRepository } from '../../src/Modules/stats/stats.repository';
import {
  AppConfigModule,
  HttpModule,
  LoggerModule,
  PrettyModule
} from '../../src/Providers';

describe('AlertService Logic', () => {
  const website = 'example.com';

  let alertService: AlertService;
  let alertRepository: AlertRepository;
  let responseService: ResponseService;
  let statsRepository: StatsRepository;

  let getAvailabilitySpy: jest.SpyInstance;
  let getIsDownSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot({ global: true }),
        ConfigModule.forRoot({ isGlobal: true }),
        AppConfigModule,
        HttpModule,
        ResponseModule,
        LoggerModule,
        PrettyModule
      ],
      providers: [
        AlertService,
        {
          provide: AlertRepository,
          useValue: {
            getIsDown: jest.fn(),
            setIsDown: jest.fn()
          }
        },
        {
          provide: StatsRepository,
          useValue: {
            addAlertForWebsite: jest.fn()
          }
        }
      ]
    }).compile();

    alertService = module.get(AlertService);
    alertRepository = module.get(AlertRepository);
    responseService = module.get(ResponseService);
    statsRepository = module.get(StatsRepository);

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

    describe('and when website is not currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(false);
      });

      it('then should trigger alert', () => {
        expect(statsRepository.addAlertForWebsite).toBeCalled();
      });

      it('then should trigger alert with "Down" payload', () => {
        expect(statsRepository.addAlertForWebsite).toBeCalledWith(website, {
          time: expect.anything(),
          availability: 79,
          type: AlertType.Down
        });
      });
    });

    describe('and when website is currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(true);
      });

      it('then should not trigger alert', () => {
        expect(statsRepository.addAlertForWebsite).not.toBeCalled();
      });
    });
  });

  describe('when availability is greater than or equal to 80%', () => {
    beforeAll(() => {
      getAvailabilitySpy.mockReturnValue(80);
    });

    describe('and when website is currently down', () => {
      beforeAll(() => {
        getIsDownSpy.mockReturnValue(true);
      });

      it('then should trigger alert', () => {
        expect(statsRepository.addAlertForWebsite).toBeCalled();
      });

      it('then should trigger alert with "Recover" payload', () => {
        expect(statsRepository.addAlertForWebsite).toBeCalledWith(website, {
          availability: 80,
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
        expect(statsRepository.addAlertForWebsite).not.toBeCalled();
      });
    });
  });
});
