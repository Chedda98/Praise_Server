const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { user, praise, praiseTarget } = require('../models/index');
const sequelize = require('sequelize');

module.exports = {
  praiserUp: async (req, res) => {
    const userIdx = req.userIdx;
    const { praisedName } = req.body;
    
    if (!praisedName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    const praiserResult = await praiseTarget.create({
      praisedName: praisedName
    });

    const { id } = praiserResult;

    const toastMsgResult = await praiseTarget.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'toastCount']],
      where: {
        userId: userIdx
      } 
    });

    const { toastCount } = toastMsgResult[0].dataValues;

    levelCheck = false;

    if (toastCount == 5 || toastCount == 10 || toastCount == 30 || toastCount == 50 || toastCount == 100) {
      levelCheck = true;
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISERUP_SUCCESS, {
      id,
      levelCheck
    }));
},

  praiseTarget: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const praiseUsers = await praiseTarget.findAll({
        attributes: ['name'],
        limit: 3,
        where: {
          userId: userIdx
        } 
      });
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LATELY_PRAISE_USER, praiseUsers));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },

  praiseCollection: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const collectionPraise = await praiseTarget.findAll({
        attributes: ['praisedName'],
        include: [{
          model: praise,
          attributes: ['today_praise']
        }, {
          model: user,
          attributes: [],
          where: {
            id: userIdx
          }
        }],
      });

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const praiseCountResult = await praiseTarget.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('praiseTarget.id')), 'praiseCount']]
      });

      const { praiseCount } = praiseCountResult[0].dataValues;
      const { nickName } = userNickName[0];
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PRAISE_ALL_COLLECTION, {
        collectionPraise,
        nickName,
        praiseCount
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}