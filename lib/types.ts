export interface Scenario {
  name: string
  description: string
  slug: string
  flowKey: string
  disabled?: boolean
}

export interface Company {
  name: string
  domain: string
  pushedInto: string[]
}

export interface Turtle {
  name: string
  badge_color: string
}
