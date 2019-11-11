import React from 'react';
import { Layout, Typography } from 'antd';

const { Title } = Typography;
const { Header } = Layout;

const AppHeader = () => {
    return (
    <Header>
    <Title>
      Movie List Application !
    </Title>
   </Header>
);
}

export default AppHeader;