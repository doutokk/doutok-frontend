import styled from "styled-components";

const AboutContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Link = styled.a`
  color: #1890ff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>关于 Doutok Shop</Title>
      <Section>
        <h2>项目简介</h2>
        <p>
          Doutok
          是一个模仿抖音商城的电商平台演示项目。本项目主要用于学习和展示现代Web开发技术。
        </p>
      </Section>

      <Section>
        <h2>项目地址</h2>
        <p>
          后端仓库：
          <Link href="https://github.com/doutokk/doutok" target="_blank">
            github.com/doutokk/doutok
          </Link>
        </p>
        <p>
          前端仓库：
          <Link
            href="https://github.com/doutokk/doutok-frontend"
            target="_blank"
          >
            github.com/doutokk/doutok-frontend
          </Link>
        </p>
      </Section>

      <Section>
        <h2>技术栈</h2>
        <p>前端：React、TypeScript</p>
        <p>后端：Go、Kitex、gRPC、Consul</p>
      </Section>

      <Section>
        <h2>后端架构</h2>
        <p>采用现代微服务架构设计：</p>
        <ul>
          <li>微服务框架：
            <ul>
              <li>基于字节跳动开源的 Kitex RPC 框架</li>
              <li>高性能的 gRPC 通信</li>
              <li>服务间通信采用 Protobuf 序列化</li>
            </ul>
          </li>
          <li>服务发现与注册：
            <ul>
              <li>使用 Consul 进行服务注册与发现</li>
              <li>基于健康检查的服务状态管理</li>
            </ul>
          </li>
          <li>网关层设计：
            <ul>
              <li>BFF (Backend For Frontend) 服务</li>
              <li>统一的 API 聚合层</li>
              <li>请求响应转换与适配</li>
            </ul>
          </li>
          <li>核心微服务：
            <ul>
              <li>用户服务 - 处理用户认证与管理</li>
              <li>商品服务 - 商品信息与库存管理</li>
              <li>订单服务 - 订单流程与支付集成</li>
              <li>购物车服务 - 购物车数据管理</li>
            </ul>
          </li>
        </ul>
      </Section>

      <Section>
        <h2>部署与云原生技术</h2>
        <p>本项目采用现代云原生技术栈进行部署和运维：</p>
        <ul>
          <li>容器编排：Kubernetes (K8s)</li>
          <li>包管理：Helm Charts</li>
          <li>持续集成：GitHub Actions</li>
          <li>持续部署：ArgoCD</li>
          <li>
            DevOps实践：
            <ul>
              <li>GitOps 工作流</li>
              <li>基础设施即代码（IaC）</li>
              <li>声明式配置管理</li>
            </ul>
          </li>
          <li>
            云原生特性：
            <ul>
              <li>容器化应用部署</li>
              <li>自动扩缩容</li>
              <li>服务发现与负载均衡</li>
            </ul>
          </li>
        </ul>
      </Section>
    </AboutContainer>
  );
};

export default About;
