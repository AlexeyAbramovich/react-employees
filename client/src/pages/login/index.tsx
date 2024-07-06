import { Card, Form, Row, Space, Typography } from 'antd'
import { Layout } from '../../components/layout'
import { CustomInput } from '../../components/custom-input'
import { PasswordInput } from '../../components/password-input/input'
import { CustomButton } from '../../components/custom-button'
import { Link, useNavigate } from 'react-router-dom'
import { Paths } from '../../paths'
import { UserData, useLoginMutation } from '../../app/services/auth'
import { isErrorWithMessage } from '../../app/utils/is-error-with-message'
import { useState } from 'react'
import { ErrorMessage } from '../../components/error-message'

export const Login = () => {
  const navigate = useNavigate()
  const [loginUser, loginUserResult] = useLoginMutation()
  const [error, setError] = useState('')

  const login = async (data: UserData) => {
    try {
      await loginUser(data).unwrap()
      navigate('/')
    } catch (err) {
      const maybeError = isErrorWithMessage(err)
      if (maybeError) {
        setError(err.data.message)
      } else {
        setError('Неизвестная ошибка')
      }
    }
  }

  return (
    <Layout>
      <Row align="middle" justify="center">
        <Card title="Войдите" style={{ width: '30rem' }}>
          <Form onFinish={login}>
            <CustomInput type="email" name="email" placeholder="Email" />
            <PasswordInput name="password" placeholder="Пароль" />
            <CustomButton type="primary" htmlType="submit">
              Войти
            </CustomButton>
            <Space direction="vertical" size="large">
              <Typography.Text>
                Нет аккаунта? <Link to={Paths.register}>Создать аккаунт</Link>
              </Typography.Text>
              <ErrorMessage message={error} />
            </Space>
          </Form>
        </Card>
      </Row>
    </Layout>
  )
}
