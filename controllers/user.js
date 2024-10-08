const { prisma } = require('../prisma/prisma-client')
const bcrypt = require('bcrypt')
const { response } = require('express')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

/**
 * @route POST /api/user/login
 * @desc Логин
 * @access Public
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Пожалуйста заполните обязательные поля' })
    }

    const user = await prisma.user.findFirst({ where: { email } })

    const isPassowordCorrect =
      user && (await bcrypt.compare(password, user.password))

    const secret = process.env.JWT_SECRET

    if (user && isPassowordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user }, secret, { expiresIn: '30d' }),
      })
    } else {
      return res
        .status(400)
        .json({ message: 'Неверно введён логин или пароль' })
    }
  } catch {
    res.status(500).json({ message: 'Упс... что-то пошло не так' })
  }
}

/**
 * @route POST /api/user/register
 * @desc Регистрация
 * @access Public
 */

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: 'Пожалуйста, заполните обязательные поля' })
    }

    const registeredUser = await prisma.user.findFirst({ where: { email } })

    if (registeredUser) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    const secret = process.env.JWT_SECRET

    if (user && secret) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user }, secret, { expiresIn: '30d' }),
      })
    } else {
      return res
        .status(400)
        .json({ message: 'Не удалось создать пользователя' })
    }
  } catch {
    res.status(500).json({ message: 'Упс... что-то пошло не так' })
  }
}

/**
 * @route GET /api/user/current
 * @desc Текущий пользователь
 * @access Private
 */

const current = async (req, res) => {
  return res.status(200).json(req.user)
}

module.exports = {
  login,
  register,
  current,
}
