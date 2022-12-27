import { Restaurant } from '../config/sequelize.js';
import generateToken from '../utils/tokenGenerator.js';
import { removeS3, uploadS3 } from '../utils/imgUploader.js';

export async function registerRestaurant(req, res, next) {
  try {
    const { name, email, phone, password, description } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Invalid input!');
    }

    const restaurantExists = await Restaurant.findOne({
      where: { email: email.toLowerCase() },
    });

    if (restaurantExists) {
      res.status(400);
      throw new Error('This email is linked to another account!');
    }

    const restaurant = await Restaurant.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      description,
    });

    const payload = { id: restaurant.id, email: restaurant.email };

    res.status(201).json({
      id: restaurant.id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.role,
      description: restaurant.description,
      token: `Bearer ${generateToken(payload)}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginRestaurant(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Invalid input!');
    }

    const restaurant = await Restaurant.findOne({
      where: { email: email.toLowerCase() },
    });

    if (restaurant) {
      if (await restaurant.matchPassword(password)) {
        const payload = {
          id: restaurant.id,
          email: restaurant.email,
        };

        res.status(200).json({
          id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          phone: restaurant.role,
          description: restaurant.description,
          token: `Bearer ${generateToken(payload)}`,
        });
      } else {
        res.status(401);
        throw new Error('Incorrect email or password!');
      }
    } else {
      res.status(404);
      throw new Error('Restaurant not found!');
    }
  } catch (error) {
    next(error);
  }
}

export async function getRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] },
    });

    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404);
      throw new Error('Restaurant not found!');
    }
  } catch (error) {
    next(error);
  }
}

export async function getAllRestaurants(req, res, next) {
  try {
    // without password
    const restaurants = await Restaurant.findAll({
      attributes: { exclude: ['password'] },
    });

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
}

export async function updateRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { id: req.params.id, email: req.restaurant.email },
    });

    if (restaurant) {
      const { name, email, phone, description } = req.body;

      if (name) restaurant.name = name;
      if (email) restaurant.email = email;
      if (phone) restaurant.phone = phone;
      if (description) restaurant.description = description;

      const updatedRestaurant = await restaurant.save();
      updatedRestaurant.password = undefined;

      res.status(200).json(updatedRestaurant);
    } else {
      res.status(404);
      throw new Error('Restaurant not found!');
    }
  } catch (error) {
    next(error);
  }
}

export async function setRestaurantImage(req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { id: req.restaurant.id },
      attributes: { exclude: ['password'] },
    });

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found!');
    }

    uploadS3.single('file')(req, res, async function (err) {
      if (err) {
        res.status(400);
        next(err);
        return;
      }

      if (!req.file) {
        res.status(400);
        next(new Error('No file provided!'));
        return;
      }

      if (restaurant.img) {
        removeS3(restaurant.img);
      }

      restaurant.img = req.file.key;
      const updatedRestaurant = await restaurant.save();
      updatedRestaurant.password = undefined;

      res.status(200).json(updatedRestaurant);
    });
  } catch (error) {
    next(error);
  }
}

export async function removeRestaurantImage(req, res, next) {
  try {
    const restaurant = await Restaurant.findOne({
      where: { id: req.restaurant.id },
      attributes: { exclude: ['password'] },
    });

    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found!');
    }

    if (!restaurant.img) {
      res.status(200).json(restaurant);
      return;
    }

    removeS3(restaurant.img);
    restaurant.img = null;

    const updatedRestaurant = await restaurant.save();
    updatedRestaurant.password = undefined;

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
}
