module.exports = (sequelize, DataType) => {
    const Items = sequelize.define("Items", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        itemID: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        itemName: {
            type: DataType.TEXT,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        price: {
            type: DataType.DOUBLE, // Changed from totalcredits to price, with DOUBLE type to handle monetary values
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataType.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        material: {
            type: DataType.TEXT, // Assuming an item might have a primary material used
            allowNull: true // This could be nullable if not all items require a specific material
        },
        creator: {
            type: DataType.TEXT, // Changed from instructor to creator
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        classMethods: {
            associate: (models) => {
                Items.belongsTo(models.Users); // Assuming that each item can be linked to a user
                // Potentially add more associations, e.g., belongsToMany with materials, etc.
            }
        }
    });
    return Items;
};
