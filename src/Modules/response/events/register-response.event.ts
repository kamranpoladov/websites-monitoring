export class RegisterResponseEvent {
  public static eventName = Symbol('register-response');

  constructor(public readonly website: string) {}
}
