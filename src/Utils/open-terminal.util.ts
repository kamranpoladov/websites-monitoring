import { execSync } from 'child_process';

export const openTerminal = (command: string) => {
  switch (process.platform) {
    case 'linux':
      try {
        execSync(`gnome-terminal -- ${command}`, { stdio: 'ignore' });
      } catch (e) {
        console.log(
          'Sorry, your terminal application is currently not supported'
        );
        process.exit();
      }
      break;
    case 'darwin':
      try {
        execSync(
          `osascript -e 'tell app "Terminal" to do script "cd ${process.cwd()} && ${command}"'`,
          {
            stdio: 'ignore'
          }
        );
      } catch (e) {
        console.log(
          'Sorry, your terminal application is currently not supported'
        );
        process.exit();
      }
      break;
    case 'win32':
      try {
        execSync(`start cmd.exe /K ${command}`, { stdio: 'ignore' });
      } catch (e) {
        console.log(
          'Sorry, your terminal application is currently not supported'
        );
        process.exit();
      }
      break;
    default:
      console.log('Sorry, your operating system is currently not supported :(');
      process.exit();
  }
};
