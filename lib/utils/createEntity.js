function CreateEntity (path) {
  return new Function('item', `return new class ${path} {constructor(args) {Object.assign(this, item)}}`);
}

module.exports = CreateEntity;
