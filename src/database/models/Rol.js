module.exports = (sequelize, dataTypes) => {
    let alias = 'Rol';

    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.VARCHAR(20)
        }
    };

    let config = {
        tablename: 'rols',
        timestamps: true,
        underscored: true
    };

    const Rol = sequelize.define(alias, cols, config);

    Rol.associate = (models)=> {
        Rol.hasMany(models.User, {
            as: 'users',
            foreignKey: 'rol_id'
        })
    }
}