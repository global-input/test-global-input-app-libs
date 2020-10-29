const createPromise = (target) => {
  target.promise = new Promise((resolve, reject) => {
    target.resolve = resolve;
    target.reject = reject;
  });
};

const createWaitForInputMessage = (target) => {
  const input = {};
  createPromise(input);
  target.onInput = (message) => {
    input.resolve(message);
    createPromise(input);
  };
  input.get = () => input.promise;
  return input;
};

export function createInputReceivers(config = {}) {
  let inputs = {};
  let input = {};
  if (config.initData && config.initData.form && config.initData.form.fields) {
    inputs = config.initData.form.fields.map((field) => {
      field.operations = {
        onInput: () => { }
      };
      return createWaitForInputMessage(field.operations)
    }
    );
  }
  else {
    input = createWaitForInputMessage(config);
  }
  return { config, input, inputs };
}
