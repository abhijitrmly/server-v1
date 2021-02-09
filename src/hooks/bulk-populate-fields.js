const { fastJoin } = require('feathers-hooks-common');
const _ = require('lodash');
const BatchLoader = require('@feathers-plus/batch-loader');

const { loaderFactory, getUniqueKeys } = BatchLoader;

const join = function join(name, rule, loaders) {
  loaders[rule.service] = loaders[rule.service] || {};
  const childField = rule.childField || '_id';
  if (typeof loaders[rule.service][childField] === 'undefined') {
    loaders[rule.service][childField] = rule.asArray;
  }
  return () => async (model, context) => {
    const modelVal = _.get(model, rule.parentField || name);

    let populated = [];

    if (modelVal) {
      populated = await context._loaders[rule.service][childField].loadMany(
        Array.isArray(modelVal) ? modelVal : [modelVal],
      );
    }

    if (rule.asArray) {
      ([populated] = populated);
    }

    if (rule.select && populated) {
      populated = populated.map((object) => _.pick(object, rule.select.concat('_id')));
    }
    _.set(
      model,
      name,
      (rule.asArray || Array.isArray(modelVal)) ? populated : populated[0],
    );
  };
};

const resolve = function resolve(rules, loaders) {
  const resolvers = { joins: {} };
  Object.entries(rules).forEach(([name, rule]) => {
    if (name !== 'parentField') {
      if (rule.service) {
        resolvers.joins[name] = join(name, rule, loaders);
      } else {
        resolvers.joins[name] = {
          resolver: () => async (model) => _.get(model, rule.parentField || name),
          joins: resolve(rule, loaders),
        };
      }
    }
  });
  return resolvers;
};

const joinRules = function joinRules(rules) {
  const loaders = {};
  const resolvers = resolve(rules, loaders);
  return {
    before: (context) => {
      context._loaders = context._loaders || {};
      Object.entries(loaders).forEach(([service, keys]) => {
        context._loaders[service] = context._loaders[service] || {};
        Object.entries(keys).forEach(([key, multi]) => {
          if (!context._loaders[service][key]) {
            if (multi) {
              context._loaders[service][key] = new BatchLoader(async (bkeys, bcontext) => {
                const callingParams = {
                  query: { [key]: { $in: getUniqueKeys(bkeys) } },
                  paginate: false,
                  _populate: 'skip',
                };

                const result = await bcontext.app.service(service).find(callingParams);
                return bkeys.map((_key) => (
                  result.filter((record) => (
                    record[key].map((k) => k.toString()).includes(_key.toString())
                  ))
                ));
              }, { context });
            } else {
              context._loaders[service][key] = loaderFactory(
                context.app.service(service),
                key,
                multi,
                { paginate: false },
              )(context);
            }
          }
        });
      });
    },
    joins: resolvers.joins,
  };
};

module.exports = function FastJoinFactory(rules) {
  return fastJoin(joinRules(rules));
};
