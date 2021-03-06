import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation fails' });
    }

    const { name, email } = await Deliveryman.create(req.body);

    return res.json({ name, email });
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (email) {
      if (email !== deliveryman.email) {
        const deliverymanExists = await Deliveryman.findOne({
          where: { email },
        });

        if (deliverymanExists) {
          return res
            .status(401)
            .json({ error: 'this email is already in use' });
        }
      }
    }
    await deliveryman.update(req.body);

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
