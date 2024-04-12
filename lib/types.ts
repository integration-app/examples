export interface Scenario {
  name: string
  description: string
  slug: string
  universalFlowId: string
  flowKey: string
  disabled?: boolean
}

export interface Company {
  name: string
  domain: string
  pushedInto: { [key: string]: any }
}

export interface Turtle {
  name: string
  badge_color: string
}
