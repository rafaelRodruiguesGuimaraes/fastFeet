import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import Admin from '../app/models/Admin';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import File from '../app/models/File';
import DeliveryProblems from '../app/models/DeliveryProblems';

const models = [Admin, Recipient, Deliveryman, File, Order, DeliveryProblems];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model =>
        model.associate ? model.associate(this.connection.models) : null
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://192.168.99.100:27017/fastfeet',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
      }
    );
  }
}

export default new Database();
