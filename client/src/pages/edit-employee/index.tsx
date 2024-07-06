import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useEditEmployeeMutation,
  useGetEmployeeQuery,
} from '../../app/services/employees'
import { Row, Spin } from 'antd'
import { Layout } from '../../components/layout'
import { EmployeeForm } from '../../components/employee-form'
import { Employee } from '@prisma/client'
import { Paths } from '../../paths'
import { isErrorWithMessage } from '../../app/utils/is-error-with-message'

export const EditEmployee = () => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const [error, setError] = useState('')
  const { data, isLoading } = useGetEmployeeQuery(params.id || '')
  const [editEmployee] = useEditEmployeeMutation()

  if (isLoading) {
    return (
      <Spin
        tip="Загрузка..."
        size="large"
        style={{
          position: 'absolute',
          top: '50%',
          marginLeft: '50%',
          marginRight: '50%',
        }}
      />
    )
  }

  const handleEditUser = async (employee: Employee) => {
    try {
      const editedEmployee = {
        ...data,
        ...employee,
      }

      await editEmployee(editedEmployee).unwrap()

      navigate(`${Paths.status}/updated`)
    } catch (err) {
        const maybeError = isErrorWithMessage(err)

        if(maybeError){
            setError(err.data.message)
        }else{
            setError('Неизвестная ошибка')
        }
    }
  }

  return (
    <Layout>
      <Row align="middle" justify="center">
        <EmployeeForm
          title="Редактировать сотрудника"
          btnText="Редактировать"
          error={error}
          employee={data}
          onFinish={handleEditUser}
        />
      </Row>
    </Layout>
  )
}
