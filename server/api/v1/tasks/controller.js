//Handling requests to the api

const { Model, fields, references } = require('./model');
const { paginationParseParams } = require('../../../utils');
const { sortParseParams, sortCompactToStr } = require('../../../utils');

const referencesNames = Object.getOwnPropertyNames(references);

exports.id = async (req, res, next, id) => {
  const populate = referencesNames.join(' ');
  try {
    const doc = await Model.findById(id).populate(populate).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;

      next({
        message,
        statusCode: 404,
        level: 'warn',
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (err) {
    next(new Error(err));
  }
};

//create new element
exports.create = async (req, res, next) => {
  const { body = {} } = req;
  const document = new Model(body);

  try {
    const doc = await document.save();
    res.status(201);
    res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    next(new Error(err));
  }
};

//view all elements
exports.all = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);
  const populate = referencesNames.join(' ');

  const all = Model.find({})
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit)
    .populate(populate);
  const count = Model.countDocuments();

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total] = data;
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: docs,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction,
      },
    });
  } catch (err) {
    next(new Error(err));
  }
};

//read one element
exports.read = async (req, res, next) => {
  const { doc = {} } = req;

  res.json({
    success: true,
    data: doc,
  });
};

//update one element
exports.update = async (req, res, next) => {
  const { body = {}, params = {} } = req;

  Object.assign(doc, body);

  try {
    const updated = await doc.save();
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(new Error(err));
  }
};

//delete element
exports.delete = async (req, res, next) => {
  const { doc = {} } = req;

  try {
    const removed = await doc.remove();
    res.json({
      success: true,
      data: removed,
    });
  } catch (err) {
    next(new Error(err));
  }
};
