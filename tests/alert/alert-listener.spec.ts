import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { AlertService } from '../../src/Modules/alert/alert.service';
import { RegisterResponseEvent } from '../../src/Modules/response/events';
import { ResponseRepository } from '../../src/Modules/response/response.repository';
import { ResponseService } from '../../src/Modules/response/response.service';
import { AppConfigModule, HttpModule, LoggerModule } from '../../src/Providers';

describe('AlertService Listener', () => {
  const website = 'example.com';

  let alertService: AlertService;
  let eventEmitter: EventEmitter2;
  let responseService: ResponseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot({ global: true }),
        AppConfigModule,
        HttpModule,
        LoggerModule
      ],
      providers: [
        ResponseService,
        {
          provide: AlertService,
          useValue: {
            onRegisterResponse: jest.fn()
          }
        },
        {
          provide: ResponseRepository,
          useValue: {
            addResponse: jest.fn()
          }
        }
      ]
    }).compile();

    alertService = module.get(AlertService);
    eventEmitter = module.get(EventEmitter2);
    responseService = module.get(ResponseService);

    eventEmitter.addListener(
      RegisterResponseEvent.eventName,
      alertService.onRegisterResponse
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when new response is registered', () => {
    let emitSpy: jest.SpyInstance;
    let onRegisterResponseSpy: jest.SpyInstance;

    beforeEach(async () => {
      emitSpy = jest.spyOn(eventEmitter, 'emit');
      onRegisterResponseSpy = jest.spyOn(alertService, 'onRegisterResponse');

      await responseService.registerResponse(website);
    });

    it('then should emit an event', () => {
      expect(emitSpy).toBeCalled();
    });

    it('then should emit an event with correct payload', () => {
      expect(emitSpy).toBeCalledWith(RegisterResponseEvent.eventName, {
        website
      });
    });

    it('then should listen to event', () => {
      expect(onRegisterResponseSpy).toBeCalled();
    });
  });
});
