const { prisma } = require('../prisma/prisma-client')

/**
 * @route GET/api/emloyees
 * @desc Получение всех сотрудников
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany()
    res.status(200).json(employees)
  } catch {
    res.status(400).json({ message: 'Не удалось получить сотрудников' })
  }
}

/**
 * @route GET/api/emloyees
 * @desc Добавление сотрудника
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body
    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      res.status(400).json({ message: 'Все поля обязательные' })
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    })

    return res.status(201).json(employee)
  } catch {}
}

/**
 * @route POST/api/emloyees/remove/:id
 * @desc Удаление сотрудника
 * @access Private
 */
const remove = async (req, res) => {
  try {
    const { id } = req.body
    await prisma.employee.delete({
      where: { id },
    })
    res.status(204).json({ message: 'Removed successfully' })
  } catch {
    return res.status(500).json({ message: 'Не удалось удалить сотрудника' })
  }
}

/**
 * @route PUT/api/emloyees/edit/:id
 * @desc Редактирование сотрудника
 * @access Private
 */
const edit = async (req, res) => {
  const data = req.body
  const id = data.id
  try {
    await prisma.employee.update({
      where: { id },
      data,
    })
    res.status(204).json({ message: 'Edited successfully' })
  } catch {
    return res
      .status(500)
      .json({ message: 'Не удалось редактировать сотрудника' })
  }
}

/**
 * @route GET/api/emloyees/:id
 * @desc Получение сотрудника
 * @access Private
 */
const employee = async (req, res) => {
  const { id } = req.params
  try {
    const employee = await prisma.employee.findUnique({ where: { id } })
    res.status(200).json(employee)
  } catch {
    return res.status(500).json({ message: 'Не удалось получить сотрудника' })
  }
}

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
}
