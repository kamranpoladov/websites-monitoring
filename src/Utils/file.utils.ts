import { readFile, stat } from 'fs/promises';

// Similar to UNIX tail -f command but cross-platform
export const tailFile = async (path: string, bytes = 0) => {
  try {
    const stats = await stat(path);

    if (stats.size < bytes + 1) {
      setTimeout(() => tailFile(path, bytes), 1000);
    } else {
      const buff = await readFile(path);

      console.log(buff.toString('utf-8', bytes, buff.byteLength));

      process.nextTick(() => tailFile(path, buff.byteLength));
    }
  } catch (e) {
    console.log(
      `File ${path} does not exist anymore. Restart the application to track errors again`
    );
    process.exit();
  }
};
