import { Spin } from 'antd'
import { useCurrentQuery } from '../../app/services/auth'

export const Auth = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = useCurrentQuery()

  if (isLoading) {
    return <Spin tip='Загрузка...' size='large' style={{position: 'absolute', top: '50%', marginLeft: '50%', marginRight: '50%'}}/>
  }

  return children
}
