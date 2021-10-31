export class ShellRepository {
  constructor(private readonly websites: Set<string>) {
    this.websites = new Set();
  }

  public hasWebsite(website: string): boolean {
    return this.websites.has(website);
  }

  public addWebsite(website: string): void {
    this.websites.add(website);
  }
}
