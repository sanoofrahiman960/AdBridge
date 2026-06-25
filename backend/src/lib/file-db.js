const fs = require('fs/promises');
const path = require('path');

class FileDatabase {
  constructor(filePath, seedFactory) {
    this.filePath = filePath;
    this.seedFactory = seedFactory;
    this.queue = Promise.resolve();
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await fs.access(this.filePath);
    } catch (error) {
      await this.write(this.seedFactory());
    }
  }

  async read() {
    await this.ensureFile();
    const content = await fs.readFile(this.filePath, 'utf8');

    return JSON.parse(content);
  }

  async write(data) {
    await fs.writeFile(this.filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    return data;
  }

  async transaction(handler) {
    const operation = this.queue.then(async () => {
      const currentData = await this.read();
      const draft = structuredClone(currentData);
      const result = await handler(draft);
      await this.write(draft);
      return result;
    });

    this.queue = operation.catch(() => {});
    return operation;
  }

  async reset() {
    return this.write(this.seedFactory());
  }
}

module.exports = FileDatabase;
