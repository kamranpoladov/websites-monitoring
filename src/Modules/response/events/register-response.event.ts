export class RegisterResponseEvent {
  public static eventName = 'register-response';

  constructor(public readonly website: string) {}
}
