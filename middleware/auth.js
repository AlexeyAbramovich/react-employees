const jwt = require('jsonwebtoken')
const { prisma } = require('../prisma/prisma-client')

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET).id
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Не авторизован' })
  }
}

module.exports = {
  auth,
}
