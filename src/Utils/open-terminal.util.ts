import { execSync } from 'child_process';

export const openTerminal = (command: string) => {
  switch (process.platform) {
    case 'linux':
      execSync(`gnome-terminal -e "${command}"`, {
        stdio: 'ignore'
      });
      break;
    case 'darwin':
      execSync(`osascript -e "tell app "Terminal" to do script "${command}""`, {
        stdio: 'ignore'
      });
      break;
    case 'win32':
      execSync(`start cmd.exe /K ${command}`, { stdio: 'ignore' });
      break;
    default:
      console.log('Sorry, your terminal is currently not supported :(');
      process.exit();
  }
};
