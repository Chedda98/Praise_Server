const statusCdoe = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const util = require('../modules/util');
const { praise, user } = require('../models');
//const sequelize = require("../models").sequelize;
const sequelize = require('sequelize');

module.exports = {
  userLevel: async (req, res) => {
    const userIdx = req.params.userIdx;

    try {
      const userResult = await user.findAll({
        where: {
          id: parseInt(userIdx)
        }
      })

      // 현재 유저 레벨 
      const userLevel = userResult[0].userLevel;

      // const praiseCount = await user.count({
      //   include: [{
      //     model: praise,
      //     as: 'praiser',
          
      //     where: {
      //       isDo: true
      //     }
      //   }],
      // })
      const praiseCount = await user.findAll({
        attributes: [[sequelize.fn('COUNT', 'id'), 'likeCount']],
        include: [{
          model: praise,
          as: 'praiser',
        }]
      })
      // isDO 테이블 이름

      res.status(statusCdoe.OK).send(util.success(statusCdoe.OK, responseMessage.PRAISE_LEVEL, {
        userLevel,
        needLikeCount: userLevel * 20 - praiseCount[0].dataValues.likeCount
      }));
    } catch (err) {
      res.status(statusCdoe.INTERNAL_SERVER_ERROR).send(util.fail(statusCdoe.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}