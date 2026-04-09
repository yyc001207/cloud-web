export interface ResourceLink {
  label: string
  icon: string
  url: string
}

export interface Resource {
  id: string
  name: string
  description: string
  icon: string
  tag: string
  tagColor: 'primary' | 'secondary' | 'tertiary'
  links: ResourceLink[]
  actionLabel: string
  actionUrl: string
}

export const resources: Resource[] = [
  {
    id: '1',
    name: '中央集群控制器',
    description: '负责全域节点的状态调度与资源分配，支持多维度的自动化负载平衡。',
    icon: 'dns',
    tag: 'Server',
    tagColor: 'primary',
    links: [
      { label: 'API手册', icon: 'description', url: '#' },
      { label: '部署指南', icon: 'rocket_launch', url: '#' }
    ],
    actionLabel: '进入系统',
    actionUrl: '#'
  },
  {
    id: '2',
    name: '数据湖分析终端',
    description: '实时PB级数据检索与可视化呈现，内置50+预设看板模板。',
    icon: 'analytics',
    tag: 'Data',
    tagColor: 'secondary',
    links: [
      { label: '数据字典', icon: 'description', url: '#' }
    ],
    actionLabel: '访问看板',
    actionUrl: '#'
  },
  {
    id: '3',
    name: '堡垒机访问网关',
    description: '统一身份认证与操作审计平台，支持双因子验证与动态权限申请。',
    icon: 'security',
    tag: 'Shield',
    tagColor: 'tertiary',
    links: [
      { label: '权限规则', icon: 'description', url: '#' }
    ],
    actionLabel: '安全认证',
    actionUrl: '#'
  },
  {
    id: '4',
    name: '容器编排平台',
    description: '基于Kubernetes的容器化应用管理平台，支持自动扩缩容和滚动更新。',
    icon: 'view_quilt',
    tag: 'Server',
    tagColor: 'primary',
    links: [
      { label: '集群状态', icon: 'monitoring', url: '#' },
      { label: '应用模板', icon: 'widgets', url: '#' }
    ],
    actionLabel: '管理集群',
    actionUrl: '#'
  },
  {
    id: '5',
    name: '日志分析中心',
    description: '分布式日志收集、存储与分析平台，支持实时检索和异常告警。',
    icon: 'receipt_long',
    tag: 'Data',
    tagColor: 'secondary',
    links: [
      { label: '查询语法', icon: 'code', url: '#' }
    ],
    actionLabel: '查看日志',
    actionUrl: '#'
  },
  {
    id: '6',
    name: '密钥管理系统',
    description: '企业级密钥生命周期管理，支持加密密钥的生成、存储和轮换。',
    icon: 'key',
    tag: 'Shield',
    tagColor: 'tertiary',
    links: [
      { label: '安全策略', icon: 'policy', url: '#' },
      { label: '审计日志', icon: 'history', url: '#' }
    ],
    actionLabel: '管理密钥',
    actionUrl: '#'
  }
]
