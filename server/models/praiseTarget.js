module.exports = (sequelize, DataTypes) => {
    return sequelize.define('praiseTarget', {
        //모델의 Attributes (Column)을 정의하는곳
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        praiseId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'praise',
                key: 'id',
            }
        }
    }, {
        //모델의 옵션들을 지정하는 곳
        freezeTableName: true,
        timestamps: false,
    });
};