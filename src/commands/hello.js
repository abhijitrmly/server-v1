module.exports = function (app, program) {
  const action = function () {
    console.info('hello');
    process.exit();
  };

  program
    .command('hello')
    .action(action);

  return action;
};
